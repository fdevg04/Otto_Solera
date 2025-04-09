// server/models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  perteneceCompania: {
    type: Boolean,
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  monto: {
    type: Number, // Añadir campo de monto si es necesario
    required: false,
  }
}, {
  timestamps: true,  // Añade createdAt y updatedAt automáticamente
});

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;
