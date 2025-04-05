const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');
const { validateUser, validateLogin } = require('../middlewares/validate.middleware');

// @route   POST api/auth/register
// @desc    Registrar usuario
// @access  Público
router.post('/register', validateUser, authController.register);

// @route   POST api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Público
router.post('/login', validateLogin, authController.login);

// @route   GET api/auth/me
// @desc    Obtener información del usuario autenticado
// @access  Privado
router.get('/me', auth, authController.getMe);

module.exports = router; 