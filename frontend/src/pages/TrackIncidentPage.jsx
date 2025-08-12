import React, { useState } from 'react';
import incidentService from '../services/incident.service';
import Button from '../components/common/Button';

const TrackIncidentPage = () => {
  const [folio, setFolio] = useState('');
  const [incident, setIncident] = useState(null);

  const handleTrack = async () => {
    try {
      const res = await incidentService.getByFolio(folio);
      setIncident(res.data.data);
    } catch (err) {
      alert('Folio no encontrado');
    }
  };

  return (
    <div>
      <h1>Seguimiento de Incidente</h1>
      <input value={folio} onChange={(e) => setFolio(e.target.value)} placeholder="Ingresa folio" className="border p-2" />
      <Button onClick={handleTrack}>Buscar</Button>
      {incident && (
        <div className="mt-4">
          <p>Título: {incident.title}</p>
          <p>Estado: {incident.status}</p>
        </div>
      )}
    </div>
  );
};

export default TrackIncidentPage;