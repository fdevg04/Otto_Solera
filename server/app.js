// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

require('./scheduler/cronJobs');

// Importar rutas
const adminRoutes = require('./routes/adminRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');  // Importar la ruta
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const donationRoutes = require('./routes/donationRoutes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');
const reportRoutes = require('./routes/reportRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes'); // Importar feedbackRoutes
const hiringRoutes = require('./routes/hiringRoutes'); 
const certificationsRoutes = require('./routes/certificationsRoutes');

dotenv.config();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Rutas básicas (más adelante agregarás las reales)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Usar las rutas
app.use('/api/admins', adminRoutes);
app.use('/api/caregivers', caregiverRoutes); // Usar la ruta de cuidadores
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/auth', authRoutes); // Ruta para autenticación
app.use('/api', profileRoutes); // Ruta para profile
app.use('/api/reports', reportRoutes); // Ruta para reportes
app.use('/api', feedbackRoutes); // Registrar las rutas de feedback
app.use('/api/hiring', hiringRoutes); // Registrar las rutas de hiring
app.use('/api', certificationsRoutes); // Registrar las rutas de certificaciones

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
