const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, isUsingJsonStorage } = require('./config/db.config');
const swaggerDocs = require('./config/swagger.config');
const { apiLimiter, loginLimiter, securityHeaders } = require('./middlewares/security.middleware');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
require('dotenv').config();

// Inicializar Express
const app = express();

// Conectar a la base de datos
connectDB().then(() => {
  // Configurar modelo apropiado basado en la conexión
  if (isUsingJsonStorage()) {
    // Si no se pudo conectar a MongoDB, usar modelo JSON
    global.UserModel = require('./models/user.model.json');
    console.log('Usando almacenamiento JSON local');
  } else {
    // Si se conectó a MongoDB, usar modelo Mongoose
    global.UserModel = require('./models/user.model');
    console.log('Usando MongoDB como almacenamiento');
  }
});

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:"],
    },
  }
})); // Configura encabezados HTTP seguros con excepciones para Swagger
app.use(securityHeaders); // Configuraciones de seguridad adicionales
app.use(cors()); // Configurar CORS

// Middleware estándar
app.use(express.json({ limit: '1mb' })); // Limitar el tamaño de las peticiones a 1mb
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Aplicar límite de tasa a todas las solicitudes
app.use(apiLimiter);

// Definir rutas
app.use('/api/auth/login', loginLimiter); // Limitador específico para login
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));

// Inicializar Swagger
swaggerDocs(app);

// Ruta principal
app.get('/', (req, res) => res.json({ msg: 'API funcionando correctamente' }));

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo de errores global
app.use(errorHandler);

// Definir puerto
const PORT = process.env.PORT || 5001;

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));

// Manejo de excepciones no capturadas
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
  process.exit(1);
});

// Manejo de rechazo de promesa no capturado
process.on('unhandledRejection', (err) => {
  console.error('Rechazo de promesa no capturado:', err);
  process.exit(1);
}); 