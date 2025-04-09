import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RequestReview.css'; // Asegúrate de tener este archivo CSS

const RequestReview = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('/api/feedbacks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFeedbacks(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error al obtener los feedbacks');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const requestReview = async (id) => {
    try {
      await axios.put(`/api/request-review/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Revisión solicitada con éxito');
      setFeedbacks(feedbacks.map(fb => fb._id === id ? { ...fb, estado: 'revision' } : fb));
    } catch (err) {
      console.error('Error al solicitar revisión:', err);
    }
  };

  if (loading) return <p className="loading-message">Cargando evaluaciones...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="request-review-container">
      <h2 className="title">Mis Evaluaciones Recibidas</h2>
      {feedbacks.length === 0 ? (
        <p className="no-feedbacks">No has recibido ninguna evaluación.</p>
      ) : (
        <table className="feedbacks-table">
          <thead>
            <tr>
              <th>Comentario</th>
              <th>Puntuación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(feedback => (
              <tr key={feedback._id}>
                <td>{feedback.comentario}</td>
                <td>{feedback.rating}</td>
                <td>{feedback.estado}</td>
                <td>
                  {feedback.estado === 'aprobado' && (
                    <button 
                      className="btn-request-review" 
                      onClick={() => requestReview(feedback._id)}
                    >
                      Solicitar Revisión
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestReview;
