const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Opciones de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST con Express y JWT',
      version: '1.0.0',
      description: 'API REST con autenticación JWT y patrón MVC',
      contact: {
        name: 'API Support',
        email: 'soporte@ejemplo.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://tu-dominio.com' 
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Servidor de producción' : 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'ID autogenerado del usuario'
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña del usuario (mínimo 6 caracteres)'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'Rol del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del usuario'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            msg: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Archivos donde Swagger buscará los comentarios JSDoc
};

// Generar especificación
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware para servir la documentación
const swaggerDocs = (app) => {
  // Ruta para la interfaz de Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Ruta para el JSON de la especificación
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log(`Documentación Swagger disponible en /api-docs`);
};

module.exports = swaggerDocs; 