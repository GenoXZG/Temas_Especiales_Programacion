
import express from "express";
import {ObtnerPizzas, obtenerPizzaPorIdAsync, agregarPizzaAsync , actualizarPizzaAsync , borrarPizzaAsync} from './repositorios/repositorio.js'
const app = express();
const PORT = 3000; 

app.get("/", (req, res)=>{
    const saludo = { mensaje: "Hola mundo, desde nodejs"}
    return res.json(saludo);
})


app.get('/api/v1/pizzas', (req, res) => {
  res.status(200).json({
    message: 'Pizzas obtenidas exitosamente',
    data: {
      pizzas_disponibles: [
        {
          id: 1,
          nombre: 'Hawaiana',
          ingredientes: ['Jamón', 'Piña', 'Queso Manchego'],
          precio: 200
        },
        {
          id: 2,
          nombre: 'Pepperoni',
          ingredientes: ['Pepperoni', 'Queso Mozzarella', 'Salsa de Tomate'],
          precio: 220
        },
        {
          id: 3,
          nombre: 'Cuatro Quesos',
          ingredientes: ['Mozzarella', 'Gorgonzola', 'Parmesano', 'Provolone'],
          precio: 250
        },
        {
          id: 4,
          nombre: 'Mexicana',
          ingredientes: ['Chorizo', 'Jalapeño', 'Cebolla', 'Frijoles Refritos', 'Queso Manchego'],
          precio: 230
        }
      ]
    }
  });
});

app.get('/api/v1/tamanios', (req, res) => {
  res.status(200).json({
    message: 'Tamaños obtenidos exitosamente',
    data: {
      tamanios_disponibles: [
        {
          id: 1,
          nombre: 'Individual',
          porciones: 4,
          diametro_cm: 20,
          precio_base: 120
        },
        {
          id: 2,
          nombre: 'Mediana',
          porciones: 6,
          diametro_cm: 30,
          precio_base: 180
        },
        {
          id: 3,
          nombre: 'Familiar',
          porciones: 8,
          diametro_cm: 40,
          precio_base: 240
        },
        {
          id: 4,
          nombre: 'Jumbo',
          porciones: 12,
          diametro_cm: 50,
          precio_base: 310
        }
      ]
    }
  });
});

app.get('/api/v1/bebidas', (req, res) => {
  res.status(200).json({
    message: 'Bebidas obtenidas exitosamente',
    data: {
      bebidas_disponibles: [
        {
          id: 1,
          nombre: 'Coca-Cola',
          categoria: 'Refresco',
          tamanio: '600 ml',
          precio: 35
        },
        {
          id: 2,
          nombre: 'Agua Mineral',
          categoria: 'Agua',
          tamanio:'600 ml',
          precio: 30
        },
        {
          id: 3,
          nombre: 'Té Helado de Limón',
          categoria: 'Té',
          tamanio: '600 ml',
          precio: 40
        },
        {
          id: 4,
          nombre: 'Cerveza Nacional',
          categoria: 'Alcohólica',
          vtamanio: '355 ml',
          precio: 50
        }
      ]
    }
  });
});


app.get('/api/v1/async', async(req, res) => {
  
  const pizzas = await ObtnerPizzas();
  res.status(200).json(pizzas);
});


// Funcion que simula el flujo del CRUD
async function probarCrud() {

    console.log("--- LISTA INICIAL ---")
    console.log( await ObtnerPizzas());

    console.log("\nAgregando nueva pizza...")
    await agregarPizzaAsync({ id: 2, nombre: "Peperoni", descripcion: "Queso y peperoni" })
    console.log(await ObtnerPizzas())

    console.log("\nActualizando la pizza con id 1...")
    await actualizarPizzaAsync(1, { descripcion: "Jamon, piña y extra queso" })
    console.log(await ObtnerPizzas())

    console.log("\nBorrando la pizza con id 2...")
    await borrarPizzaAsync(2)
    console.log("\n--- LISTA FINAL ---")
    console.log(await ObtnerPizzas())
}

probarCrud();



app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});