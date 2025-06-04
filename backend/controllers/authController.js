const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Agregar encriptación de contraseña
const bcrypt = require('bcrypt');

// Registrar usuario
const register = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    const userExists = await User.findOne({ name });
    if (userExists) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }
    // En la función register:
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error al registrar:', err);
    res.status(500).json({ message: 'Error en la operación' });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user._id }, 'secreto', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ message: 'Error en la operación' });
  }
};

module.exports = { register, login };
