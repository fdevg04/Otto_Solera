import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BeneficiaryAcceptedHirings.css'; // Asegúrate de tener este archivo CSS o ajusta el estilo en línea

const BeneficiaryAcceptedHirings = () => {
  const [hirings, setHirings] = useState([]);
  const [feedback, setFeedback] = useState({
    comentario: '',
    rating: 1, // Inicializamos con una estrella
  });

  useEffect(() => {
    const fetchHirings = async () => {
      try {
        const res = await axios.get('/api/beneficiaries/beneficiaries/contrataciones-aprobadas', {
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

  const submitFeedback = async (caregiverEmail) => {
    try {
      const caregiverResponse = await axios.get(`/api/caregivers/by-email/${caregiverEmail}`);
      const caregiverId = caregiverResponse.data._id;

      const res = await axios.post(`/api/users/${caregiverId}/feedback`, feedback, {
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
      <h2 className="title">Solicitudes Aceptadas</h2>
      <table className="hirings-table">
        <thead>
          <tr>
            <th>Mensaje</th>
            <th>Correo del Cuidador</th>
            <th>Reseña y Puntuación</th>
          </tr>
        </thead>
        <tbody>
          {hirings.map((hiring) => (
            <tr key={hiring._id}>
              <td>{hiring.message}</td>
              <td>{hiring.caregiverEmail}</td>
              <td>
                <h3 className="review-title">Añadir Reseña y Puntuación</h3>
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
                <button className="btn-submit" onClick={() => submitFeedback(hiring.caregiverEmail)}>
                  Enviar Reseña
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BeneficiaryAcceptedHirings;
