import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/CaregiversList.css'; // Asegúrate de tener este archivo CSS o ajusta el estilo en línea

const CaregiversList = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [favorites, setFavorites] = useState([]); // Para almacenar cuidadores favoritos
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState({}); // Un objeto para almacenar los mensajes por cuidador
  const [showNotification, setShowNotification] = useState(false); // Para mostrar la notificación emergente

  // Obtener la lista de cuidadores
  const fetchCaregivers = useCallback(async () => {
    try {
      const res = await axios.get('/api/caregivers/caregivers', {
        params: { search }
      });
      setCaregivers(res.data);
    } catch (error) {
      console.error('Error al obtener los cuidadores:', error);
    }
  }, [search]);

  // Obtener la lista de favoritos del beneficiario
  const fetchFavorites = useCallback(async () => {
    try {
      const res = await axios.get('/api/beneficiaries/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFavorites(res.data.map(fav => fav._id));  // Obtener solo los IDs de los cuidadores favoritos
    } catch (error) {
      console.error('Error al obtener los favoritos:', error);
    }
  }, []);

  useEffect(() => {
    fetchCaregivers();
    fetchFavorites(); // Obtener favoritos al cargar el componente
  }, [search, fetchCaregivers, fetchFavorites]);

  // Manejar el cambio de mensaje por cuidador
  const handleMessageChange = (caregiverId, value) => {
    setMessages({
      ...messages,
      [caregiverId]: value // Actualiza el mensaje para el cuidador específico
    });
  };

  // Enviar solicitud de contratación
  const sendRequest = async (caregiverId) => {
    try {
      const res = await axios.post(`/api/caregivers/caregivers/${caregiverId}/contratacion`, { message: messages[caregiverId] });
      alert(res.data.msg);
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  // Marcar o desmarcar un cuidador como favorito
  const toggleFavorite = async (caregiverId) => {
    try {
      const isFavorite = favorites.includes(caregiverId);

      if (isFavorite) {
        await axios.delete(`/api/beneficiaries/favorites/${caregiverId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFavorites(favorites.filter(fav => fav !== caregiverId)); // Eliminar de favoritos
      } else {
        await axios.post(`/api/beneficiaries/favorites/${caregiverId}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFavorites([...favorites, caregiverId]); // Añadir a favoritos
      }
    } catch (error) {
      console.error('Error al gestionar favoritos:', error);
    }
  };

  // Mostrar notificación emergente si el cuidador tiene costo mayor a 0
  const handleCaregiverClick = (costo) => {
    if (costo > 0) {
      setShowNotification(true);
    }
  };

  return (
    <div className="caregivers-list-container">
      <h2 className="title">Lista de Cuidadores</h2>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar cuidador por nombre, apellidos o especialidades"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista de cuidadores en una tabla */}
      <table className="caregivers-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especialidades</th>
            <th>Experiencia</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {caregivers.map((caregiver) => (
            <tr key={caregiver._id} onClick={() => handleCaregiverClick(caregiver.costo)}>
              <td>{caregiver.nombre} {caregiver.apellidos}</td>
              <td>{caregiver.especialidades}</td>
              <td>{caregiver.experiencia}</td>

              {/* Mostrar el costo y el costo adicional si aplica */}
              <td>
                {caregiver.costo > 0 ? (
                  <>
                    <p>₡{caregiver.costo} por hora</p>
                    <p>₡{caregiver.totalCosto} Total</p>
                  </>
                ) : (
                  <p>Sin costo</p>
                )}
              </td>
              <td>
                <input
                  type="text"
                  className="message-input"
                  placeholder="Mensaje para el cuidador"
                  value={messages[caregiver._id] || ''} // Mostrar el mensaje específico para ese cuidador
                  onChange={(e) => handleMessageChange(caregiver._id, e.target.value)}
                />
                <button className="btn-submit" onClick={() => sendRequest(caregiver._id)}>
                  Enviar solicitud
                </button>
                <button className="btn-favorite" onClick={() => toggleFavorite(caregiver._id)}>
                  {favorites.includes(caregiver._id) ? 'Eliminar de Favoritos' : 'Añadir a Favoritos'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Notificación emergente */}
      {showNotification && (
        <div className="notification">
          <p>Un 3% del total será destinado a la fundación para ayudar a aquellos cuidadores en necesidad.</p>
          <button onClick={() => setShowNotification(false)} className="btn-notification-close">Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default CaregiversList;
