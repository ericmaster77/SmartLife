const express = require('express');
const { createIncident, getIncidents, getIncidentByFolio } = require('../controllers/incident.controller');
const upload = require('../middleware/upload');  // Nuevo

const router = express.Router();

router.post('/', upload.single('evidence'), createIncident);  // Agrega upload para campo 'evidence'
router.get('/', getIncidents);
router.get('/:folio', getIncidentByFolio);

module.exports = router;