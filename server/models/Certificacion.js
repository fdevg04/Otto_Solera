const mongoose = require('mongoose');

const CertificacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  url: {
    type: String,  // Puede ser un enlace a un documento o certificación en línea
  },
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver',
    required: true,
  },
}, {
  timestamps: true,  // Para almacenar la fecha de creación y actualización
});

module.exports = mongoose.model('Certificacion', CertificacionSchema);
