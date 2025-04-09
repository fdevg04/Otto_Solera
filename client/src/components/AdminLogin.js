// src/components/AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const { correo, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admins/login', formData);
      console.log('Inicio de sesión exitoso:', res.data);

      // Guardar el token en localStorage
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        name="correo"
        value={correo}
        onChange={onChange}
        placeholder="Correo"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Contraseña"
        required
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default AdminLogin;
