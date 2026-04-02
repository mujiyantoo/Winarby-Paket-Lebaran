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
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const healthRoutes = require('./routes/health');
const paketRoutes = require('./routes/paket');
const anggotaRoutes = require('./routes/anggota');
const pembayaranRoutes = require('./routes/pembayaran');
const tabunganBebasRoutes = require('./routes/tabunganBebas');
const dataRoutes = require('./routes/data');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/paket', paketRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/tabungan-bebas', tabunganBebasRoutes);
app.use('/api/data', dataRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;