import { obtenerDb } from "../config/mongo.js";

/**
 * Obtiene la colección de pizzas de MongoDB.
 * @returns {import("mongodb").Collection} Colección de pizzas.
 */
function obtenerColeccion() {
    return obtenerDb().collection("pizzas");
}

/**
 * Obtiene todas las pizzas registradas.
 * @returns {Promise<Array<Object>>} Lista de pizzas.
 */
export async function ObtnerPizzas() {
    const pizzas = await obtenerColeccion()
        .find({})
        .toArray();

    return pizzas;
}

/**
 * Busca una pizza por su identificador.
 * @param {number|string} id - Identificador numérico de la pizza.
 * @returns {Promise<Object|undefined>} Pizza encontrada o undefined.
 */
export async function obtenerPizzaPorIdAsync(id) {
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico)) {
        return undefined;
    }

    const pizza = await obtenerColeccion().findOne({
        id: idNumerico
    });

    return pizza ?? undefined;
}

/**
 * Agrega una pizza a la colección.
 * La pizza debe contener id, nombre y descripción.
 * @param {Object} pizza - Datos de la pizza que se agregará.
 * @param {number} pizza.id - Identificador numérico de la pizza.
 * @param {string} pizza.nombre - Nombre de la pizza.
 * @param {string} pizza.descripcion - Descripción de la pizza.
 * @returns {Promise<Object>} Pizza almacenada, incluyendo el _id generado.
 */
export async function agregarPizzaAsync(pizza) {
    const nuevaPizza = {
        ...pizza,
        id: Number(pizza.id)
    };

    const resultado = await obtenerColeccion().insertOne(nuevaPizza);

    return {
        ...nuevaPizza,
        _id: resultado.insertedId
    };
}

/**
 * Actualiza los datos de una pizza existente según su identificador.
 * @param {number|string} id - Identificador numérico de la pizza.
 * @param {Object} nuevosDatos - Propiedades que se actualizarán.
 * @returns {Promise<Object|undefined>} Pizza actualizada o undefined.
 */
export async function actualizarPizzaAsync(id, nuevosDatos) {
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico)) {
        return undefined;
    }

    // No permitimos modificar los identificadores de la pizza.
    const { _id, id: idIgnorado, ...datosActualizables } = nuevosDatos;

    const resultado = await obtenerColeccion().updateOne(
        { id: idNumerico },
        { $set: datosActualizables }
    );

    if (resultado.matchedCount === 0) {
        return undefined;
    }

    const pizzaActualizada = await obtenerColeccion().findOne({
        id: idNumerico
    });

    return pizzaActualizada ?? undefined;
}

/**
 * Elimina una pizza según su identificador.
 * @param {number|string} id - Identificador numérico de la pizza.
 * @returns {Promise<Object|undefined>} Pizza eliminada o undefined.
 */
export async function borrarPizzaAsync(id) {
    const idNumerico = Number(id);

    if (!Number.isInteger(idNumerico)) {
        return undefined;
    }

    const pizza = await obtenerColeccion().findOne({
        id: idNumerico
    });

    if (!pizza) {
        return undefined;
    }

    await obtenerColeccion().deleteOne({
        id: idNumerico
    });

    return pizza;
}