// server/models/Caregiver.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CaregiverSchema = new mongoose.Schema({
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
    required: true,
    unique: true,
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
  especialidades: {
    type: [String],
    required: true,
  },
  experiencia: {
    type: String,
    required: true,
  },
  costo: {
    type: Number,
    default: 0,  // Costo por sus servicios, 0 si no cobra
  },
  password: {
    type: String,
    required: true,
  },
  favoritos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beneficiary'
    }],
  estado: {
    type: String,
    default: 'pendiente',  // Estados posibles: "pendiente", "aprobado", "rechazado"
  },
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
CaregiverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Caregiver = mongoose.model('Caregiver', CaregiverSchema);
module.exports = Caregiver;
