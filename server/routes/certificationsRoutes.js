const express = require('express');
const router = express.Router();
const Certificacion = require('../models/Certificacion');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener certificaciones del cuidador autenticado
router.get('/certificaciones', authMiddleware, async (req, res) => {
  try {
    const caregiverId = req.user.id; // ID del cuidador autenticado

    const certificaciones = await Certificacion.find({ caregiverId });
    
    res.json(certificaciones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Agregar una nueva certificación para el cuidador
router.post('/certificaciones', authMiddleware, async (req, res) => {
  try {
    const { nombre, url } = req.body;
    const caregiverId = req.user.id;  // ID del cuidador autenticado

    const nuevaCertificacion = new Certificacion({
      nombre,
      url,
      caregiverId
    });

    await nuevaCertificacion.save();
    res.json(nuevaCertificacion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Eliminar una certificación
router.delete('/certificaciones/:id', authMiddleware, async (req, res) => {
    try {
      const certificacionId = req.params.id;
  
      // Eliminar la certificación usando findByIdAndDelete
      const certificacion = await Certificacion.findByIdAndDelete(certificacionId);
  
      if (!certificacion) {
        return res.status(404).json({ msg: 'Certificación no encontrada' });
      }
  
      res.json({ msg: 'Certificación eliminada con éxito' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
  });

module.exports = router;
