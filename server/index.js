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

// Use routes (Universal handling for /api prefix)
const routes = [
  ['/auth', authRoutes],
  ['/auth', profileRoutes],
  ['/paket', paketRoutes],
  ['/anggota', anggotaRoutes],
  ['/pembayaran', pembayaranRoutes],
  ['/tabungan-bebas', tabunganBebasRoutes],
];

routes.forEach(([path, handler]) => {
  app.use(path, handler);          // Match without /api prefix
  app.use('/api' + path, handler); // Match with /api prefix
});

app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// Export app for Vercel
module.exports = app;

// Start server (only if not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}