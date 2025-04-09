// src/components/AdminDonationsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDonationsList.css';

const AdminDonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get('/api/admins/donations');
        setDonations(res.data);
      } catch (error) {
        console.error('Error al obtener las donaciones:', error);
      }
    };

    fetchDonations();
  }, []);

  // Función para eliminar una donación
  const deleteDonation = async (id) => {
    try {
      await axios.delete(`/api/admins/donations/${id}`);
      setDonations(donations.filter(donation => donation._id !== id)); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar la donación:', error);
    }
  };

  // Filtrar donaciones según el término de búsqueda
  const filteredDonations = donations.filter(donation =>
    donation.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="donations-container">
      <h2 className="title">Formularios Entrantes de Donaciones</h2>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar donaciones por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de donaciones en una tabla */}
      {filteredDonations.length === 0 ? (
        <p className="no-donations">No se encontraron donaciones.</p>
      ) : (
        <table className="donations-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Pertenece a Compañía</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map(donation => (
              <tr key={donation._id}>
                <td>{donation.nombre} {donation.apellidos}</td>
                <td>{donation.correo}</td>
                <td>{donation.perteneceCompania ? 'Sí' : 'No'}</td>
                <td>
                  <button className="btn btn-delete" onClick={() => deleteDonation(donation._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDonationsList;