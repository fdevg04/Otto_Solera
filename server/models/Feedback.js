// server/models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  comentario: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Puntuación de 1 a 5 estrellas
  },
  userId: {  // ID del usuario calificado (puede ser cuidador o beneficiario)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Se puede referir tanto a un cuidador como a un beneficiario
    required: true,
  },
  estado: {
    type: String,
    enum: ['aprobado', 'revision'],
    default: 'aprobado',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
