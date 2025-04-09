// src/components/AdminApprovedCaregiversList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminApprovedCaregiversList.css';

const AdminApprovedCaregiversList = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const res = await axios.get('/api/admins/caregivers/approved');
        setCaregivers(res.data);
      } catch (error) {
        console.error('Error al obtener los cuidadores aprobados:', error);
      }
    };

    fetchCaregivers();
  }, []);

  // Filtrar cuidadores aprobados según el término de búsqueda
  const filteredCaregivers = caregivers.filter(caregiver =>
    caregiver.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para eliminar (lógicamente) un cuidador
  const deleteCaregiver = async (id) => {
    try {
      await axios.put(`/api/admins/caregivers/delete/${id}`);
      setCaregivers(caregivers.filter(caregiver => caregiver._id !== id)); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar al cuidador:', error);
    }
  };

  return (
    <div className="approved-caregivers-container">
      <h2 className="title">Lista de Cuidadores Aprobados</h2>
  
      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar cuidadores por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
  
      {/* Lista de cuidadores aprobados en una tabla */}
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
                  className="btn btn-edit" 
                  onClick={() => window.location.href = `/admin/caregivers/edit/${caregiver._id}`}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-delete" 
                  onClick={() => deleteCaregiver(caregiver._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminApprovedCaregiversList;
