// backend/controllers/incident.controller.js
const Incident = require('../models/Incident');

// @desc    Crear un nuevo incidente
// @route   POST /api/incidents
// @access  Public
exports.createIncident = async (req, res, next) => {
  try {
    const incidentData = req.body;
    
    // Si hay archivo de evidencia, guardar el path
    if (req.file) {
      incidentData.evidence = req.file.path;
    }

    // Crear el incidente
    const incident = await Incident.create(incidentData);
    
    // Emitir evento en tiempo real si Socket.io está disponible
    if (req.io) {
      req.io.emit('newIncident', incident);
    }
    
    res.status(201).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error('Error creando incidente:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Obtener todos los incidentes
// @route   GET /api/incidents
// @access  Public
exports.getIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    console.error('Error obteniendo incidentes:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Error del servidor' 
    });
  }
};

// @desc    Obtener un incidente por su folio
// @route   GET /api/incidents/:folio
// @access  Public
exports.getIncidentByFolio = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({ folio: req.params.folio })
      .populate('user', 'name email');

    if (!incident) {
      return res.status(404).json({ 
        success: false, 
        error: 'Incidente no encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error('Error obteniendo incidente por folio:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Error del servidor' 
    });
  }
};

// @desc    Actualizar estado de incidente
// @route   PUT /api/incidents/:folio
// @access  Private (Admin)
exports.updateIncidentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const incident = await Incident.findOneAndUpdate(
      { folio: req.params.folio },
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!incident) {
      return res.status(404).json({ 
        success: false, 
        error: 'Incidente no encontrado' 
      });
    }

    // Emitir actualización en tiempo real
    if (req.io) {
      req.io.emit('incidentUpdated', incident);
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error('Error actualizando incidente:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};