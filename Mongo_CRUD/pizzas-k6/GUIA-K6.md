# Validación del CRUD de pizzas con k6

## Objetivo y alcance

Automatizar las validaciones de `PIzzas.postman_collection.json` y medir el rendimiento del CRUD con una carga básica. Se conserva el contrato comprobado por los scripts de Postman y se añade una consulta después del PUT para verificar persistencia.

Estado: script preparado; no ejecutado contra la API real. La colección no incluye respuestas guardadas ni una URL base configurada. El contrato se deriva de sus aserciones, no de respuestas observadas. Los resultados quedan pendientes hasta ejecutar las pruebas.

## Contrato y casos

Base predeterminada: `http://localhost:3000`, configurable con `BASE_URL`.

| Paso | Método y ruta | Estado | Validación |
|---|---|---|---|
| Listar | GET /api/v1/pizzas | 200 | data.pizzas_disponibles es un arreglo |
| Crear | POST /api/v1/pizzas | 201 | data.pizza contiene id, nombre, descripcion correctos y propiedad _id |
| Consultar | GET /api/v1/pizzas/:id | 200 | data.pizza coincide con los datos creados |
| Actualizar | PUT /api/v1/pizzas/:id | 200 | data.pizza contiene los valores actualizados |
| Verificar actualización | GET /api/v1/pizzas/:id | 200 | Los cambios del PUT persisten |
| Eliminar | DELETE /api/v1/pizzas/:id | 200 | data.pizza.id coincide con el eliminado |
| Verificar eliminación | GET /api/v1/pizzas/:id | 404 | La respuesta contiene la propiedad message |

El campo `id` es numérico y distinto de `_id` de MongoDB. POST envía `id`, `nombre` y `descripcion`; PUT envía únicamente `nombre` y `descripcion`. Se conservan los textos de prueba de la colección. No se exige un texto específico en `message` porque Postman solo valida su existencia.

La colección tiene `baseUrl` vacío y variables `pizzaID` y `pizzaId`; sus solicitudes usan `pizzaId`. k6 usa BASE_URL y un ID numérico local por recorrido, sin depender de variables de Postman.

## Preparación

1. Instalar k6 según el sistema: https://grafana.com/docs/k6/latest/set-up/install-k6/
2. Comprobar la instalación con `k6 version`.
3. Iniciar MongoDB y la API con el procedimiento habitual del proyecto.
4. Configurar la API para una base de pruebas: se crean y eliminan pizzas.
5. Abrir una terminal dentro de la carpeta que contiene `pizzas.k6.js`.

No se ejecuta con `node` ni necesita paquetes npm. El script no configura autenticación porque la colección no la incluye. Si la API usa otro puerto, cambiar BASE_URL en los comandos.

## Ejecución funcional

```bash
k6 run -e BASE_URL=http://localhost:3000 -e MODE=funcional pizzas.k6.js
```

Un usuario virtual recorre el CRUD una vez. Si la creación funciona, hay siete solicitudes y 23 comprobaciones. Primero resolver cualquier fallo de esta prueba antes de realizar carga.

## Ejecución de carga

```bash
k6 run -e BASE_URL=http://localhost:3000 -e MODE=carga pizzas.k6.js
```

Simula cinco usuarios virtuales durante 30 segundos, con una pausa de un segundo al final de cada recorrido y hasta 30 segundos adicionales para terminar iteraciones activas. Cinco usuarios no equivalen a cinco peticiones por segundo: el ritmo depende también de la latencia y de las pausas.

Cada recorrido crea su propia pizza. El ID combina una base temporal común generada en setup con el número global de iteración; hay una protección explícita de 1000 recorridos. Ejecutar una sola instancia del script a la vez sobre la base de pruebas. Estos parámetros están diseñados para las dos pruebas locales incluidas, no para ejecución distribuida.

El bloque finally intenta eliminar los registros cuya creación se confirmó con 201, incluso si fallan validaciones posteriores. Una interrupción forzada, un timeout de creación o una caída de la API puede dejar registros; revisar los IDs registrados en consola. Nunca se limpia toda la colección.

## Criterios de aprobación

| Métrica | Criterio | Interpretación |
|---|---|---|
| checks | rate == 1 | Todas las verificaciones deben pasar |
| http_req_failed | rate == 0 | Ningún estado HTTP inesperado ni fallo de transporte |
| http_req_duration por paso | p(95) < 500 | Percentil 95 inferior a 500 ms en cada operación |

Son objetivos iniciales propuestos para este ejercicio, no requisitos obtenidos de Postman. Un 404 solo es esperado en la última consulta; en los demás pasos fallará. El callback de estado esperado evita contabilizar ese 404 correcto como error HTTP.

El percentil 95 describe la distribución de los tiempos registrados. Con una sola muestra no permite concluir rendimiento: usar la prueba funcional para verificar comportamiento y la de carga para una primera observación, sin afirmar capacidad máxima.

## Evidencias automáticas

Al terminar, handleSummary escribe en la carpeta actual:

- `resultados-funcional.txt` y `resultados-funcional.json` para MODE=funcional.
- `resultados-carga.txt` y `resultados-carga.json` para MODE=carga.

El TXT contiene métricas, umbrales y conteos de cada check; el JSON conserva el resumen estructurado. Se muestra el mismo informe de texto en consola. Repetir un modo sobrescribe sus archivos: renombrar los resultados si se necesitan varias corridas. Una interrupción temprana puede impedir generar el resumen.

Conservar también una captura de consola y registrar fecha, versión de k6, versión del proyecto, sistema operativo, CPU/RAM, ubicación de MongoDB y volumen inicial de datos. Si API y k6 comparten equipo, compiten por recursos; indicar esta condición al interpretar tiempos.

## Plantilla de resultados

Completar con las cifras obtenidas, sin sustituirlas por valores supuestos.

| Escenario | Solicitudes | Checks aprobados / total | Error HTTP % | Resultado de umbrales |
|---|---|---|---|---|
| Funcional | Pendiente | Pendiente | Pendiente | Pendiente |
| Carga | Pendiente | Pendiente | Pendiente | Pendiente |

| Operación | Promedio (ms) | p95 (ms) | Cumple p95 < 500 ms |
|---|---|---|---|
| Listar | Pendiente | Pendiente | Pendiente |
| Crear | Pendiente | Pendiente | Pendiente |
| Consultar | Pendiente | Pendiente | Pendiente |
| Actualizar | Pendiente | Pendiente | Pendiente |
| Verificar actualización | Pendiente | Pendiente | Pendiente |
| Eliminar | Pendiente | Pendiente | Pendiente |
| Verificar eliminación | Pendiente | Pendiente | Pendiente |

Para cada fallo, anotar paso, resultado esperado, resultado obtenido y acción correctiva. Concluir únicamente sobre el escenario ejecutado. No se incluyen todavía pruebas de campos inválidos, duplicados, autenticación, estrés ni resistencia prolongada; faltan sus contratos o quedan fuera de la colección.

## Referencias oficiales

- Checks: https://grafana.com/docs/k6/latest/using-k6/checks/
- Thresholds: https://grafana.com/docs/k6/latest/using-k6/thresholds/
- Estados esperados: https://grafana.com/docs/k6/latest/javascript-api/k6-http/expected-statuses/
- Resumen personalizado: https://grafana.com/docs/k6/latest/results-output/end-of-test/custom-summary/
