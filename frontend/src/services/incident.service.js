// frontend/src/services/incident.service.js
import axios from 'axios';

const API_URL = '/api/incidents';  // Sin barra final

// Crear un nuevo incidente
const create = (data) => {
  return axios.post(API_URL, data);
};

// Obtener todos los incidentes
const getAll = () => {
  return axios.get(API_URL);
};

// Obtener un incidente por folio
const getByFolio = (folio) => {
  return axios.get(`${API_URL}/${folio}`);
};

const incidentService = {
  create,
  getAll,
  getByFolio,
};

export default incidentService;