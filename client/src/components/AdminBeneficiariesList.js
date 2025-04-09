import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminBeneficiariesList.css'; // Asegúrate de tener este archivo CSS o ajusta el estilo en línea

const AdminBeneficiariesList = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await axios.get('/api/admins/beneficiaries');
        setBeneficiaries(res.data);
      } catch (error) {
        console.error('Error al obtener los beneficiarios:', error);
      }
    };

    fetchBeneficiaries();
  }, []);

  // Filtrar beneficiarios según el término de búsqueda
  const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
    beneficiary.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para eliminar un beneficiario
  const deleteBeneficiary = async (id) => {
    try {
      await axios.delete(`/api/admins/beneficiaries/${id}`);
      setBeneficiaries(beneficiaries.filter(beneficiary => beneficiary._id !== id)); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar el beneficiario:', error);
    }
  };

  return (
    <div className="admin-beneficiaries-container">
      <h2 className="title">Lista de Beneficiarios</h2>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar beneficiarios por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de beneficiarios en una tabla */}
      <table className="beneficiaries-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Residencia</th>
            <th>Necesidades</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredBeneficiaries.map(beneficiary => (
            <tr key={beneficiary._id}>
              <td>{beneficiary.nombre} {beneficiary.apellidos}</td>
              <td>{beneficiary.correo}</td>
              <td>{beneficiary.residencia}</td>
              <td>{beneficiary.necesidades}</td>
              <td>
                <button className="btn btn-edit" onClick={() => window.location.href = `/admin/beneficiaries/edit/${beneficiary._id}`}>
                  Editar
                </button>
                <button className="btn btn-delete" onClick={() => deleteBeneficiary(beneficiary._id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBeneficiariesList;
