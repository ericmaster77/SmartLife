// backend/models/Incident.js
const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  folio: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Por favor, añade un título'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Por favor, añade una descripción'],
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Seguridad',
      'Infraestructura',
      'Servicios Públicos',
      'Medio Ambiente',
      'Movilidad',
      'Otro',
    ],
  },
  status: {
    type: String,
    required: true,
    enum: ['Recibida', 'En Revisión', 'En Proceso', 'Resuelta', 'Rechazada'],
    default: 'Recibida',
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitud, latitud]
      index: '2dsphere',
    },
    address: String,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  evidence: {
    type: String,  // Path al archivo subido
    required: false,
  },
});

// Generar un folio único antes de guardar
IncidentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.folio = `SL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Incident', IncidentSchema);
