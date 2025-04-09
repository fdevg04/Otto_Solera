// server/routes/caregiverRoutes.js
const express = require('express');
const router = express.Router();
const Hiring = require('../models/Hiring');
const {
  registerCaregiver,
  loginCaregiver,
  getPendingCaregivers,
  approveCaregiver,
  rejectCaregiver
} = require('../controllers/caregiverController');
const Caregiver = require('../models/Caregiver');
const Beneficiary = require('../models/Beneficiary');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para proteger la ruta y verificar el token

/*
const { adminAuth } = require('../middleware/authMiddleware');
*/
// Rutas públicas
router.post('/register', registerCaregiver);
router.post('/login', loginCaregiver);

// Rutas protegidas (solo administradores)
/*
router.get('/pending', adminAuth, getPendingCaregivers);
router.put('/approve/:id', adminAuth, approveCaregiver);
router.delete('/reject/:id', adminAuth, rejectCaregiver);
*/

// Obtener lista de cuidadores
router.get('/caregivers', async (req, res) => {
  try {
    const { search } = req.query;
    let caregivers;

    if (search) {
      caregivers = await Caregiver.find({
        $or: [
          { nombre: new RegExp(search, 'i') },
          { apellidos: new RegExp(search, 'i') },
          { especialidades: new RegExp(search, 'i') }
        ]
      });
    } else {
      caregivers = await Caregiver.find();
    }

    // Calcular el costo adicional (3%) y agregarlo a cada cuidador con costo > 0
    const caregiversWithCost = caregivers.map(caregiver => {
      const costoExtra = caregiver.costo > 0 ? caregiver.costo * 0.03 : 0;
      const totalCosto = caregiver.costo + costoExtra;
      return {
        ...caregiver._doc,
        costoExtra: costoExtra.toFixed(2), // Guardar el costo adicional calculado
        totalCosto: totalCosto.toFixed(2), // Total incluyendo el costo adicional
      };
    });

    res.json(caregiversWithCost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Enviar solicitud de contratación a un cuidador
router.post('/caregivers/:id/contratacion', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body; // Mensaje opcional que el beneficiario puede enviar

    const caregiver = await Caregiver.findById(id);
    if (!caregiver) {
      return res.status(404).json({ msg: 'Cuidador no encontrado' });
    }

    // Aquí puedes manejar la lógica para almacenar la solicitud o enviarla por correo
    // Por ahora, vamos a simular que la solicitud ha sido enviada

    // Guardar la contratación en la base de datos
    const newHiring = new Hiring({
      message,
      caregiverEmail: caregiver.correo,
      beneficiaryId: req.user.id,  // ID del beneficiario que envía la solicitud
    });

    await newHiring.save();

    res.status(200).json({ msg: `Solicitud enviada al cuidador ${caregiver.nombre}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Aceptar solicitud de contratación
router.put('/caregivers/contrataciones/:id/aceptar', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const hiring = await Hiring.findById(id);

    if (!hiring) {
      return res.status(404).json({ msg: 'Contratación no encontrada' });
    }

    // Solo el cuidador puede aceptar la contratación
    if (hiring.caregiverEmail !== req.user.correo) {
      return res.status(403).json({ msg: 'No tienes permiso para aceptar esta solicitud' });
    }

    // Actualizar el estado a "aprobado"
    hiring.estado = 'aprobado';
    await hiring.save();

    res.json({ msg: 'Solicitud aceptada' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Rechazar solicitud de contratación
router.put('/caregivers/contrataciones/:id/rechazar', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const hiring = await Hiring.findById(id);

    if (!hiring) {
      return res.status(404).json({ msg: 'Contratación no encontrada' });
    }

    // Solo el cuidador puede rechazar la contratación
    if (hiring.caregiverEmail !== req.user.correo) {
      return res.status(403).json({ msg: 'No tienes permiso para rechazar esta solicitud' });
    }

    // Actualizar el estado a "rechazado"
    hiring.estado = 'rechazado';
    await hiring.save();

    res.json({ msg: 'Solicitud rechazada' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener caregiverId por correo
router.get('/by-email/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const caregiver = await Caregiver.findOne({ correo: email });
    if (!caregiver) {
      return res.status(404).json({ message: 'Cuidador no encontrado' });
    }
    res.json(caregiver);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener contrataciones aprobadas para un cuidador
router.get('/caregivers/contrataciones-aprobadas', authMiddleware, async (req, res) => {
  try {
    const caregiverEmail = req.user.correo; // Obtener el correo del cuidador autenticado

    // Buscar todas las contrataciones en estado 'aprobado' que pertenezcan al cuidador autenticado
    const approvedHirings = await Hiring.find({
      caregiverEmail: caregiverEmail,
      estado: 'aprobado'
    }).populate('beneficiaryId', 'nombre apellidos correo');

    // Si no hay contrataciones aprobadas, devolver una lista vacía
    if (approvedHirings.length === 0) {
      return res.json([]);  // Devolver lista vacía en lugar de un error 404
    }

    res.json(approvedHirings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener el historial de servicios del cuidador
router.get('/caregivers/history', authMiddleware, async (req, res) => {
  try {
    const caregiverEmail = req.user.correo; // Correo del cuidador autenticado

    // Buscar los servicios aprobados donde el cuidador está involucrado
    const services = await Hiring.find({ caregiverEmail, estado: 'aprobado' }).populate('beneficiaryId', 'nombre correo');

    // En lugar de devolver un error 404, devolvemos un arreglo vacío si no hay servicios
    if (!services || services.length === 0) {
      return res.json([]);  // Devolver un arreglo vacío
    }

    // Construir la respuesta con información del beneficiario
    const serviceDetails = services.map(service => ({
      beneficiaryNombre: service.beneficiaryId.nombre,
      beneficiaryCorreo: service.beneficiaryId.correo,
      fecha: service.createdAt,
    }));

    res.json(serviceDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Añadir un beneficiario a los favoritos del cuidador
router.post('/favorites/:beneficiaryId', authMiddleware, async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.user.id);
    const beneficiary = await Beneficiary.findById(req.params.beneficiaryId);

    if (!beneficiary) {
      return res.status(404).json({ msg: 'Beneficiario no encontrado' });
    }

    // Verifica si el beneficiario ya está en los favoritos
    if (caregiver.favoritos.includes(req.params.beneficiaryId)) {
      return res.status(400).json({ msg: 'El beneficiario ya está en tus favoritos' });
    }

    caregiver.favoritos.push(req.params.beneficiaryId);
    await caregiver.save();

    res.json({ msg: 'Beneficiario añadido a favoritos', favoritos: caregiver.favoritos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Eliminar un beneficiario de los favoritos del cuidador
router.delete('/favorites/:beneficiaryId', authMiddleware, async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.user.id);
    const beneficiaryIndex = caregiver.favoritos.indexOf(req.params.beneficiaryId);

    if (beneficiaryIndex === -1) {
      return res.status(404).json({ msg: 'El beneficiario no está en tus favoritos' });
    }

    caregiver.favoritos.splice(beneficiaryIndex, 1);
    await caregiver.save();

    res.json({ msg: 'Beneficiario eliminado de favoritos', favoritos: caregiver.favoritos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener beneficiarios favoritos del cuidador autenticado
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.user.id).populate('favoritos', 'nombre apellidos correo');

    if (!caregiver) {
      return res.status(404).json({ msg: 'Cuidador no encontrado' });
    }

    res.json(caregiver.favoritos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
