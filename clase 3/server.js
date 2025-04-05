const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db.config');
const { apiLimiter, loginLimiter, securityHeaders } = require('./middlewares/security.middleware');
require('dotenv').config();

// Inicializar Express
const app = express();

// Conectar a la base de datos
connectDB();

// Middleware de seguridad
app.use(helmet()); // Configura encabezados HTTP seguros
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

// Ruta principal
app.get('/', (req, res) => res.json({ msg: 'API funcionando correctamente' }));

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ msg: 'Recurso no encontrado' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    msg: process.env.NODE_ENV === 'production' 
      ? 'Error en el servidor' 
      : err.message 
  });
});

// Definir puerto
const PORT = process.env.PORT || 5000;

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