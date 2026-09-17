# API REST de Pizzas

API REST desarrollada con Node.js, Express y MongoDB para administrar un catálogo de pizzas.

El proyecto implementa las operaciones básicas de un CRUD y permite crear, consultar, actualizar y eliminar pizzas mediante peticiones HTTP.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Docker
- Postman

## Requisitos

Para ejecutar el proyecto se necesita:

- Node.js
- npm
- Una instancia de MongoDB
- Postman para probar los endpoints

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar al directorio del proyecto:

```bash
cd NOMBRE_DEL_REPOSITORIO
```

Instalar las dependencias:

```bash
npm install
```

## Configuración de MongoDB

El proyecto necesita una instancia activa de MongoDB. Puede utilizarse una instalación local o una instancia ejecutada mediante Docker.

Para iniciar un contenedor de MongoDB previamente creado:

```bash
docker start NOMBRE_DEL_CONTENEDOR
```

Para comprobar que MongoDB está ejecutándose:

```bash
docker ps
```

La aplicación utiliza una cadena de conexión con la siguiente estructura:

```text
mongodb://localhost:27017/pizzeria
```

El puerto debe coincidir con el puerto local publicado por el contenedor de MongoDB.

La conexión debe configurarse en el archivo correspondiente antes de iniciar la aplicación. Si la instancia utiliza autenticación, también deberán proporcionarse las credenciales necesarias.

No se recomienda publicar usuarios, contraseñas ni cadenas de conexión privadas en el repositorio.

## Ejecución

También puede ejecutarse directamente con:

```bash
node index.js
```

Cuando el servidor inicie correctamente, la API estará disponible en:

```text
http://localhost:3000
```

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/pizzas` | Obtiene todas las pizzas |
| `GET` | `/api/v1/pizzas/:id` | Obtiene una pizza por su ID |
| `POST` | `/api/v1/pizzas` | Registra una pizza |
| `PUT` | `/api/v1/pizzas/:id` | Actualiza una pizza |
| `DELETE` | `/api/v1/pizzas/:id` | Elimina una pizza |

## Ejemplo para registrar una pizza

Realizar una petición:

```http
POST /api/v1/pizzas
```

Utilizar el siguiente cuerpo en formato JSON:

```json
{
  "id": 1,
  "nombre": "Hawaiana",
  "descripcion": "Jamón, piña y queso"
}
```

## Ejemplo para actualizar una pizza

Realizar una petición:

```http
PUT /api/v1/pizzas/1
```

Utilizar el siguiente cuerpo en formato JSON:

```json
{
  "nombre": "Hawaiana especial",
  "descripcion": "Jamón, piña y extra queso"
}
```

## Pruebas con Postman

El proyecto incluye una colección de Postman con las solicitudes necesarias para probar las operaciones del CRUD.

Para ejecutar las pruebas:

1. Iniciar la instancia de MongoDB.
2. Iniciar la aplicación de Node.js.
3. Abrir Postman.
4. Seleccionar la opción **Import**.
5. Importar el archivo de la colección incluido en el repositorio.
6. Abrir las variables de la colección.
7. Configurar `baseUrl` con el siguiente valor:

```text
http://localhost:3000
```

8. Ejecutar las solicitudes individualmente o utilizar el Collection Runner.

La colección permite comprobar el siguiente flujo:

1. Obtener la lista de pizzas.
2. Registrar una pizza.
3. Consultar la pizza registrada.
4. Actualizar sus datos.
5. Eliminarla.
6. Comprobar que la pizza eliminada ya no existe.

El usuario deberá verificar que cada solicitud devuelva el código HTTP y la respuesta esperados.

## Códigos de respuesta

| Código | Descripción |
|---:|---|
| `200` | Operación realizada correctamente |
| `201` | Pizza creada correctamente |
| `400` | Datos enviados incorrectos o incompletos |
| `404` | Pizza no encontrada |
| `409` | Ya existe una pizza con el mismo ID |
| `500` | Error interno del servidor |

## Estructura general

```text
proyecto/
├── config/
│   └── mongo.js
├── repositorios/
│   └── repositorio.js
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

## Notas

- MongoDB debe estar activo antes de iniciar la API.
- El puerto de la cadena de conexión debe coincidir con el puerto publicado por MongoDB.
- El servidor Express utiliza de forma predeterminada el puerto 3000.
