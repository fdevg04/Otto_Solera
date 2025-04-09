import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CaregiversAcceptedHirings.css'; // Asegúrate de tener este archivo CSS o ajusta el estilo en línea

const CaregiverAcceptedHirings = () => {
  const [hirings, setHirings] = useState([]);
  const [feedback, setFeedback] = useState({
    comentario: '',
    rating: 1, // Inicializamos con una estrella
  });

  useEffect(() => {
    const fetchHirings = async () => {
      try {
        const res = await axios.get('/api/caregivers/caregivers/contrataciones-aprobadas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setHirings(res.data);
      } catch (error) {
        console.error('Error al obtener las contrataciones aprobadas:', error);
      }
    };

    fetchHirings();
  }, []);

  const handleInputChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const submitFeedback = async (beneficiaryId) => {
    try {
      const res = await axios.post(`/api/users/${beneficiaryId}/feedback`, feedback, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert(res.data.message);
      setFeedback({
        comentario: '',
        rating: 1, // Reiniciar el formulario
      });
    } catch (error) {
      console.error('Error al enviar el feedback:', error);
    }
  };

  return (
    <div className="accepted-hirings-container">
      <h2 className="title">Servicios Aceptados</h2>
      {hirings.length === 0 ? (
        <p className="no-hirings">No tienes solicitudes aceptadas.</p>
      ) : (
        <table className="hirings-table">
          <thead>
            <tr>
              <th>Mensaje del Beneficiario</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Reseña y Puntuación</th>
            </tr>
          </thead>
          <tbody>
            {hirings.map((hiring) => (
              <tr key={hiring._id}>
                <td>{hiring.message}</td>
                <td>{hiring.beneficiaryId.nombre}</td>
                <td>{hiring.beneficiaryId.correo}</td>
                <td>
                  <h3 className="review-title">Añadir Reseña y Puntuación al Beneficiario</h3>
                  <textarea
                    name="comentario"
                    value={feedback.comentario}
                    onChange={handleInputChange}
                    placeholder="Deja tu reseña"
                    className="textarea-feedback"
                    required
                  />
                  <br />
                  <label>Puntuación (1-5 estrellas):</label>
                  <select name="rating" value={feedback.rating} onChange={handleInputChange} className="rating-select">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>{star} Estrellas</option>
                    ))}
                  </select>
                  <br />
                  <button className="btn-submit" onClick={() => submitFeedback(hiring.beneficiaryId._id)}>
                    Enviar Reseña
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CaregiverAcceptedHirings;
