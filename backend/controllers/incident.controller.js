// backend/controllers/incident.controller.js
const Incident = require('../models/Incident');

// @desc    Crear un nuevo incidente
// @route   POST /api/incidents
// @access  Public
exports.createIncident = async (req, res, next) => {
  try {
    const incident = await Incident.create(req.body);
    res.status(201).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Obtener todos los incidentes
// @route   GET /api/incidents
// @access  Public
exports.getIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find();
    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Obtener un incidente por su folio
// @route   GET /api/incidents/:folio
// @access  Public
exports.getIncidentByFolio = async (req, res, next) => {
    try {
        const incident = await Incident.findOne({ folio: req.params.folio });

        if (!incident) {
            return res.status(404).json({ success: false, error: 'Incidente no encontrado' });
        }

        res.status(200).json({
            success: true,
            data: incident,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

exports.createIncident = async (req, res, next) => {
  try {
    const incidentData = req.body;
    if (req.file) {
      incidentData.evidence = req.file.path;  // Guarda path del file
    }
    const incident = await Incident.create(incidentData);
    // Emitir real-time (ver más abajo)
    req.io.emit('newIncident', incident);  // Nuevo para Socket.io
    res.status(201).json({ success: true, data: incident });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};