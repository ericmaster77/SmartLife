import React, { useState } from 'react';
import incidentService from '../../services/incident.service';
import Button from '../common/Button';
import Dropzone from 'react-dropzone';  // Nuevo

const IncidentForm = () => {
  const [formData, setFormData] = useState({ /* existente */ });
  const [preview, setPreview] = useState(null);  // Para preview
  const [file, setFile] = useState(null);

  // ... (handleChange existente)

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(uploadedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) data.append('evidence', file);
    try {
      await incidentService.create(data);  // Usa FormData para upload
      alert('Incidente reportado!');
    } catch (err) {
      alert('Error al reportar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos existentes */}
      <Dropzone onDrop={onDrop} accept="image/*">
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()} className="border-2 border-dashed p-4 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <input {...getInputProps()} />
            <p>Arrastra o haz click para subir evidencia</p>
          </div>
        )}
      </Dropzone>
      {preview && <img src={preview} alt="Preview" className="mt-2 max-h-48 rounded" />}
      <Button type="submit" className="btn-primary">Reportar</Button>  // Usando custom class
    </form>
  );
};

export default IncidentForm;