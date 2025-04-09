// src/components/BeneficiaryNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const BeneficiaryNavbar = ({ logout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Página de Inicio</Link></li>
        <li><Link to="/contactar-cuidador">Contactar con un Cuidador</Link></li>
        <li><Link to="/beneficiario/solicitudes-aceptadas">Solicitudes aceptadas</Link></li>
        <li><Link to="/historial-servicios">Historial de Servicios</Link></li>
        <li><Link to="/solicitar-revision">Evaluaciones recibidas</Link></li>
        <li><Link to="/profile">Mi Perfil</Link></li>
        <li><button onClick={logout}>Cerrar Sesión</button></li>
      </ul>
    </nav>
  );
};

export default BeneficiaryNavbar;
