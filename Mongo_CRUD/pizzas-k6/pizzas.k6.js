import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';

const MODE = __ENV.MODE || 'funcional';
if (!['funcional', 'carga'].includes(MODE)) throw new Error('MODE debe ser funcional o carga');
const BASE_URL = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const URL = `${BASE_URL}/api/v1/pizzas`;
const STEPS = ['listar', 'crear', 'consultar', 'actualizar', 'verificar_actualizacion', 'eliminar', 'verificar_eliminacion'];
const thresholds = { checks: ['rate==1'], http_req_failed: ['rate==0'] };
for (const step of STEPS) {
  thresholds[`http_req_duration{paso:${step}}`] = ['p(95)<500'];
}
export const options = {
  scenarios: {
    crud: MODE === 'carga'
      ? { executor: 'constant-vus', vus: 5, duration: '30s', gracefulStop: '30s' }
      : { executor: 'shared-iterations', vus: 1, iterations: 1, maxDuration: '2m' },
  },
  thresholds,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)'],
};

export function setup() {
  return { idBase: Date.now() * 1000 };
}
function params(step, status) {
  return {
    headers: { 'Content-Type': 'application/json' },
    tags: { paso: step, name: step },
    responseCallback: http.expectedStatuses(status),
    timeout: '10s',
    redirects: 0,
  };
}
function json(response) {
  try { return response.json(); } catch (_) { return null; }
}
function validate(response, step, status, expected, mongoId = false) {
  const body = json(response);
  const pizza = body && body.data && body.data.pizza;
  const tests = {
    [`${step}: HTTP ${status}`]: () => response.status === status,
    [`${step}: id correcto`]: () => !!pizza && pizza.id === expected.id,
  };
  if (expected.nombre !== undefined) {
    tests[`${step}: nombre correcto`] = () => !!pizza && pizza.nombre === expected.nombre;
    tests[`${step}: descripcion correcta`] = () => !!pizza && pizza.descripcion === expected.descripcion;
  }
  if (mongoId) tests[`${step}: propiedad _id`] = () => !!pizza && Object.prototype.hasOwnProperty.call(pizza, '_id');
  return check(response, tests, { paso: step });
}
export default function (data) {
  const iteration = exec.scenario.iterationInTest;
  // Límite explícito: reserva 1000 IDs por ejecución local.
  if (iteration >= 1000) throw new Error('Límite de 1000 recorridos alcanzado');
  const id = data.idBase + iteration;
  const original = { id, nombre: 'Pizza Postman', descripcion: 'Pizza creada durante las pruebas' };
  const updated = { nombre: 'Pizza Postman actualizada', descripcion: 'Pizza modificada mediante una petición PUT' };
  const itemUrl = `${URL}/${id}`;
  let response = http.get(URL, params('listar', 200));
  const list = json(response);
  check(response, {
    'listar: HTTP 200': r => r.status === 200,
    'listar: data.pizzas_disponibles es array': () => !!list && !!list.data && Array.isArray(list.data.pizzas_disponibles),
  }, { paso: 'listar' });

  response = http.post(URL, JSON.stringify(original), params('crear', 201));
  validate(response, 'crear', 201, original, true);
  // No borrar un ID si el servidor no confirmó que lo creó esta iteración.
  if (response.status !== 201) {
    console.error(`Creación no confirmada para id=${id}; HTTP ${response.status}. Revisar posible registro residual.`);
    sleep(1);
    return;
  }
  try {
    response = http.get(itemUrl, params('consultar', 200));
    validate(response, 'consultar', 200, original);
    response = http.put(itemUrl, JSON.stringify(updated), params('actualizar', 200));
    validate(response, 'actualizar', 200, { id, ...updated });
    response = http.get(itemUrl, params('verificar_actualizacion', 200));
    validate(response, 'verificar_actualizacion', 200, { id, ...updated });
  } finally {
    response = http.del(itemUrl, null, params('eliminar', 200));
    validate(response, 'eliminar', 200, { id });
    if (response.status !== 200) console.error(`Revisar limpieza de pizza id=${id}`);
    response = http.get(itemUrl, params('verificar_eliminacion', 404));
    const body = json(response);
    check(response, {
      'verificar_eliminacion: HTTP 404': r => r.status === 404,
      'verificar_eliminacion: propiedad message': () => !!body && Object.prototype.hasOwnProperty.call(body, 'message'),
    }, { paso: 'verificar_eliminacion' });
  }
  sleep(1);
}

export function handleSummary(data) {
  return {
    'reporte-pizzas.html': htmlReport(data),
    'resultados-pizzas.json': JSON.stringify(data, null, 2),
  };
}
