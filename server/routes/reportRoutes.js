// server/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const Caregiver = require('../models/Caregiver');
const Beneficiary = require('../models/Beneficiary');
const Donation = require('../models/Donation');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para proteger la ruta
const { Parser } = require('json2csv');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Ruta para obtener estadísticas generales
router.get('/statistics', authMiddleware, async (req, res) => {
  try {
    const caregiversCount = await Caregiver.countDocuments();
    const beneficiariesCount = await Beneficiary.countDocuments();
    const donationsCount = await Donation.countDocuments();

    res.json({
      caregiversCount,
      beneficiariesCount,
      donationsCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para exportar información en CSV
router.get('/export/csv', authMiddleware, async (req, res) => {
    try {
      const caregivers = await Caregiver.find();
      const beneficiaries = await Beneficiary.find();
      const donations = await Donation.find();
  
      // Definir los campos para cada colección
      const caregiverFields = ['nombre', 'apellidos', 'correo', 'telefono', 'residencia', 'especialidades', 'experiencia'];
      const beneficiaryFields = ['nombre', 'apellidos', 'correo', 'telefono', 'residencia', 'edad', 'necesidades'];
      const donationFields = ['nombre', 'apellidos', 'perteneceCompania', 'createdAt'];
  
      // Crear CSV para cuidadores
      const caregiversCsv = new Parser({ fields: caregiverFields }).parse(caregivers);
  
      // Crear CSV para beneficiarios
      const beneficiariesCsv = new Parser({ fields: beneficiaryFields }).parse(beneficiaries);
  
      // Crear CSV para donaciones
      const donationsCsv = new Parser({ fields: donationFields }).parse(donations);
  
      // Añadir títulos antes de cada conjunto de información
      const finalCsv = 'Cuidadores Registrados\n' + caregiversCsv + '\n\n' +
                       'Beneficiarios Registrados\n' + beneficiariesCsv + '\n\n' +
                       'Donaciones Registradas\n' + donationsCsv;
  
      res.header('Content-Type', 'text/csv');
      res.attachment('datos_exportados.csv');
      res.send(finalCsv); // Exportar todo en un solo archivo CSV con títulos
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});


// Ruta para exportar información en PDF
router.get('/export/pdf', authMiddleware, async (req, res) => {
    try {
      const caregivers = await Caregiver.find();
      const beneficiaries = await Beneficiary.find();
      const donations = await Donation.find();
  
      const doc = new PDFDocument();
      res.setHeader('Content-Disposition', 'attachment; filename=datos_exportados.pdf');
      res.setHeader('Content-Type', 'application/pdf');
  
      // Añadir cuidadores al PDF
      doc.fontSize(18).text('Cuidadores Registrados', { underline: true });
      caregivers.forEach((caregiver) => {
        doc
          .fontSize(12)
          .text(
            `Nombre: ${caregiver.nombre} ${caregiver.apellidos} | Correo: ${caregiver.correo} | Teléfono: ${caregiver.telefono} | Residencia: ${caregiver.residencia} | Especialidades: ${caregiver.especialidades} | Experiencia: ${caregiver.experiencia}`
          );
      });
  
      // Añadir beneficiarios al PDF
      doc.addPage();
      doc.fontSize(18).text('Beneficiarios Registrados', { underline: true });
      beneficiaries.forEach((beneficiary) => {
        doc
          .fontSize(12)
          .text(
            `Nombre: ${beneficiary.nombre} ${beneficiary.apellidos} | Correo: ${beneficiary.correo} | Teléfono: ${beneficiary.telefono} | Residencia: ${beneficiary.residencia} | Necesidades: ${beneficiary.necesidades}`
          );
      });
  
      // Añadir donaciones al PDF
      doc.addPage();
      doc.fontSize(18).text('Donaciones Registradas', { underline: true });
      donations.forEach((donation) => {
        doc
          .fontSize(12)
          .text(
            `Nombre: ${donation.nombre} ${donation.apellidos} | Pertenece a Compañía: ${donation.perteneceCompania ? 'Sí' : 'No'} | Creado en: ${new Date(donation.createdAt).toLocaleDateString()}`
          );
      });
  
      doc.pipe(res); // Enviar el PDF como respuesta
      doc.end(); // Terminar el documento
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});

router.get('/donation-history', async (req, res) => {
    const { startDate, endDate, minAmount, maxAmount, nombre } = req.query;
  
    try {
      const query = {};
  
      // Filtrar por fecha
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }
  
      // Filtrar por donante (nombre o apellidos)
      if (nombre) {
        query.$or = [
          { nombre: new RegExp(nombre, 'i') },
          { apellidos: new RegExp(nombre, 'i') }
        ];
      }
  
      // Filtrar por monto (si el modelo de donaciones tiene el campo "monto")
      if (minAmount || maxAmount) {
        query.monto = {};
        if (minAmount) query.monto.$gte = parseFloat(minAmount);
        if (maxAmount) query.monto.$lte = parseFloat(maxAmount);
      }
  
      // Obtener donaciones filtradas
      const donations = await Donation.find(query).sort({ createdAt: -1 });
      res.json(donations);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});

// Ruta para generar reporte de actividad mensual
router.get('/export/monthly-report', async (req, res) => {
    try {
      // Obtener el rango de fechas para el último mes
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
      // Obtener cuidadores activos en el último mes
      const activeCaregivers = await Caregiver.find({
        updatedAt: { $gte: oneMonthAgo }
      }).countDocuments();
  
      // Obtener beneficiarios atendidos en el último mes
      const attendedBeneficiaries = await Beneficiary.find({
        updatedAt: { $gte: oneMonthAgo }
      }).countDocuments();
  
      // Obtener monto total de donaciones en el último mes
      const donations = await Donation.find({
        createdAt: { $gte: oneMonthAgo }
      }).countDocuments();
  
      // Generar el CSV
      const data = [
        {
          Metrica: 'Cuidadores Activos',
          Valor: activeCaregivers
        },
        {
          Metrica: 'Beneficiarios Activos',
          Valor: attendedBeneficiaries
        },
        {
          Metrica: 'Donaciones Recibidas',
          Valor: donations
        }
      ];
  
      const fields = ['Metrica', 'Valor'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(data);
  
      // Enviar el archivo CSV
      res.header('Content-Type', 'text/csv');
      res.attachment('reporte_mensual.csv');
      res.send(csv);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
