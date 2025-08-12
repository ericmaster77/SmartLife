import React, { useEffect, useState } from 'react';
import IncidentList from '../components/incident/IncidentList';
import IncidentMap from '../components/incident/IncidentMap';
import incidentService from '../services/incident.service';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';  // Nuevo

const HomePage = () => {
  const [incidents, setIncidents] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await incidentService.getAll();
      const data = res.data.data;
      setIncidents(data);
      // Calcular datos para chart
      const statuses = ['Recibida', 'En Revisión', 'En Proceso', 'Resuelta'];
      const counts = statuses.map(status => ({
        name: status,
        count: data.filter(i => i.status === status).length,
      }));
      setChartData(counts);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Bienvenido a Smart Life</h1>
      <IncidentMap incidents={incidents} />
      <h2 className="text-xl">Indicadores</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
      <IncidentList />
    </div>
  );
};

export default HomePage;