// server/models/Beneficiary.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BeneficiarySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  identificacion: {
    type: String,
    required: true,
    unique: true,
  },
  correo: {
    type: String,
    required: false,
  },
  telefono: {
    type: String,
    required: true,
  },
  residencia: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  necesidades: {
    type: [String],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver'
  }],
  actividad: {
    type: String,
    default: 'activo',  // Puede ser 'activo' o 'inactivo'
  },
  ultimoLogin: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,  // Añade createdAt y updatedAt automáticamente
});

// Middleware para hashear la contraseña antes de guardar
BeneficiarySchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Beneficiary = mongoose.model('Beneficiary', BeneficiarySchema);
module.exports = Beneficiary;
