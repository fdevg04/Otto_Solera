// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Importa los modelos
const Admin = require('../models/Admin');
const Beneficiary = require('../models/Beneficiary');
const Caregiver = require('../models/Caregiver');

const authMiddleware = require('../middleware/authMiddleware'); // Middleware para proteger la ruta y verificar el token

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    let user = null;
    let role = '';

    // 1. Verificar si el usuario es administrador
    user = await Admin.findOne({ correo });
    if (user) {
      role = 'admin';
    } else {
      // 2. Verificar si el usuario es beneficiario
      user = await Beneficiary.findOne({ correo });
      if (user) {
        role = 'beneficiary';
      } else {
        // 3. Verificar si el usuario es cuidador
        user = await Caregiver.findOne({ correo });
        if (user) {
          role = 'caregiver';
        }
      }
    }

    // Si no se encuentra el usuario
    if (!user) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // Crear el token JWT con el rol correspondiente
    const payload = {
      user: {
        id: user.id,
        role: role // Establece el rol del usuario (admin, beneficiary, o caregiver)
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Llave secreta
      { expiresIn: '8h' },    // El token expira en 8 horas
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener el rol del usuario logueado
router.get('/user-role', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Verificar si el usuario es administrador
    let user = await Admin.findById(userId);
    if (user) {
      return res.json({ role: 'admin' });
    }

    // Verificar si el usuario es beneficiario
    user = await Beneficiary.findById(userId);
    if (user) {
      return res.json({ role: 'beneficiary' });
    }

    // Verificar si el usuario es cuidador
    user = await Caregiver.findById(userId);
    if (user) {
      return res.json({ role: 'caregiver' });
    }

    res.status(404).json({ msg: 'Rol de usuario no encontrado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
