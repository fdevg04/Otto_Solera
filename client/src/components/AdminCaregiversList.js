// src/components/AdminCaregiversList.js (modificado para aprobar y rechazar)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminCaregiversList.css';

const AdminCaregiversList = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCaregivers = async () => {
      const res = await axios.get('/api/admins/caregivers/pending');
      setCaregivers(res.data);
    };
    fetchCaregivers();
  }, []);

  const approveCaregiver = async id => {
    await axios.post(`/api/admins/caregivers/approve/${id}`);
    setCaregivers(caregivers.filter(c => c._id !== id));
  };

  const rejectCaregiver = async id => {
    await axios.post(`/api/admins/caregivers/reject/${id}`);
    setCaregivers(caregivers.filter(c => c._id !== id));
  };

  const filteredCaregivers = caregivers.filter(caregiver =>
    caregiver.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="caregivers-container">
      <h2 className="title">Formularios Entrantes de Nuevos Cuidadores</h2>
  
      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar cuidador por nombre"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
  
      {/* Lista de cuidadores en una tabla */}
      <table className="caregivers-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Residencia</th>
            <th>Especialidades</th>
            <th>Experiencia</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCaregivers.map(caregiver => (
            <tr key={caregiver._id}>
              <td>{caregiver.nombre} {caregiver.apellidos}</td>
              <td>{caregiver.correo}</td>
              <td>{caregiver.residencia}</td>
              <td>{caregiver.especialidades}</td>
              <td>{caregiver.experiencia} años</td>
              <td>₡{caregiver.costo}</td>
              <td>
                <button 
                  className="btn btn-approve" 
                  onClick={() => approveCaregiver(caregiver._id)}
                >
                  Aprobar
                </button>
                <button 
                  className="btn btn-reject" 
                  onClick={() => rejectCaregiver(caregiver._id)}
                >
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};  

export default AdminCaregiversList;
