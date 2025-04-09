import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/SponsorForm.css'; // Asegúrate de tener este archivo CSS

const SponsorForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    perteneceCompania: false,
    correo: '',
    monto: '' 
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const { nombre, apellidos, perteneceCompania, correo, monto } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Validaciones
  const validateForm = () => {
    const newErrors = {};
    if (!nombre || nombre.length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    if (!apellidos || apellidos.length < 2) newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres.';
    if (!correo || !/\S+@\S+\.\S+/.test(correo)) newErrors.correo = 'El correo electrónico no es válido.';
    if (!monto || isNaN(monto) || parseFloat(monto) <= 0) newErrors.monto = 'El monto debe ser un número positivo.';
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
      await axios.post('/api/donations', formData);
      setSuccessMessage('Su donación ha sido enviada exitosamente.');
      setFormData({
        nombre: '',
        apellidos: '',
        perteneceCompania: false,
        correo: '',
        monto: ''
      });
    } catch (error) {
      setErrors({ server: error.response ? error.response.data.message : 'Error al enviar el formulario' });
    }
  };

  return (
    <div className="sponsor-form-container">
      {successMessage ? (
        <div className="success-message">
          <h2>{successMessage}</h2>
          <p>¡Gracias por su donación!</p>
          <Link to="/" className="btn-back-home">Volver a la página principal</Link>
        </div>
      ) : (
        <form className="sponsor-form" onSubmit={onSubmit}>
          <h2 className="form-title">Formulario para Patrocinadores/Donadores</h2>

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

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="perteneceCompania"
              checked={perteneceCompania}
              onChange={() => setFormData({ ...formData, perteneceCompania: !perteneceCompania })}
            />
            ¿Pertenece a una compañía?
          </label>

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
            type="number"
            name="monto"
            value={monto}
            onChange={onChange}
            placeholder="Monto de la Donación"
            className="input-field"
            required
          />
          {errors.monto && <p className="error">{errors.monto}</p>}

          {errors.server && <p className="error">{errors.server}</p>}

          <button type="submit" className="btn-submit">Enviar Formulario</button>
        </form>
      )}
    </div>
  );
};

export default SponsorForm;
