const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected Successfully (Serverless)'))
  .catch(err => console.error('MongoDB Connection Error:', err));
}

// Import routes from server folder
const authRoutes = require('../server/routes/auth');
const profileRoutes = require('../server/routes/profile');
const healthRoutes = require('../server/routes/health');
const paketRoutes = require('../server/routes/paket');
const anggotaRoutes = require('../server/routes/anggota');
const pembayaranRoutes = require('../server/routes/pembayaran');
const tabunganBebasRoutes = require('../server/routes/tabunganBebas');
const dataRoutes = require('../server/routes/data');

// Match with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/auth', profileRoutes); // profile is also under /auth in existing app
app.use('/api/paket', paketRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/tabungan-bebas', tabunganBebasRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/health', healthRoutes);

// Match without /api prefix
app.use('/auth', authRoutes);
app.use('/auth', profileRoutes);
app.use('/paket', paketRoutes);
app.use('/anggota', anggotaRoutes);
app.use('/pembayaran', pembayaranRoutes);
app.use('/tabungan-bebas', tabunganBebasRoutes);
app.use('/data', dataRoutes);
app.use('/health', healthRoutes);

// Base route test
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Pilar API (Vercel Serverless)' });
});

// Expert app for Vercel
module.exports = app;
