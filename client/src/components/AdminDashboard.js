// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [pendingCaregivers, setPendingCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener el token JWT del localStorage
  const token = localStorage.getItem('token');

  // Obtener cuidadores pendientes cuando se carga el componente
  useEffect(() => {
    const fetchPendingCaregivers = async () => {
      try {
        const res = await axios.get('/api/caregivers/pending', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPendingCaregivers(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener cuidadores pendientes:', error.response.data);
      }
    };

    fetchPendingCaregivers();
  }, [token]);

  // Función para aprobar un cuidador
  const approveCaregiver = async (id) => {
    try {
      const res = await axios.put(`/api/caregivers/approve/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res.data);
      // Remover al cuidador aprobado de la lista de pendientes
      setPendingCaregivers(pendingCaregivers.filter(c => c._id !== id));
    } catch (error) {
      console.error('Error al aprobar cuidador:', error.response.data);
    }
  };

  // Función para rechazar un cuidador
  const rejectCaregiver = async (id) => {
    try {
      const res = await axios.delete(`/api/caregivers/reject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res.data);
      // Remover al cuidador rechazado de la lista de pendientes
      setPendingCaregivers(pendingCaregivers.filter(c => c._id !== id));
    } catch (error) {
      console.error('Error al rechazar cuidador:', error.response.data);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Panel de Administración</h1>
      <h2>Cuidadores Pendientes</h2>
      {pendingCaregivers.length > 0 ? (
        <ul>
          {pendingCaregivers.map(caregiver => (
            <li key={caregiver._id}>
              {caregiver.nombre} {caregiver.apellidos} - {caregiver.residencia}
              <button onClick={() => approveCaregiver(caregiver._id)}>Aprobar</button>
              <button onClick={() => rejectCaregiver(caregiver._id)}>Rechazar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay cuidadores pendientes.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
