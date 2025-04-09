// src/components/AdminNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = ({ logout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Página de inicio</Link></li>
        <li><Link to="/admin/caregivers">Cuidadores Entrantes</Link></li>
        <li><Link to="/admin/caregivers/approved">Lista de Cuidadores</Link></li>
        <li><Link to="/admin/beneficiaries">Lista de Beneficiarios</Link></li>
        <li><Link to="/admin/donations">Lista de Donadores</Link></li>
        <li><Link to="/admin/inactivas">Cuentas Inactivas</Link></li>
        <li><Link to="/revision-feedback">Revisiones Solicitadas</Link></li>
        <li><Link to="/admin/reports">Reportes</Link></li>
        <li><Link to="/profile">Mi Perfil</Link></li>
        <li><button onClick={logout}>Cerrar sesión</button></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
