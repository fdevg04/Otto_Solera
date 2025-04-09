import React from 'react';
import { Link } from 'react-router-dom';

const CaregiverNavbar = ({ logout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Página de inicio</Link></li>
        <li><Link to="/caregiver/solicitudes">Solicitudes de servicio</Link></li>
        <li><Link to="/caregiver/solicitudes-aceptadas">Solicitudes aceptadas</Link></li>
        <li><Link to="/caregiver/historial-servicios">Historial de servicios</Link></li>
        <li><Link to="/solicitar-revision">Evaluaciones recibidas</Link></li>
        <li><Link to="/certificaciones">Mis Certificaciones</Link></li>
        <li><Link to="/lista-beneficiarios">Beneficiarios Atendidos</Link></li>
        <li><Link to="/profile">Mi Perfil</Link></li>
        <li><button onClick={logout}>Cerrar Sesión</button></li>
      </ul>
    </nav>
  );
};

export default CaregiverNavbar;
