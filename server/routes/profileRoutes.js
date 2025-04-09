// server/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Beneficiary = require('../models/Beneficiary');
const Caregiver = require('../models/Caregiver');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para proteger la ruta y verificar el token
const { removeListener } = require('pdfkit');

// Obtener información del perfil basado en el rol del usuario
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // El ID del usuario autenticado
    const role = req.user.role; // El rol del usuario

    let userProfile;

    if (role === 'admin') {
      userProfile = await Admin.findById(userId).select('-password'); // Excluir el campo de contraseña
    } else if (role === 'beneficiary') {
      userProfile = await Beneficiary.findById(userId).select('-password');
    } else if (role === 'caregiver') {
      userProfile = await Caregiver.findById(userId).select('-password');
    }

    if (!userProfile) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ ...userProfile._doc, role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar perfil basado en el rol del usuario
router.put('/profile', authMiddleware, async (req, res) => {
  const { 
    nombre, 
    apellidos, 
    identificacion,
    correo, 
    telefono, 
    edad, 
    residencia, 
    especialidades, 
    experiencia, 
    necesidades
  } = req.body;

  const userId = req.user.id;
  const role = req.user.role;

  try {
    let updatedProfile;

    // Actualizar perfil de administrador
    if (role === 'admin') {
      updatedProfile = await Admin.findByIdAndUpdate(
        userId,
        { nombre, apellidos, identificacion, correo, telefono },
        { new: true }
      );
    } 
    // Actualizar perfil de beneficiario
    else if (role === 'beneficiary') {
      updatedProfile = await Beneficiary.findByIdAndUpdate(
        userId,
        { nombre, apellidos, identificacion, correo, telefono, edad, residencia, necesidades },
        { new: true }
      );
    } 
    // Actualizar perfil de cuidador
    else if (role === 'caregiver') {
      updatedProfile = await Caregiver.findByIdAndUpdate(
        userId,
        { nombre, apellidos, identificacion, correo, telefono, edad, residencia, especialidades, experiencia },
        { new: true }
      );
    }

    if (!updatedProfile) {
      return res.status(404).json({ msg: 'Perfil no encontrado' });
    }

    res.json({ msg: 'Perfil actualizado con éxito', updatedProfile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;