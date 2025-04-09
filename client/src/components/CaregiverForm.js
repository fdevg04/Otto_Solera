import React, { useState } from 'react'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/CaregiverForm.css'; // Asegúrate de tener este archivo CSS

const CaregiverForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    identificacion: '',
    correo: '',
    telefono: '',
    residencia: '',
    edad: '',
    especialidades: '',
    experiencia: '',
    password: '',
    costo: '' // Campo para el costo
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const { nombre, apellidos, identificacion, correo, telefono, residencia, edad, especialidades, experiencia, password, costo } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Validaciones
  const validateForm = () => {
    const newErrors = {};
    if (!nombre || nombre.length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    if (!apellidos || apellidos.length < 2) newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres.';
    if (!telefono || telefono.length < 6) newErrors.telefono = 'El teléfono debe tener al menos 6 caracteres.';
    if (!correo || !/\S+@\S+\.\S+/.test(correo)) newErrors.correo = 'El correo electrónico no es válido.';
    if (!edad || edad <= 0) newErrors.edad = 'La edad debe ser un número positivo.';
    if (!password || password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    if (costo < 0) newErrors.costo = 'El costo no puede ser negativo.';
    return newErrors;
  };

  const onSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('/api/caregivers/register', formData);
      setSuccessMessage('Su solicitud de inscripción ha sido enviada exitosamente.');
      setFormData({
        nombre: '',
        apellidos: '',
        identificacion: '',
        correo: '',
        telefono: '',
        residencia: '',
        edad: '',
        especialidades: '',
        experiencia: '',
        password: '',
        costo: '' // Limpiar el campo de costo
      });
    } catch (error) {
      setErrors({ server: error.response ? error.response.data.message : 'Error al enviar el formulario' });
    }
  };

  return (
    <div className="caregiver-form-container">
      {successMessage ? (
        <div className="success-message">
          <h2>{successMessage}</h2>
          <p>¡Gracias por registrarse como cuidador!</p>
          <Link to="/" className="btn-back-home">Volver a la página principal</Link>
        </div>
      ) : (
        <form className="caregiver-form" onSubmit={onSubmit}>
          <h2 className="form-title">Formulario de Inscripción para Cuidadores</h2>

          <input
            type="text"
            name="nombre"
            value={nombre}
            onChange={onChange}
            placeholder="Nombre"
            className="input-field"
            required
          />
          {errors.nombre && <p className="error">{errors.nombre}</p>}

          <input
            type="text"
            name="apellidos"
            value={apellidos}
            onChange={onChange}
            placeholder="Apellidos"
            className="input-field"
            required
          />
          {errors.apellidos && <p className="error">{errors.apellidos}</p>}

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
          {errors.correo && <p className="error">{errors.correo}</p>}

          <input
            type="text"
            name="telefono"
            value={telefono}
            onChange={onChange}
            placeholder="Teléfono"
            className="input-field"
            required
          />
          {errors.telefono && <p className="error">{errors.telefono}</p>}

          <input
            type="text"
            name="residencia"
            value={residencia}
            onChange={onChange}
            placeholder="Lugar de Residencia"
            className="input-field"
            required
          />

          <input
            type="number"
            name="edad"
            value={edad}
            onChange={onChange}
            placeholder="Edad"
            className="input-field"
            required
          />
          {errors.edad && <p className="error">{errors.edad}</p>}

          <textarea
            name="especialidades"
            value={especialidades}
            onChange={onChange}
            placeholder="Especialidades"
            className="textarea-field"
            required
          />

          <textarea
            name="experiencia"
            value={experiencia}
            onChange={onChange}
            placeholder="Experiencia"
            className="textarea-field"
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
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="number"
            name="costo"
            value={costo}
            onChange={onChange}
            placeholder="Costo por sus servicios"
            className="input-field"
          />
          {errors.costo && <p className="error">{errors.costo}</p>}

          {errors.server && <p className="error">{errors.server}</p>}

          <button type="submit" className="btn-submit">Enviar Solicitud</button>
        </form>
      )}
    </div>
  );
};

export default CaregiverForm;