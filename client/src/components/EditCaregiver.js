import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/EditCaregiver.css';

const EditCaregiver = () => {
  const { id } = useParams();
  const [caregiver, setCaregiver] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    residencia: '',
    especialidades: '',
    experiencia: '',
  });

  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        const res = await axios.get(`/api/admins/caregivers/${id}`);
        setCaregiver(res.data);
      } catch (error) {
        console.error('Error al obtener los datos del cuidador:', error);
      }
    };

    fetchCaregiver();
  }, [id]);

  const onChange = (e) => setCaregiver({ ...caregiver, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admins/caregivers/${id}`, caregiver);
      alert('Cuidador actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar al cuidador:', error);
    }
  };

  return (
    <div className="edit-caregiver-container">
      <h2>Editar Cuidador</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="nombre"
          value={caregiver.nombre}
          onChange={onChange}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          name="apellidos"
          value={caregiver.apellidos}
          onChange={onChange}
          placeholder="Apellidos"
          required
        />
        <input
          type="email"
          name="correo"
          value={caregiver.correo}
          onChange={onChange}
          placeholder="Correo"
          required
        />
        <input
          type="text"
          name="telefono"
          value={caregiver.telefono}
          onChange={onChange}
          placeholder="Teléfono"
          required
        />
        <input
          type="text"
          name="residencia"
          value={caregiver.residencia}
          onChange={onChange}
          placeholder="Residencia"
          required
        />
        <input
          type="text"
          name="especialidades"
          value={caregiver.especialidades}
          onChange={onChange}
          placeholder="Especialidades"
          required
        />
        <input
          type="text"
          name="experiencia"
          value={caregiver.experiencia}
          onChange={onChange}
          placeholder="Experiencia"
          required
        />
        <button type="submit" className="btn-submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditCaregiver;
