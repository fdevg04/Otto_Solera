// server/controllers/adminController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de Administrador
exports.registerAdmin = async (req, res) => {
  const { nombre, apellidos, identificacion, correo, telefono, password } = req.body;

  try {
    // Verificar si el administrador ya existe
    let admin = await Admin.findOne({ correo });
    if (admin) {
      return res.status(400).json({ message: 'El administrador ya existe' });
    }

    // Crear una nueva instancia del administrador
    admin = new Admin({
      nombre,
      apellidos,
      identificacion,
      correo,
      telefono,
      password
    });

    // Guardar el administrador en la base de datos
    await admin.save();

    // Crear y asignar un token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Inicio de sesión de Administrador
exports.loginAdmin = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar al administrador por correo
    const admin = await Admin.findOne({ correo });
    if (!admin) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Crear y asignar un token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
