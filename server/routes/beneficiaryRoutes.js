// server/routes/beneficiaryRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerBeneficiary,
  loginBeneficiary,
  getBeneficiaries
} = require('../controllers/beneficiaryController');
const Hiring = require('../models/Hiring');
const authMiddleware = require('../middleware/authMiddleware');
const Beneficiary = require('../models/Beneficiary');
const Caregiver = require('../models/Caregiver');

// Rutas públicas
router.post('/register', registerBeneficiary);
router.post('/login', loginBeneficiary);

// Rutas protegidas (solo administradores)
//router.get('/', adminAuth, getBeneficiaries);

// Obtener la lista de beneficiarios con opción de búsqueda
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query; // Obtener el parámetro de búsqueda

    let beneficiaries;

    if (search) {
      // Si hay un término de búsqueda, filtrar por nombre, apellidos o correo
      const regex = new RegExp(search, 'i'); // Expresión regular para búsqueda insensible a mayúsculas/minúsculas
      beneficiaries = await Beneficiary.find({
        $or: [
          { nombre: regex },
          { apellidos: regex },
          { correo: regex }
        ]
      }).select('nombre apellidos correo'); // Selecciona solo los campos que queremos devolver
    } else {
      // Si no hay búsqueda, devolver todos los beneficiarios
      beneficiaries = await Beneficiary.find().select('nombre apellidos correo');
    }

    res.json(beneficiaries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener contrataciones aprobadas para el beneficiario
router.get('/beneficiaries/contrataciones-aprobadas', authMiddleware, async (req, res) => {
  try {
    const hirings = await Hiring.find({
      beneficiaryId: req.user.id,
      estado: 'aprobado',
    });

    res.json(hirings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Añadir un cuidador a los favoritos del beneficiario
router.post('/favorites/:caregiverId', authMiddleware, async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.user.id);
    const caregiver = await Caregiver.findById(req.params.caregiverId);

    if (!caregiver) {
      return res.status(404).json({ msg: 'Cuidador no encontrado' });
    }

    // Verifica si el cuidador ya está en los favoritos
    if (beneficiary.favoritos.includes(req.params.caregiverId)) {
      return res.status(400).json({ msg: 'El cuidador ya está en tus favoritos' });
    }

    beneficiary.favoritos.push(req.params.caregiverId);
    await beneficiary.save();

    res.json({ msg: 'Cuidador añadido a favoritos', favoritos: beneficiary.favoritos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Eliminar un cuidador de los favoritos del beneficiario
router.delete('/favorites/:caregiverId', authMiddleware, async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.user.id);
    const caregiverIndex = beneficiary.favoritos.indexOf(req.params.caregiverId);

    if (caregiverIndex === -1) {
      return res.status(404).json({ msg: 'El cuidador no está en tus favoritos' });
    }

    // Elimina el cuidador de la lista de favoritos
    beneficiary.favoritos.splice(caregiverIndex, 1);
    await beneficiary.save();

    res.json({ msg: 'Cuidador eliminado de favoritos', favoritos: beneficiary.favoritos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener cuidadores favoritos del beneficiario autenticado
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.user.id).populate('favoritos');
    
    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiario no encontrado' });
    }

    res.json(beneficiary.favoritos);  // Devolver la lista de favoritos
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
