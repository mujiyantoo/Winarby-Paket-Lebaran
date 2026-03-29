const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const healthRoutes = require('./routes/health');
const paketRoutes = require('./routes/paket');
const anggotaRoutes = require('./routes/anggota');
const pembayaranRoutes = require('./routes/pembayaran');
const tabunganBebasRoutes = require('./routes/tabunganBebas');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', profileRoutes);
app.use('/api', healthRoutes);
app.use('/api/paket', paketRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/tabungan-bebas', tabunganBebasRoutes);

// Export app for Vercel
module.exports = app;

// Start server (only if not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}