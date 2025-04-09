// server/controllers/donationController.js
const Donation = require('../models/Donation');

// Enviar formulario de donación
exports.createDonation = async (req, res) => {
  const { nombre, apellidos, perteneceCompania, correo } = req.body;

  try {
    const donation = new Donation({
      nombre,
      apellidos,
      perteneceCompania,
      correo
    });

    await donation.save();

    res.status(201).json({ message: 'Formulario de donación enviado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener lista de donaciones (solo administradores)
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una donación (solo administradores)
exports.deleteDonation = async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Donación eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
