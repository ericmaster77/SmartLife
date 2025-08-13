import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Arreglar los iconos de leaflet que no aparecen por defecto en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: `<div style="background-color: #3b82f6; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
  iconSize: [25, 25],
  iconAnchor: [12, 24],
  popupAnchor: [1, -34],
  className: 'custom-div-icon'
});

L.Marker.prototype.options.icon = DefaultIcon;

// Coordenadas de Miahuatlán de Porfirio Díaz, Oaxaca
const MIAHUTLAN_COORDS = [16.3309, -96.6285];

// Componente para centrar el mapa cuando cambian los incidentes
const MapController = ({ incidents, center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (incidents && incidents.length > 0) {
      // Si hay incidentes, ajustar el mapa para mostrar todos
      const validIncidents = incidents.filter(inc => 
        inc.location && inc.location.coordinates && inc.location.coordinates.length === 2
      );
      
      if (validIncidents.length > 0) {
        const bounds = L.latLngBounds(
          validIncidents.map(inc => [
            inc.location.coordinates[1], // lat
            inc.location.coordinates[0]  // lng
          ])
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    } else {
      // Si no hay incidentes, centrar en Miahuatlán
      map.setView(center, 13);
    }
  }, [incidents, map, center]);
  
  return null;
};

const IncidentMap = ({ incidents = [], height = '400px', showUserLocation = true }) => {
  const mapRef = useRef();

  // Crear iconos personalizados según la categoría
  const getCategoryIcon = (category) => {
    const colors = {
      'Seguridad': '#ef4444',        // rojo
      'Infraestructura': '#f97316',   // naranja
      'Servicios Públicos': '#3b82f6', // azul
      'Medio Ambiente': '#22c55e',    // verde
      'Movilidad': '#8b5cf6',         // púrpura
      'Otro': '#6b7280'               // gris
    };
    
    const color = colors[category] || colors['Otro'];
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
      popupAnchor: [1, -30],
      className: 'custom-category-icon'
    });
  };

  // Obtener estado del incidente con color
  const getStatusBadge = (status) => {
    const statusColors = {
      'Recibida': 'bg-yellow-100 text-yellow-800',
      'En Revisión': 'bg-blue-100 text-blue-800',
      'En Proceso': 'bg-orange-100 text-orange-800',
      'Resuelta': 'bg-green-100 text-green-800',
      'Rechazada': 'bg-red-100 text-red-800'
    };
    
    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
    
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${status}</span>`;
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={MIAHUTLAN_COORDS} 
        zoom={13} 
        style={{ height, width: '100%' }}
        ref={mapRef}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController incidents={incidents} center={MIAHUTLAN_COORDS} />
        
        {/* Marcador central de Miahuatlán */}
        <Marker position={MIAHUTLAN_COORDS} icon={L.divIcon({
          html: `<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 16px;">🏛️</span></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
          className: 'center-marker'
        })}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-green-600">Miahuatlán de Porfirio Díaz</h3>
              <p className="text-sm text-gray-600">Centro Municipal</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Marcadores de incidentes */}
        {incidents && incidents.map((incident) => {
          // Validar que el incidente tenga coordenadas válidas
          if (!incident.location || 
              !incident.location.coordinates || 
              incident.location.coordinates.length !== 2 ||
              typeof incident.location.coordinates[0] !== 'number' ||
              typeof incident.location.coordinates[1] !== 'number') {
            return null;
          }
          
          const [lng, lat] = incident.location.coordinates;
          
          return (
            <Marker 
              key={incident.folio || incident._id} 
              position={[lat, lng]}
              icon={getCategoryIcon(incident.category)}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="space-y-2">
                  <div className="border-b pb-2">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {incident.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Folio: {incident.folio}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">
                      <strong>Categoría:</strong> {incident.category}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Estado:</span>
                      <div dangerouslySetInnerHTML={{ 
                        __html: getStatusBadge(incident.status) 
                      }} />
                    </div>
                    
                    <p className="text-sm text-gray-700">
                      <strong>Descripción:</strong>
                    </p>
                    <p className="text-xs text-gray-600 max-h-16 overflow-y-auto">
                      {incident.description}
                    </p>
                    
                    {incident.location.address && (
                      <p className="text-xs text-gray-500">
                        📍 {incident.location.address}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400">
                      {new Date(incident.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  {incident.evidence && (
                    <div className="pt-2">
                      <img 
                        src={`http://localhost:5000/${incident.evidence}`}
                        alt="Evidencia" 
                        className="w-full h-24 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 p-3 border-t">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Seguridad</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Infraestructura</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Servicios Públicos</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Medio Ambiente</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Movilidad</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Otro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentMap;