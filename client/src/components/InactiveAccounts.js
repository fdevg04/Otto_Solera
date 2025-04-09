// src/components/InactiveAccounts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/InactiveAccounts.css';

const InactiveAccounts = () => {
  const [inactiveCaregivers, setInactiveCaregivers] = useState([]);
  const [inactiveBeneficiaries, setInactiveBeneficiaries] = useState([]);

  useEffect(() => {
    const fetchInactiveAccounts = async () => {
      try {
        const res = await axios.get('/api/admins/inactivas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setInactiveCaregivers(res.data.cuidadoresInactivos);
        setInactiveBeneficiaries(res.data.beneficiariosInactivos);
      } catch (error) {
        console.error('Error al obtener cuentas inactivas:', error);
      }
    };

    fetchInactiveAccounts();
  }, []);

  const reactivateAccount = async (id, tipoUsuario) => {
    try {
      const res = await axios.put(`/api/admins/reactivar/${id}`, {
        tipoUsuario,
        datosActualizados: true,  // Los datos han sido verificados
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert(res.data.msg);
    } catch (error) {
      console.error('Error al reactivar la cuenta:', error);
    }
  };

  return (
    <div className="inactive-accounts-container">
      <h2 className="title">Cuidadores Inactivos</h2>
      {inactiveCaregivers.length === 0 ? (
        <p className="no-inactive">No hay cuidadores inactivos.</p>
      ) : (
        <table className="inactive-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inactiveCaregivers.map(caregiver => (
              <tr key={caregiver._id}>
                <td>{caregiver.nombre} {caregiver.apellidos}</td>
                <td>{caregiver.correo}</td>
                <td>
                  <button className="btn btn-reactivate" onClick={() => reactivateAccount(caregiver._id, 'caregiver')}>
                    Reactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="title">Beneficiarios Inactivos</h2>
      {inactiveBeneficiaries.length === 0 ? (
        <p className="no-inactive">No hay beneficiarios inactivos.</p>
      ) : (
        <table className="inactive-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inactiveBeneficiaries.map(beneficiary => (
              <tr key={beneficiary._id}>
                <td>{beneficiary.nombre} {beneficiary.apellidos}</td>
                <td>{beneficiary.correo}</td>
                <td>
                  <button className="btn btn-reactivate" onClick={() => reactivateAccount(beneficiary._id, 'beneficiary')}>
                    Reactivar
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

export default InactiveAccounts;
