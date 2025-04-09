// server/controllers/caregiverController.js
const Caregiver = require('../models/Caregiver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de Cuidador
exports.registerCaregiver = async (req, res) => {
  const { nombre, apellidos, identificacion, correo, telefono, residencia, edad, especialidades, experiencia, password, costo } = req.body;

  try {
    // Verificar si el cuidador ya existe
    let caregiver = await Caregiver.findOne({ correo });
    if (caregiver) {
      return res.status(400).json({ message: 'El cuidador ya existe' });
    }

    // Crear una nueva instancia del cuidador
    caregiver = new Caregiver({
      nombre,
      apellidos,
      identificacion,
      correo,
      telefono,
      residencia,
      edad,
      especialidades,
      experiencia,
      password,
      costo
    });

    // Guardar el cuidador en la base de datos
    await caregiver.save();

    res.status(201).json({ message: 'Solicitud de registro enviada. Espera la aprobación del administrador.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Inicio de sesión de Cuidador
exports.loginCaregiver = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar al cuidador por correo
    const caregiver = await Caregiver.findOne({ correo, estado: 'aprobado' });
    if (!caregiver) {
      return res.status(400).json({ message: 'Credenciales inválidas o cuenta no aprobada' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, caregiver.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Crear y asignar un token
    const token = jwt.sign({ id: caregiver._id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({ token, caregiver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener lista de cuidadores pendientes (solo administradores)
exports.getPendingCaregivers = async (req, res) => {
  try {
    const caregivers = await Caregiver.find({ estado: 'pendiente' });
    res.status(200).json(caregivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aprobar cuidador (solo administradores)
exports.approveCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(req.params.id, { estado: 'aprobado' }, { new: true });
    res.status(200).json({ message: 'Cuidador aprobado', caregiver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rechazar cuidador (solo administradores)
exports.rejectCaregiver = async (req, res) => {
  try {
    await Caregiver.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Solicitud de cuidador rechazada y eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
