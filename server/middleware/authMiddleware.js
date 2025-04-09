// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Beneficiary = require('../models/Beneficiary');
const Caregiver = require('../models/Caregiver');

module.exports = async function (req, res, next) {
  // Obtener el token del header
  const token = req.header('Authorization')?.split(' ')[1];

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario en los diferentes modelos (Admin, Beneficiary, Caregiver)
    const admin = await Admin.findById(decoded.user.id);
    const beneficiary = await Beneficiary.findById(decoded.user.id);
    const caregiver = await Caregiver.findById(decoded.user.id);

    // Asignar el usuario y el rol a req.user
    if (admin) {
      req.user = { id: admin.id, role: 'admin', correo: admin.correo };
    } else if (beneficiary) {
      req.user = { id: beneficiary.id, role: 'beneficiary', correo: beneficiary.correo };
    } else if (caregiver) {
      req.user = { id: caregiver.id, role: 'caregiver', correo: caregiver.correo };
    } else {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    next(); // Pasar al siguiente middleware o ruta
  } catch (err) {
    console.error('Error con el token', err);
    res.status(401).json({ msg: 'Token no es válido' });
  }
};
