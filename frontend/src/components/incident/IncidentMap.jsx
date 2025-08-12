import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const IncidentMap = ({ incidents }) => {
  return (
    <MapContainer center={[19.432608, -99.133209]} zoom={13} style={{ height: '400px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {incidents && incidents.map((inc) => (
        inc.location && inc.location.coordinates && (
          <Marker position={[inc.location.coordinates[1], inc.location.coordinates[0]]} key={inc.folio}>
            <Popup>{inc.title}</Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default IncidentMap;