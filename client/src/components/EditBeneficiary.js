import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/EditBeneficiary.css'; // Asegúrate de tener este archivo CSS o ajusta el estilo en línea

const EditBeneficiary = () => {
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    residencia: '',
    edad: '',
    necesidades: ''
  });

  useEffect(() => {
    const fetchBeneficiary = async () => {
      try {
        const res = await axios.get(`/api/admins/beneficiaries/${id}`);
        setBeneficiary(res.data);
      } catch (error) {
        console.error('Error al obtener los datos del beneficiario:', error);
      }
    };

    fetchBeneficiary();
  }, [id]);

  const onChange = (e) => setBeneficiary({ ...beneficiary, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admins/beneficiaries/${id}`, beneficiary);
      alert('Beneficiario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el beneficiario:', error);
    }
  };

  return (
    <div className="edit-beneficiary-container">
      <h2 className="title">Editar Beneficiario</h2>
      <form className="edit-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="nombre"
          value={beneficiary.nombre}
          onChange={onChange}
          placeholder="Nombre"
          className="input-field"
          required
        />
        <input
          type="text"
          name="apellidos"
          value={beneficiary.apellidos}
          onChange={onChange}
          placeholder="Apellidos"
          className="input-field"
          required
        />
        <input
          type="email"
          name="correo"
          value={beneficiary.correo}
          onChange={onChange}
          placeholder="Correo"
          className="input-field"
          required
        />
        <input
          type="text"
          name="telefono"
          value={beneficiary.telefono}
          onChange={onChange}
          placeholder="Teléfono"
          className="input-field"
          required
        />
        <input
          type="text"
          name="residencia"
          value={beneficiary.residencia}
          onChange={onChange}
          placeholder="Residencia"
          className="input-field"
          required
        />
        <input
          type="number"
          name="edad"
          value={beneficiary.edad}
          onChange={onChange}
          placeholder="Edad"
          className="input-field"
          required
        />
        <input
          type="text"
          name="necesidades"
          value={beneficiary.necesidades}
          onChange={onChange}
          placeholder="Necesidades"
          className="input-field"
          required
        />
        <button type="submit" className="btn-submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditBeneficiary;
