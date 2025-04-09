// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const Caregiver = require('../models/Caregiver');
const Donation = require('../models/Donation');
const Beneficiary = require('../models/Beneficiary');

// Ruta para registrar un administrador
router.post('/register', registerAdmin);

// Ruta para iniciar sesión de administrador
router.post('/login', loginAdmin);

// Ruta para obtener los cuidadores pendientes (estado: "pendiente")
router.get('/caregivers/pending', async (req, res) => {
    try {
      const caregivers = await Caregiver.find({ estado: 'pendiente' }); // Busca cuidadores con estado "pendiente"
      res.json(caregivers);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});

// Ruta para aprobar un cuidador
router.post('/caregivers/approve/:id', async (req, res) => {
    try {
      const caregiver = await Caregiver.findById(req.params.id);
      if (!caregiver) {
        return res.status(404).json({ msg: 'Cuidador no encontrado' });
      }
  
      caregiver.estado = 'aprobado'; // Cambiar el estado a "aprobado"
      await caregiver.save();
      res.json({ msg: 'Cuidador aprobado' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});
 
// Ruta para rechazar un cuidador
router.post('/caregivers/reject/:id', async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ msg: 'Cuidador no encontrado' });
    }

    caregiver.estado = 'rechazado'; // Cambiar el estado a "rechazado"
    await caregiver.save();
    res.json({ msg: 'Cuidador rechazado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener todas las donaciones
router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// server/routes/adminRoutes.js
router.delete('/donations/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ msg: 'Donación no encontrada' });
    }

    await Donation.findByIdAndDelete(req.params.id); // Eliminar la donación

    res.json({ msg: 'Donación eliminada' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener lista de cuidadores aprobados
router.get('/caregivers/approved', async (req, res) => {
  try {
    const approvedCaregivers = await Caregiver.find({ estado: 'aprobado' });
    res.json(approvedCaregivers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener los datos de un cuidador por ID
router.get('/caregivers/:id', async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ msg: 'Cuidador no encontrado' });
    }
    res.json(caregiver);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar datos de un cuidador aprobado
router.put('/caregivers/:id', async (req, res) => {
  const { nombre, apellidos, correo, telefono, residencia, especialidades, experiencia } = req.body;

  try {
    let caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ msg: 'Cuidador no encontrado' });
    }

    // Actualizar los datos del cuidador
    caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { nombre, apellidos, correo, telefono, residencia, especialidades, experiencia },
      { new: true } // Devolver el documento actualizado
    );

    res.json({ msg: 'Cuidador actualizado', caregiver });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// server/routes/adminRoutes.js
// Eliminar (lógicamente) un cuidador aprobado
router.put('/caregivers/delete/:id', async (req, res) => {
  try {
    let caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ msg: 'Cuidador no encontrado' });
    }

    // Eliminación lógica: cambiar el estado a "eliminado"
    caregiver.estado = 'eliminado';
    await caregiver.save();

    res.json({ msg: 'Cuidador eliminado lógicamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener lista de beneficiarios
router.get('/beneficiaries', async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find();
    res.json(beneficiaries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener los datos de un beneficiario por ID
router.get('/beneficiaries/:id', async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) {
      return res.status(404).json({ msg: 'Beneficiario no encontrado' });
    }
    res.json(beneficiary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar datos de un beneficiario
router.put('/beneficiaries/:id', async (req, res) => {
  const { nombre, apellidos, correo, telefono, residencia, edad, necesidades } = req.body;

  try {
    let beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) {
      return res.status(404).json({ msg: 'Beneficiario no encontrado' });
    }

    // Actualizar los datos del beneficiario
    beneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      { nombre, apellidos, correo, telefono, residencia, edad, necesidades },
      { new: true } // Devolver el documento actualizado
    );

    res.json({ msg: 'Beneficiario actualizado', beneficiary });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Eliminar un beneficiario
router.delete('/beneficiaries/:id', async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) {
      return res.status(404).json({ msg: 'Beneficiario no encontrado' });
    }

    await Beneficiary.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Beneficiario eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

router.put('/reactivar/:id', async (req, res) => {
  const { id } = req.params;
  const { tipoUsuario, datosActualizados } = req.body;  // tipoUsuario puede ser "caregiver" o "beneficiary"

  try {
    let user;
    if (tipoUsuario === 'caregiver') {
      user = await Caregiver.findById(id);
    } else if (tipoUsuario === 'beneficiary') {
      user = await Beneficiary.findById(id);
    }

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Verificar que los datos estén actualizados
    if (datosActualizados) {
      user.actividad = 'activo';  // Cambiar la actividad a 'activo'
      await user.save();
      return res.json({ msg: 'Cuenta reactivada con éxito', user });
    } else {
      return res.status(400).json({ msg: 'Los datos no están actualizados' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

router.get('/inactivas', async (req, res) => {
  try {
    const inactivosCuidadores = await Caregiver.find({ actividad: 'inactivo' });
    const inactivosBeneficiarios = await Beneficiary.find({ actividad: 'inactivo' });

    res.json({
      cuidadoresInactivos: inactivosCuidadores,
      beneficiariosInactivos: inactivosBeneficiarios
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
