// src/App.js (React Router v6)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css'; // Importa el archivo CSS
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar'; // Menú de administrador
import HomePage from './components/HomePage';
import CaregiverForm from './components/CaregiverForm';
import BeneficiaryForm from './components/BeneficiaryForm';
import SponsorForm from './components/SponsorForm';
import Login from './components/Login'; // Componente de Login

import AdminCaregiversList from './components/AdminCaregiversList'; // Lista de cuidadores
import AdminDashboard from './components/AdminDashboard';
import AdminDonationsList from './components/AdminDonationsList';
import AdminApprovedCaregiversList from './components/AdminApprovedCaregiversList';
import EditCaregiver from './components/EditCaregiver';
import AdminBeneficiariesList from './components/AdminBeneficiariesList';
import EditBeneficiary from './components/EditBeneficiary';
import AdminRegister from './components/AdminRegister';
import AdminReports from './components/AdminReports';
import InactiveAccounts from './components/InactiveAccounts';

import UserProfile from './components/UserProfile';

import ProtectedRoute from './components/ProtectedRoute'; // Rutas protegidas
import axios from 'axios';

import BeneficiaryNavbar from './components/BeneficiaryNavbar'; // Importar la barra de beneficiario
import CaregiversList from './components/CaregiversList'; // Lista de cuidadores
import CaregiverHirings from './components/CaregiverHirings'; // Contrataciones recibidas
import BeneficiaryAcceptedHirings from './components/BeneficiaryAcceptedHirings'; // Importar el nuevo componente
import ServiceHistory from './components/ServiceHistory'; // Nuevo componente
import RequestReview from './components/RequestReview'; // Nuevo componente
import AdminReviewFeedbacks from './components/AdminReviewFeedbacks'; // Nuevo componente

import CaregiverNavbar from './components/CaregiverNavbar';
import ServiceRequests from './components/ServiceRequests'; // Componente de solicitudes de servicio
import CaregiverAcceptedHirings from './components/CaregiverAcceptedHirings'; // Importar el nuevo componente
import CaregiverServiceHistory from './components/CaregiverServiceHistory'; // Nuevo componente
import CaregiverCertifications from './components/CaregiverCertifications'; // Importa el nuevo componente
import BeneficiariesList from './components/BeneficiariesList'; // Lista de cuidadores

const App = () => {
  // Estado para manejar el token de autenticación
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(''); // Estado para manejar el rol del usuario

  // Función para cerrar sesión
  const logout = () => {
    setAuthToken(null);
    setUserRole('');
    localStorage.removeItem('token');
  };

  // Establecer el token en el encabezado para todas las solicitudes de Axios
  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      // Obtener el rol del usuario para mostrar el navbar correcto
      axios.get('/api/auth/user-role').then((res) => {
        setUserRole(res.data.role);
      });
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authToken]);

  return (
    <Router>
      <div>
        {/* Mostrar el navbar regular o el de administrador dependiendo del estado de autenticación */}
        {/*authToken ? <AdminNavbar logout={logout} /> : <Navbar />*/}

        {userRole === 'admin' ? (
          <AdminNavbar logout={logout} />
        ) : userRole === 'beneficiary' ? (
          <BeneficiaryNavbar logout={logout} />
        ) : userRole === 'caregiver' ? (
          <CaregiverNavbar logout={logout} />
        ) : (
          <Navbar />
        )}

        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/inscripcion-cuidadores" element={<CaregiverForm />} />
          <Route path="/inscripcion-beneficiarios" element={<BeneficiaryForm />} />
          <Route path="/formulario-donadores" element={<SponsorForm />} />

          {/* Ruta de inicio de sesión */}
          <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />

          {/* Ruta para registrar un administrador */}
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Rutas protegidas para el administrador */}
          <Route
            path="/admin/caregivers"
            element={
              <ProtectedRoute authToken={authToken}>
                <AdminCaregiversList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute authToken={authToken}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute authToken={authToken}>
                <AdminDonationsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/caregivers/approved"
            element={
              <ProtectedRoute authToken={authToken}>
                <AdminApprovedCaregiversList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/caregivers/edit/:id"
            element={
              <ProtectedRoute authToken={authToken}>
                <EditCaregiver />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/beneficiaries"
            element={
              <ProtectedRoute authToken={authToken}>
                <AdminBeneficiariesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/beneficiaries/edit/:id"
            element={
              <ProtectedRoute authToken={authToken}>
                <EditBeneficiary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute authToken={authToken}>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute authToken={authToken}>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/inactivas"
            element={
              <ProtectedRoute authToken={authToken}>
                <InactiveAccounts />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para beneficiarios */}
          <Route
            path="/contactar-cuidador"
            element={
              <ProtectedRoute authToken={authToken}>
                <CaregiversList />
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida para ver contrataciones recibidas */}
          <Route
            path="/caregiver/contrataciones"
            element={
              <ProtectedRoute authToken={authToken}>
                <CaregiverHirings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/beneficiario/solicitudes-aceptadas"
            element={
              <ProtectedRoute authToken={authToken}>
                <BeneficiaryAcceptedHirings />
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida para el historial de servicios */}
          <Route
            path="/historial-servicios"
            element={
              <ProtectedRoute authToken={authToken}>
                <ServiceHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitar-revision"
            element={
              <ProtectedRoute authToken={authToken}>
                <RequestReview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/revision-feedback"
            element={
              <ProtectedRoute authToken={authToken}>
                <AdminReviewFeedbacks />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para el cuidador */}
          <Route
            path="/caregiver/solicitudes"
            element={
              <ProtectedRoute authToken={authToken}>
                <ServiceRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/caregiver/solicitudes-aceptadas"
            element={
              <ProtectedRoute authToken={authToken}>
                <CaregiverAcceptedHirings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/caregiver/historial-servicios"
            element={
              <ProtectedRoute authToken={authToken}>
                <CaregiverServiceHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/certificaciones"
            element={
              <ProtectedRoute authToken={authToken}>
                <CaregiverCertifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lista-beneficiarios"
            element={
              <ProtectedRoute authToken={authToken}>
                <BeneficiariesList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
