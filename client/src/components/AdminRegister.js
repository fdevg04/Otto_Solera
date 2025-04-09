import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminRegister.css'; // Asegúrate de tener este archivo CSS o ajusta el estilo en línea

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    identificacion: '',
    correo: '',
    telefono: '',
    password: '',
  });

  const { nombre, apellidos, identificacion, correo, telefono, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admins/register', formData);
      console.log('Registro exitoso:', res.data);
    } catch (error) {
      console.error('Error en el registro:', error.response.data);
    }
  };

  return (
    <div className="admin-register-container">
      <h2 className="title">Registrar Administrador</h2>
      <form className="admin-register-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="nombre"
          value={nombre}
          onChange={onChange}
          placeholder="Nombre"
          className="input-field"
          required
        />
        <input
          type="text"
          name="apellidos"
          value={apellidos}
          onChange={onChange}
          placeholder="Apellidos"
          className="input-field"
          required
        />
        <input
          type="text"
          name="identificacion"
          value={identificacion}
          onChange={onChange}
          placeholder="Identificación"
          className="input-field"
          required
        />
        <input
          type="email"
          name="correo"
          value={correo}
          onChange={onChange}
          placeholder="Correo"
          className="input-field"
          required
        />
        <input
          type="text"
          name="telefono"
          value={telefono}
          onChange={onChange}
          placeholder="Teléfono"
          className="input-field"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Contraseña"
          className="input-field"
          required
        />
        <button type="submit" className="btn-submit">Registrar Administrador</button>
      </form>
    </div>
  );
};

export default AdminRegister;
