const express = require("express");
const app = express();
const PORT = 3000; // Puerto en el que escuchará el servidor

app.get("/", (req, res)=>{
    const saludo = { mensaje: "Hola mundo, desde nodejs"}
    return res.json(saludo);
})

// 200 OK: Petición exitosa estándar (GET, PUT, PATCH)
app.get('/api/v1/pizzas', (req, res) => {
  res.status(200).json({
    status: 200,
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
    status: 200,
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
    status: 200,
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


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});