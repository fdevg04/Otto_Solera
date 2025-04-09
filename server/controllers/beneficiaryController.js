// server/controllers/beneficiaryController.js
const Beneficiary = require('../models/Beneficiary');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de Beneficiario
exports.registerBeneficiary = async (req, res) => {
  const { nombre, apellidos, identificacion, correo, telefono, residencia, edad, necesidades, password } = req.body;

  try {
    // Verificar si el beneficiario ya existe
    let beneficiary = await Beneficiary.findOne({ identificacion });
    if (beneficiary) {
      return res.status(400).json({ message: 'El beneficiario ya existe' });
    }

    // Crear una nueva instancia del beneficiario
    beneficiary = new Beneficiary({
      nombre,
      apellidos,
      identificacion,
      correo,
      telefono,
      residencia,
      edad,
      necesidades,
      password
    });

    // Guardar el beneficiario en la base de datos
    await beneficiary.save();

    res.status(201).json({ message: 'Beneficiario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Inicio de sesión de Beneficiario
exports.loginBeneficiary = async (req, res) => {
  const { identificacion, password } = req.body;

  try {
    // Buscar al beneficiario por identificación
    const beneficiary = await Beneficiary.findOne({ identificacion });
    if (!beneficiary) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, beneficiary.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Crear y asignar un token
    const token = jwt.sign({ id: beneficiary._id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({ token, beneficiary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener lista de beneficiarios (solo administradores)
exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find();
    res.status(200).json(beneficiaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
