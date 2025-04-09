import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CaregiverCertification.css';

const CaregiverCertifications = () => {
  const [certificaciones, setCertificaciones] = useState([]);
  const [newCertificacion, setNewCertificacion] = useState({
    nombre: '',
    url: '',
  });

  useEffect(() => {
    const fetchCertificaciones = async () => {
      try {
        const res = await axios.get('/api/certificaciones', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCertificaciones(res.data);
      } catch (error) {
        console.error('Error al obtener las certificaciones:', error);
      }
    };

    fetchCertificaciones();
  }, []);

  const handleInputChange = (e) => {
    setNewCertificacion({ ...newCertificacion, [e.target.name]: e.target.value });
  };

  const submitCertificacion = async () => {
    try {
      const res = await axios.post('/api/certificaciones', newCertificacion, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCertificaciones([...certificaciones, res.data]); // Agregar la nueva certificación a la lista
      setNewCertificacion({ nombre: '', url: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al agregar la certificación:', error);
    }
  };

  const deleteCertificacion = async (id) => {
    try {
      await axios.delete(`/api/certificaciones/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCertificaciones(certificaciones.filter(cert => cert._id !== id)); // Eliminar de la lista
    } catch (error) {
      console.error('Error al eliminar la certificación:', error);
    }
  };

  return (
    <div className="certifications-container">
      <h2 className="title">Certificaciones y Capacitaciones</h2>
      <ul className="certifications-list">
        {certificaciones.map(cert => (
          <li key={cert._id} className="certification-item">
            <strong>{cert.nombre}</strong>
            {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer"> Ver documento</a>}
            <button className="btn-delete" onClick={() => deleteCertificacion(cert._id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <h3 className="add-title">Añadir Nueva Certificación</h3>
      <form className="add-certification-form">
        <input
          type="text"
          name="nombre"
          value={newCertificacion.nombre}
          onChange={handleInputChange}
          placeholder="Nombre de la certificación"
          className="input-field"
          required
        />
        <input
          type="text"
          name="url"
          value={newCertificacion.url}
          onChange={handleInputChange}
          placeholder="URL del documento (opcional)"
          className="input-field"
        />
        <button className="btn-submit" type="button" onClick={submitCertificacion}>Agregar Certificación</button>
      </form>
    </div>
  );
};

export default CaregiverCertifications;
