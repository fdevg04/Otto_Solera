// server/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para añadir feedback
router.post('/users/:userId/feedback', authMiddleware, async (req, res) => {
  const { comentario, rating } = req.body;
  const { userId } = req.params;

  try {
    // Crear un nuevo feedback para el usuario (puede ser cuidador o beneficiario)
    const feedback = new Feedback({
      comentario,
      rating,
      userId  // Guardamos el ID del usuario calificado
    });

    // Guardar en la base de datos
    await feedback.save();

    res.status(201).json({ message: 'Reseña y puntuación añadidas correctamente' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener el promedio de calificaciones de un usuario
router.get('/users/:userId/feedback/average', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const feedbacks = await Feedback.find({ userId });
  
      if (feedbacks.length === 0) {
        return res.json({ averageRating: 0 });
      }
  
      const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
      const averageRating = totalRating / feedbacks.length;
  
      res.json({ averageRating });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    }
});

// Solicitar revisión de una evaluación recibida
router.put('/request-review/:id', authMiddleware, async (req, res) => {
    try {
      const feedback = await Feedback.findById(req.params.id);
      if (!feedback) {
        return res.status(404).json({ msg: 'Feedback no encontrado' });
      }
  
      // Verificar que el usuario autenticado es el beneficiario que recibió la evaluación
      if (feedback.userId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'No estás autorizado para realizar esta acción' });
      }
  
      // Cambiar el estado a "revision"
      feedback.estado = 'revision';
      await feedback.save();
  
      res.json({ msg: 'La revisión ha sido solicitada con éxito' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});

// Obtener todos los feedbacks en revisión
router.get('/revisions', authMiddleware, async (req, res) => {
    try {
      const feedbacks = await Feedback.find({ estado: 'revision' });
      res.json(feedbacks);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});
  
// Aprobar un feedback
router.put('/approve/:id', authMiddleware, async (req, res) => {
    try {
      const feedback = await Feedback.findById(req.params.id);
      if (!feedback) {
        return res.status(404).json({ msg: 'Feedback no encontrado' });
      }
  
      feedback.estado = 'aprobado';
      await feedback.save();
      res.json({ msg: 'Feedback aprobado con éxito' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});

// Obtener todos los feedbacks del usuario autenticado
router.get('/feedbacks', authMiddleware, async (req, res) => {
    try {
      // Obtiene los feedbacks del usuario autenticado
      const feedbacks = await Feedback.find({ userId: req.user.id });
      res.json(feedbacks);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});

// Eliminar un feedback por su ID (solo para administradores)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const feedback = await Feedback.findById(req.params.id);
      if (!feedback) {
        return res.status(404).json({ msg: 'Feedback no encontrado' });
      }
  
      // Eliminar el feedback
      await Feedback.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Feedback eliminado con éxito' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});

// Añadir reseña y puntuación a un beneficiario
router.post('/users/:beneficiaryId/feedback', authMiddleware, async (req, res) => {
  const { beneficiaryId } = req.params;
  const { comentario, rating } = req.body;

  try {
    // Verificar que el beneficiario existe
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiario no encontrado' });
    }

    // Crear el feedback
    const feedback = new Feedback({
      userId: beneficiaryId, // Almacenar el ID del beneficiario calificado
      comentario,
      rating,
    });

    // Guardar el feedback en la base de datos
    await feedback.save();

    res.status(201).json({ message: 'Reseña y puntuación añadidas correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener el promedio de calificaciones de un beneficiario
router.get('/users/:beneficiaryId/feedback/average', async (req, res) => {
  const { beneficiaryId } = req.params;

  try {
    // Verificar que el beneficiario existe
    const feedbacks = await Feedback.find({ userId: beneficiaryId });

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'Este beneficiario no tiene reseñas' });
    }

    // Calcular el promedio de las calificaciones
    const averageRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length;

    res.json({ averageRating });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
