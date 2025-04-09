import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';  // Importamos el nuevo archivo de estilos

const Login = ({ setAuthToken }) => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { correo, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/auth/login', formData);
      const token = res.data.token;

      // Guardar el token y redirigir al homepage
      localStorage.setItem('token', token);
      setAuthToken(token);
      navigate('/'); // Redirigir al homepage
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="correo"
              value={correo}
              onChange={onChange}
              placeholder="Correo electrónico"
              required
              className="login-input"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Contraseña"
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
