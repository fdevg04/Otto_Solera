import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/BeneficiariesList.css'; // Asegúrate de tener este archivo CSS o ajusta el estilo en línea

const BeneficiariesList = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [favorites, setFavorites] = useState([]); // Para almacenar beneficiarios favoritos
  const [search, setSearch] = useState('');

  // Obtener la lista de beneficiarios
  const fetchBeneficiaries = useCallback(async () => {
    try {
      const res = await axios.get('/api/beneficiaries', {
        params: { search }
      });
      setBeneficiaries(res.data);
    } catch (error) {
      console.error('Error al obtener los beneficiarios:', error);
    }
  }, [search]);

  // Obtener la lista de favoritos del cuidador
  const fetchFavorites = async () => {
    try {
      const res = await axios.get('/api/caregivers/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFavorites(res.data);
    } catch (error) {
      console.error('Error al obtener los favoritos:', error);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
    fetchFavorites(); // Obtener favoritos al cargar el componente
  }, [search, fetchBeneficiaries]);

  // Marcar o desmarcar un beneficiario como favorito
  const toggleFavorite = async (beneficiaryId) => {
    try {
      const isFavorite = favorites.some(fav => fav._id === beneficiaryId);

      if (isFavorite) {
        await axios.delete(`/api/caregivers/favorites/${beneficiaryId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFavorites(favorites.filter(fav => fav._id !== beneficiaryId)); // Eliminar de favoritos
      } else {
        await axios.post(`/api/caregivers/favorites/${beneficiaryId}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFavorites([...favorites, beneficiaries.find(b => b._id === beneficiaryId)]); // Añadir a favoritos
      }
    } catch (error) {
      console.error('Error al gestionar favoritos:', error);
    }
  };

  return (
    <div className="beneficiaries-container">
      <h2 className="title">Lista de Beneficiarios</h2>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar beneficiario por nombre, apellidos o correo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista de beneficiarios en una tabla */}
      {beneficiaries.length === 0 ? (
        <p className="no-beneficiaries">No se encontraron beneficiarios.</p>
      ) : (
        <table className="beneficiaries-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((beneficiary) => (
              <tr key={beneficiary._id}>
                <td>{beneficiary.nombre} {beneficiary.apellidos}</td>
                <td>{beneficiary.correo}</td>
                <td>
                  <button className="btn btn-favorite" onClick={() => toggleFavorite(beneficiary._id)}>
                    {favorites.some(fav => fav._id === beneficiary._id) ? 'Eliminar de Favoritos' : 'Añadir a Favoritos'}
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

export default BeneficiariesList;
