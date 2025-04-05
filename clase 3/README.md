# API REST con Express.js, MVC y Autenticación JWT

API RESTful construida con Express.js que implementa el patrón MVC y autenticación JWT. Incluye un CRUD completo para usuarios y medidas de seguridad avanzadas.

## Características

- **Arquitectura MVC**: Separación clara de modelos, vistas y controladores
- **Autenticación JWT**: Implementación segura con JWT
- **CRUD completo**: Gestión de usuarios con todas las operaciones
- **Documentación interactiva**: Interfaz Swagger para probar y documentar la API
- **Seguridad avanzada**:
  - Encabezados HTTP seguros con Helmet
  - Limitación de tasa para prevenir ataques de fuerza bruta
  - Encriptación de contraseñas con bcrypt
  - Validación de datos de entrada
  - Manejo de permisos basado en roles
- **Opciones de almacenamiento**: Soporte para MongoDB o almacenamiento JSON local

## Estructura del proyecto

```
/express-auth-api
  /config
    - db.config.js        # Configuración de base de datos
    - swagger.config.js   # Configuración de Swagger
  /controllers
    - auth.controller.js  # Controlador de autenticación
    - user.controller.js  # Controlador de usuarios
  /middlewares
    - auth.middleware.js  # Middleware de autenticación
    - validate.middleware.js # Validación de datos
    - security.middleware.js # Configuraciones de seguridad
  /models
    - user.model.js       # Modelo de usuario (MongoDB)
    - user.model.json.js  # Modelo alternativo (JSON)
  /routes
    - auth.routes.js      # Rutas de autenticación
    - user.routes.js      # Rutas de usuarios
  /data                   # Si se usa almacenamiento JSON
  - .env                  # Variables de entorno
  - server.js             # Punto de entrada
  - package.json          # Dependencias
```

## Requisitos previos

- Node.js (v14 o superior)
- MongoDB (opcional)

## Instalación

1. Clonar el repositorio:
```
git clone <url-del-repositorio>
cd express-auth-api
```

2. Instalar dependencias:
```
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz con:
```
JWT_SECRET=tu_secreto_super_seguro
MONGO_URI=mongodb://localhost:27017/auth-api
PORT=5000
NODE_ENV=development
```

## Ejecución

- **Desarrollo**:
```
npm run dev
```

- **Producción**:
```
npm start
```

## Documentación de la API con Swagger

La API incluye documentación interactiva con Swagger UI. Una vez que el servidor esté corriendo:

1. Accede a la documentación en: `http://localhost:5000/api-docs`
2. Desde allí puedes:
   - Ver todos los endpoints disponibles
   - Probar los endpoints directamente desde la interfaz
   - Ver los esquemas de datos y modelos
   - Autenticarte usando JWT para probar endpoints protegidos

## Endpoints de la API

### Autenticación

- **POST /api/auth/register** - Registrar nuevo usuario
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

- **POST /api/auth/login** - Iniciar sesión y obtener token
  - Body: `{ "email": "john@example.com", "password": "password123" }`

- **GET /api/auth/me** - Obtener perfil del usuario autenticado
  - Headers: `x-auth-token: <token>`

### Usuarios (requieren autenticación)

- **GET /api/users** - Obtener todos los usuarios (solo admin)
  - Headers: `x-auth-token: <token>`

- **GET /api/users/:id** - Obtener usuario por ID
  - Headers: `x-auth-token: <token>`

- **PUT /api/users/:id** - Actualizar usuario
  - Headers: `x-auth-token: <token>`
  - Body: `{ "name": "New Name", "email": "new@example.com" }`

- **DELETE /api/users/:id** - Eliminar usuario
  - Headers: `x-auth-token: <token>`

## Almacenamiento alternativo (JSON)

Si no deseas utilizar MongoDB, puedes usar el modelo alternativo basado en JSON:

1. Editar `server.js` para usar `models/user.model.json.js` en lugar de `models/user.model.js`

## Seguridad implementada

- **Helmet**: Configura encabezados HTTP seguros
- **Rate limiting**: Previene ataques de fuerza bruta y DoS
- **Validación de datos**: Verifica todos los datos de entrada
- **Encriptación**: Contraseñas almacenadas con bcrypt
- **JWT**: Tokens seguros con expiración
- **Control de acceso**: Permisos basados en roles

## Licencia

ISC 