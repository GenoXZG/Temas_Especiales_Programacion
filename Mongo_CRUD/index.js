import express from "express";

import {
    ObtnerPizzas,
    obtenerPizzaPorIdAsync,
    agregarPizzaAsync,
    actualizarPizzaAsync,
    borrarPizzaAsync
} from "./repositorios/repositorio.js";

const app = express();
const PORT = 3000;

// Permite recibir JSON enviado desde Postman.
app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        mensaje: "Hola mundo, desde Node.js"
    });
});

/**
 * Obtiene todas las pizzas.
 */
app.get("/api/v1/pizzas", async (req, res) => {
    try {
        const pizzas = await ObtnerPizzas();
        return res.status(200).json({
            message: "Pizzas obtenidas exitosamente",
            data: {
                pizzas_disponibles: pizzas
            }
        });
    } catch (error) {
        console.error("Error al obtener las pizzas:", error);
        return res.status(500).json({
            message: "Error interno al obtener las pizzas"
        });
    }
});

/**
 * Obtiene una pizza mediante su identificador.
 */
app.get("/api/v1/pizzas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pizza = await obtenerPizzaPorIdAsync(id);

        if (!pizza) {
            return res.status(404).json({
                message: `No se encontró una pizza con el id ${id}`
            });
        }

        return res.status(200).json({
            message: "Pizza obtenida exitosamente",
            data: {
                pizza
            }
        });
    } catch (error) {
        console.error("Error al obtener la pizza:", error);

        return res.status(500).json({
            message: "Error interno al obtener la pizza"
        });
    }
});

/**
 * Registra una pizza.
 */
app.post("/api/v1/pizzas", async (req, res) => {
    try {
        const { id, nombre, descripcion } = req.body;

        if (id === undefined || !nombre || !descripcion) {
            return res.status(400).json({
                message: "Los campos id, nombre y descripcion son obligatorios"
            });
        }

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "El id debe ser un número entero"
            });
        }

        const pizzaExistente = await obtenerPizzaPorIdAsync(id);

        if (pizzaExistente) {
            return res.status(409).json({
                message: `Ya existe una pizza con el id ${id}`
            });
        }

        const pizzaCreada = await agregarPizzaAsync({
            id,
            nombre,
            descripcion
        });

        return res.status(201).json({
            message: "Pizza creada exitosamente",
            data: {
                pizza: pizzaCreada
            }
        });
    } catch (error) {
        console.error("Error al crear la pizza:", error);

        return res.status(500).json({
            message: "Error interno al crear la pizza"
        });
    }
});

/**
 * Actualiza una pizza mediante su identificador.
 */
app.put("/api/v1/pizzas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        if (nombre === undefined && descripcion === undefined) {
            return res.status(400).json({
                message: "Debe enviar nombre o descripcion para actualizar"
            });
        }

        const nuevosDatos = {};

        if (nombre !== undefined) {
            nuevosDatos.nombre = nombre;
        }

        if (descripcion !== undefined) {
            nuevosDatos.descripcion = descripcion;
        }

        const pizzaActualizada = await actualizarPizzaAsync(
            id,
            nuevosDatos
        );

        if (!pizzaActualizada) {
            return res.status(404).json({
                message: `No se encontró una pizza con el id ${id}`
            });
        }

        return res.status(200).json({
            message: "Pizza actualizada exitosamente",
            data: {
                pizza: pizzaActualizada
            }
        });
    } catch (error) {
        console.error("Error al actualizar la pizza:", error);

        return res.status(500).json({
            message: "Error interno al actualizar la pizza"
        });
    }
});

/**
 * Elimina una pizza mediante su identificador.
 */
app.delete("/api/v1/pizzas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pizzaEliminada = await borrarPizzaAsync(id);

        if (!pizzaEliminada) {
            return res.status(404).json({
                message: `No se encontró una pizza con el id ${id}`
            });
        }

        return res.status(200).json({
            message: "Pizza eliminada exitosamente",
            data: {
                pizza: pizzaEliminada
            }
        });
    } catch (error) {
        console.error("Error al eliminar la pizza:", error);

        return res.status(500).json({
            message: "Error interno al eliminar la pizza"
        });
    }
});

/*
 * Puedes conservar aquí, sin cambios, los endpoints:
 *
 * GET /api/v1/tamanios
 * GET /api/v1/bebidas
 */

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});