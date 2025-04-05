const jwt = require('jsonwebtoken');
const { HttpError } = require('./error.middleware');
require('dotenv').config();

const auth = (req, res, next) => {
  // Obtener token del header
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  // Verificar si no hay token
  if (!token) {
    return next(new HttpError('No hay token, autorización denegada', 401));
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar el usuario al request
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new HttpError('El token ha expirado, por favor inicie sesión nuevamente', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new HttpError('Token inválido', 401));
    }
    return next(new HttpError('Error de autenticación', 401));
  }
};

// Middleware para verificar rol de administrador
const admin = (req, res, next) => {
  if (!req.user) {
    return next(new HttpError('No autorizado, autenticación requerida', 401));
  }
  
  if (req.user.role !== 'admin') {
    return next(new HttpError('Acceso denegado, se requiere rol de administrador', 403));
  }
  
  next();
};

module.exports = { auth, admin }; 