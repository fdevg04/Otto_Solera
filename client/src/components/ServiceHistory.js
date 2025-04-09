import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ServiceHistory.css'; // Asegúrate de tener este archivo CSS o ajusta el estilo en línea

const ServiceHistory = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServiceHistory = async () => {
      try {
        const res = await axios.get('/api/hiring/history', {
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
    <div className="service-history-container">
      <h2 className="title">Historial de Servicios</h2>
      {services.length === 0 ? (
        <p className="no-services">No tienes servicios registrados.</p>
      ) : (
        <table className="service-history-table">
          <thead>
            <tr>
              <th>Nombre del Cuidador</th>
              <th>Correo del Cuidador</th>
              <th>Fecha de Servicio</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td>{service.caregiverNombre}</td>
                <td>{service.caregiverCorreo}</td>
                <td>{new Date(service.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServiceHistory;
