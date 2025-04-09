import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CaregiverServiceHistory.css'; // Asegúrate de tener este archivo CSS

const CaregiverServiceHistory = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServiceHistory = async () => {
      try {
        const res = await axios.get('/api/caregivers/caregivers/history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setServices(res.data); // Almacenar los servicios
        setLoading(false);
      } catch (err) {
        setError('Error al obtener el historial de servicios');
        setLoading(false);
      }
    };

    fetchServiceHistory();
  }, []);

  if (loading) {
    return <p className="loading-message">Cargando el historial de servicios...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="caregiver-service-history-container">
      <h2 className="title">Historial de Servicios como Cuidador</h2>
      {services.length === 0 ? (
        <p className="no-services">No tienes servicios registrados.</p>
      ) : (
        <table className="caregiver-service-history-table">
          <thead>
            <tr>
              <th>Nombre del Beneficiario Cuidado</th>
              <th>Correo del Beneficiario Cuidado</th>
              <th>Fecha del Servicio</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td>{service.beneficiaryNombre}</td>
                <td>{service.beneficiaryCorreo}</td>
                <td>{new Date(service.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CaregiverServiceHistory;
