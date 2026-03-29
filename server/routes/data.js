const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Baca data dari file JSON
const readData = (filename) => {
  try {
    const filePath = path.join(__dirname, '..', '..', filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    // File JSON adalah JSON Lines format, setiap baris adalah JSON object
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// GET semua anggota
router.get('/anggota', (req, res) => {
  try {
    const data = readData('anggotas.json');
    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error fetching anggota:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching anggota data'
    });
  }
});

// GET semua paket
router.get('/paket', (req, res) => {
  try {
    const data = readData('pakets.json');
    // Filter hanya data paket, bukan data anggota yang tercampur
    const paketData = data.filter(item => item.harga !== undefined);
    res.json({
      success: true,
      count: paketData.length,
      data: paketData
    });
  } catch (error) {
    console.error('Error fetching paket:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching paket data'
    });
  }
});

// GET semua pembayaran
router.get('/pembayaran', (req, res) => {
  try {
    const data = readData('pembayarans.json');
    // Filter hanya data pembayaran, bukan data anggota yang tercampur
    const pembayaranData = data.filter(item => item.jumlah !== undefined);
    res.json({
      success: true,
      count: pembayaranData.length,
      data: pembayaranData
    });
  } catch (error) {
    console.error('Error fetching pembayaran:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pembayaran data'
    });
  }
});

// GET laporan/statistik
router.get('/laporan', (req, res) => {
  try {
    const anggotaData = readData('anggotas.json');
    const paketData = readData('pakets.json').filter(item => item.harga !== undefined);
    const pembayaranData = readData('pembayarans.json').filter(item => item.jumlah !== undefined);
    
    // Hitung total pembayaran
    const totalPembayaran = pembayaranData.reduce((sum, item) => sum + item.jumlah, 0);
    
    res.json({
      success: true,
      data: {
        totalAnggota: anggotaData.length,
        totalPaket: paketData.length,
        totalPembayaran: totalPembayaran,
        pembayaranTerbaru: pembayaranData.slice(-5).reverse(),
        anggotaAktif: anggotaData.filter(a => a.status === 'aktif').length,
        anggotaNonAktif: anggotaData.filter(a => a.status === 'nonaktif').length
      }
    });
  } catch (error) {
    console.error('Error generating laporan:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating laporan'
    });
  }
});

module.exports = router;