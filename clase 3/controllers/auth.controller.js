const jwt = require('jsonwebtoken');
const { HttpError, asyncHandler } = require('../middlewares/error.middleware');
require('dotenv').config();

// Registro de usuario
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar si el usuario ya existe
  let user = await global.UserModel.findOne({ email });
  if (user) {
    throw new HttpError('El usuario ya existe', 400);
  }

  // Crear nuevo usuario
  user = new global.UserModel(name, email, password);

  // Guardar usuario en DB o JSON
  await user.save();

  // Crear payload para JWT
  const payload = {
    user: {
      id: user.id,
      role: user.role
    }
  };

  // Generar JWT
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
    (err, token) => {
      if (err) throw new HttpError('Error al generar el token', 500);
      res.json({ token });
    }
  );
});

// Login de usuario
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario existe
  let user = await global.UserModel.findOne({ email });
  if (!user) {
    throw new HttpError('Credenciales inválidas', 401);
  }

  // Verificar contraseña
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new HttpError('Credenciales inválidas', 401);
  }

  // Crear payload para JWT
  const payload = {
    user: {
      id: user.id,
      role: user.role
    }
  };

  // Generar JWT
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
    (err, token) => {
      if (err) throw new HttpError('Error al generar el token', 500);
      res.json({ token });
    }
  );
});

// Obtener usuario autenticado
exports.getMe = asyncHandler(async (req, res) => {
  // Buscar usuario sin incluir la contraseña
  const user = await global.UserModel.findById(req.user.id);
  if (!user) {
    throw new HttpError('Usuario no encontrado', 404);
  }
  res.json(user);
}); 