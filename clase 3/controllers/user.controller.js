// Controlador CRUD para usuarios
const { HttpError, asyncHandler, validateId } = require('../middlewares/error.middleware');

// Obtener todos los usuarios
exports.getAll = asyncHandler(async (req, res) => {
  const users = await global.UserModel.find();
  res.json(users);
});

// Obtener usuario por ID
exports.getById = asyncHandler(async (req, res) => {
  const user = await global.UserModel.findById(req.params.id);
  
  if (!user) {
    throw new HttpError('Usuario no encontrado', 404);
  }
  
  res.json(user);
});

// Actualizar usuario
exports.update = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  
  // Construir objeto de usuario
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (role) userFields.role = role;
  
  let user = await global.UserModel.findById(req.params.id);
  
  if (!user) {
    throw new HttpError('Usuario no encontrado', 404);
  }
  
  // Verificar que el usuario autenticado sea admin o el propio usuario
  if (user.id.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new HttpError('No autorizado para realizar esta acción', 403);
  }
  
  // Actualizar usuario
  user = await global.UserModel.findByIdAndUpdate(
    req.params.id,
    userFields,
    { new: true }
  );
  
  res.json(user);
});

// Eliminar usuario
exports.delete = asyncHandler(async (req, res) => {
  const user = await global.UserModel.findById(req.params.id);
  
  if (!user) {
    throw new HttpError('Usuario no encontrado', 404);
  }
  
  // Verificar que el usuario autenticado sea admin o el propio usuario
  if (user.id.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new HttpError('No autorizado para realizar esta acción', 403);
  }
  
  await global.UserModel.findByIdAndDelete(req.params.id);
  
  res.status(200).json({ success: true, msg: 'Usuario eliminado correctamente' });
}); 