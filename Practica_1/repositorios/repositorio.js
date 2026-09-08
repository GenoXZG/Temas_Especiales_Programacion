import { describe } from "node:test";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function ObtnerPizzas() {
    await sleep(2000);
    return[{nombre: "Hawaiana", descripcion: "Jamon y Piña"}]
}

export {ObtnerPizzas};