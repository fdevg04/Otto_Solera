// server/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

const {
  createDonation,
  getDonations,
  deleteDonation
} = require('../controllers/donationController');
//const { adminAuth } = require('../middleware/authMiddleware');

// Ruta pública para enviar donación
//router.post('/', createDonation);

router.post('/', async (req, res) => {
  const { nombre, apellidos, perteneceCompania, correo, monto } = req.body;

  try {
    // Validación de campos
    if (!nombre || !apellidos || !correo || !monto || isNaN(monto) || parseFloat(monto) <= 0) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios y el monto debe ser positivo' });
    }

    const newDonation = new Donation({
      nombre,
      apellidos,
      perteneceCompania,
      correo,
      monto: parseFloat(monto),  // Asegurarse de que el monto sea un número
    });

    await newDonation.save();
    res.status(201).json({ message: 'Donación registrada exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Rutas protegidas (solo administradores)
//router.get('/', adminAuth, getDonations);
//router.delete('/:id', adminAuth, deleteDonation);

module.exports = router;
