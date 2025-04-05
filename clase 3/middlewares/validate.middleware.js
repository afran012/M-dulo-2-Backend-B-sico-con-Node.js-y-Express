// Middleware de validación
const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;
  
  // Validar campos requeridos
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Por favor ingrese todos los campos' });
  }
  
  // Validar formato de email
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: 'Por favor ingrese un email válido' });
  }
  
  // Validar longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
  }
  
  next();
};

// Middleware de validación para login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Validar campos requeridos
  if (!email || !password) {
    return res.status(400).json({ msg: 'Por favor ingrese todos los campos' });
  }
  
  // Validar formato de email
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: 'Por favor ingrese un email válido' });
  }
  
  next();
};

module.exports = { validateUser, validateLogin }; 