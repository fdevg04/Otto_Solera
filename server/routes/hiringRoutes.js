// server/routes/hiringRoutes.js
const express = require('express');
const router = express.Router();
const Hiring = require('../models/Hiring');
const authMiddleware = require('../middleware/authMiddleware');
const Caregiver = require('../models/Caregiver');

// Obtener contrataciones recibidas para un cuidador con estado "pendiente"
router.get('/caregivers/contrataciones', authMiddleware, async (req, res) => {
  try {
    const caregiverEmail = req.user.correo; // Obtenemos el correo del cuidador autenticado

    // Usamos populate para obtener la información completa del beneficiario, y filtramos por estado "pendiente"
    const hirings = await Hiring.find({ caregiverEmail, estado: 'pendiente' })
                                .populate('beneficiaryId', 'nombre apellidos correo');

    res.json(hirings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});



// Obtener el historial de servicios del beneficiario
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // ID del beneficiario autenticado

    // Buscar los servicios con estado "aprobado" del beneficiario
    const services = await Hiring.find({ beneficiaryId: userId, estado: 'aprobado' });

    if (!services || services.length === 0) {
      // Si no hay servicios, devolver un arreglo vacío
      return res.json([]);
    }

    // Obtener la información de los cuidadores basados en el correo electrónico
    const serviceDetails = await Promise.all(
      services.map(async (service) => {
        const caregiver = await Caregiver.findOne({ correo: service.caregiverEmail });
        return {
          caregiverNombre: caregiver ? caregiver.nombre : 'Cuidador no encontrado',
          caregiverCorreo: caregiver ? caregiver.correo : 'Correo no disponible',
          fecha: service.createdAt,
        };
      })
    );

    res.json(serviceDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});
  

module.exports = router;
