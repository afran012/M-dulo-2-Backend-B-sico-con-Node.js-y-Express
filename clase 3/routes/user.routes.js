const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, admin } = require('../middlewares/auth.middleware');

// @route   GET api/users
// @desc    Obtener todos los usuarios
// @access  Privado (solo admin)
router.get('/', auth, admin, userController.getAll);

// @route   GET api/users/:id
// @desc    Obtener usuario por ID
// @access  Privado
router.get('/:id', auth, userController.getById);

// @route   PUT api/users/:id
// @desc    Actualizar usuario
// @access  Privado
router.put('/:id', auth, userController.update);

// @route   DELETE api/users/:id
// @desc    Eliminar usuario
// @access  Privado
router.delete('/:id', auth, userController.delete);

module.exports = router; 