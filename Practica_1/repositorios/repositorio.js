import { describe } from "node:test";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let pizzas = [{ id: 1, nombre: "Hawaiana", descripcion: "Jamon y piña" }]

export async function ObtnerPizzas() {
    await sleep(2000);
    return pizzas;
}

/**
 * Regresa la pizza del id buscado o undefined si no lo encuentra
 * @param {*} id
 */
export async function obtenerPizzaPorIdAsync(id) {
    await sleep(1000)
    const pizza = pizzas.find(x => x.id == id)
}

export async function agregarPizzaAsync(pizza) {
    await sleep(1000);
    pizzas.push(pizza);
}


/**
 * Actualiza los datos de una pizza existente según su id.
 * Si encuentra la pizza, sobrescribe sus propiedades y regresa la pizza actualizada, o undefined si no la encuentra.
 * @param {number} id - Identificador de la pizza a actualizar
 * @param {Object} nuevosDatos - Objeto con los nuevos valores (nombre, descripcion)
 */
export async function actualizarPizzaAsync(id, nuevosDatos) {
    await sleep(1000)

    const index = pizzas.findIndex(x => x.id == id)

    if (index === -1) {
        return undefined
    }


    pizzas[index] = { ...pizzas[index], ...nuevosDatos }
}

/**
 * Elimina una pizza de la lista según su id.
 * @param {number} id - ID de la pizza a eliminar
 */
export async function borrarPizzaAsync(id) {
    await sleep(1000)

    const index = pizzas.findIndex(x => x.id == id)

    if (index === -1) {
        return undefined
    }
    const pizzaEliminada = pizzas.splice(index, 1)
}

