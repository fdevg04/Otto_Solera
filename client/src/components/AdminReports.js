// src/components/AdminReports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/AdminReports.css"; 

const AdminReports = () => {
  const [statistics, setStatistics] = useState({
    caregiversCount: 0,
    beneficiariesCount: 0,
    donationsCount: 0,
  });

  const [donations, setDonations] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    nombre: '',
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await axios.get('/api/reports/statistics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Enviar token en el header
          },
        });
        setStatistics(res.data);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    };

    fetchStatistics();
  }, []);

  const exportCSV = async () => {
    try {
      const response = await fetch('/api/reports/export/csv', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error al exportar CSV:', error);
    }
  };

  const exportPDF = async () => {
    try {
      const response = await fetch('/api/reports/export/pdf', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    }
  };

  // Nueva función para exportar el reporte mensual
  const exportMonthlyReport = async () => {
    try {
      const response = await fetch('/api/reports/export/monthly-report', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte_mensual.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error al exportar el reporte mensual:', error);
    }
  };

  // Función para obtener el historial de donaciones con filtros
  const fetchDonations = async () => {
    try {
      const res = await axios.get('/api/reports/donation-history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: filters, // Enviar filtros como parámetros de consulta
      });
      setDonations(res.data); // Guardar las donaciones filtradas
    } catch (error) {
      console.error('Error al obtener donaciones:', error);
    }
  };

  // Manejar los cambios en el formulario de filtros
  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar el formulario de filtros
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDonations(); // Aplicar los filtros
  };

  return (
    <div className="reports-container">
      <h2 className="title">Reportes Generales</h2>
  
      <div className="statistics-section">
        <p>Total de Cuidadores Registrados: <strong>{statistics.caregiversCount}</strong></p>
        <p>Total de Beneficiarios Registrados: <strong>{statistics.beneficiariesCount}</strong></p>
        <p>Total de Donaciones Realizadas: <strong>{statistics.donationsCount}</strong></p>
      </div>
  
      <h3>Exportar Datos</h3>
      <div className="export-buttons">
        <button className="btn btn-export" onClick={exportCSV}>Exportar en CSV</button>
        <button className="btn btn-export" onClick={exportPDF}>Exportar en PDF</button>
      </div>
  
      <h3>Reporte de Actividad Mensual</h3>
      <button className="btn btn-export" onClick={exportMonthlyReport}>Generar Reporte Mensual (CSV)</button>
  
      <h3>Filtrar Donaciones</h3>
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="form-group">
          <label>Fecha de Inicio:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label>Fecha de Fin:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label>Monto Mínimo:</label>
          <input
            type="number"
            name="minAmount"
            value={filters.minAmount}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label>Monto Máximo:</label>
          <input
            type="number"
            name="maxAmount"
            value={filters.maxAmount}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label>Donante (Nombre o Apellidos):</label>
          <input
            type="text"
            name="nombre"
            value={filters.nombre}
            onChange={handleInputChange}
          />
        </div>
  
        <button type="submit" className="btn btn-filter">Aplicar Filtros</button>
      </form>
  
      <h3>Historial de Donaciones</h3>
      <table className="donations-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Pertenece a Compañía</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation._id}>
              <td>{donation.nombre}</td>
              <td>{donation.apellidos}</td>
              <td>{donation.correo}</td>
              <td>{donation.perteneceCompania ? 'Sí' : 'No'}</td>
              <td>₡{donation.monto}</td>
              <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReports;
