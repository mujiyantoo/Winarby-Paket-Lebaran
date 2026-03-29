const mongoose = require('mongoose')

const paketSchema = new mongoose.Schema({
  nama:       { type: String, required: true, trim: true },
  harga:      { type: Number, required: true, min: 0 },
  deskripsi:  { type: String, default: '' },
  items:      [{ type: String, trim: true }],
  stok:       { type: Number, default: 0, min: 0 },
  duration:   { type: Number, default: 90, min: 1 },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Paket', paketSchema)
