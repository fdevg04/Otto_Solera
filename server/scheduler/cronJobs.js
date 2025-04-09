const cron = require('node-cron');
const Caregiver = require('../models/Caregiver');
const Beneficiary = require('../models/Beneficiary');

// Ejecutar la tarea todos los días a la medianoche
cron.schedule('0 0 * * *', async () => {
  const seisMesesAtras = new Date();
  seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

  try {
    // Encontrar cuidadores inactivos
    const inactivosCuidadores = await Caregiver.updateMany(
      { ultimoLogin: { $lt: seisMesesAtras }, actividad: 'activo' },
      { actividad: 'inactivo' }
    );

    // Encontrar beneficiarios inactivos
    const inactivosBeneficiarios = await Beneficiary.updateMany(
      { ultimoLogin: { $lt: seisMesesAtras }, actividad: 'activo' },
      { actividad: 'inactivo' }
    );

    console.log(`Cuidadores inactivos encontrados: ${inactivosCuidadores.nModified}`);
    console.log(`Beneficiarios inactivos encontrados: ${inactivosBeneficiarios.nModified}`);
  } catch (err) {
    console.error('Error al actualizar cuentas inactivas:', err);
  }
});
