import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import incidentService from '../../services/incident.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:5000');

const IncidentList = React.memo(() => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      const res = await incidentService.getAll();
      setIncidents(res.data.data);
    };
    fetchIncidents();

    socket.on('newIncident', (newInc) => {
      setIncidents((prev) => [...prev, newInc]);
      toast.success('Nuevo incidente reportado!');
    });

    return () => socket.off('newIncident');
  }, []);

  return (
    <>
      <ToastContainer />
      <ul className="space-y-4 md:grid md:grid-cols-2 md:gap-4">
        {incidents.map((inc) => (
          <li key={inc.folio} className="border p-4 rounded shadow dark:border-gray-700">
            {inc.title} - {inc.status}
            {inc.evidence && (
              <img
                src={`http://localhost:5000/${inc.evidence}`}
                alt="Evidence"
                className="mt-2 max-h-32"
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
});

export default IncidentList;