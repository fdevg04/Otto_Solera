// server/models/Hiring.js
const mongoose = require('mongoose');

const HiringSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  caregiverEmail: {
    type: String,
    required: true,
  },
  beneficiaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Hiring', HiringSchema);
