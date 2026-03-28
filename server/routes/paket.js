const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Paket = require('../models/Paket');

// Validation rules for creating/updating paket
const paketValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
];

// GET all paket
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    let filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    const pakets = await Paket.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: pakets.length,
      data: pakets
    });
  } catch (error) {
    console.error('Get pakets error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching pakets' 
    });
  }
});

// GET single paket by ID
router.get('/:id', async (req, res) => {
  try {
    const paket = await Paket.findById(req.params.id);
    
    if (!paket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Paket not found' 
      });
    }
    
    res.json({
      success: true,
      data: paket
    });
  } catch (error) {
    console.error('Get paket by ID error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid paket ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching paket' 
    });
  }
});

// CREATE new paket (protected)
router.post('/', authMiddleware, paketValidationRules, async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { name, description, price, duration, features, isActive } = req.body;
    
    // Check if paket with same name already exists
    const existingPaket = await Paket.findOne({ name });
    if (existingPaket) {
      return res.status(400).json({ 
        success: false, 
        message: 'Paket with this name already exists' 
      });
    }
    
    // Create new paket
    const paket = new Paket({
      name,
      description,
      price,
      duration,
      features: features || [],
      isActive: isActive !== undefined ? isActive : true
    });
    
    await paket.save();
    
    res.status(201).json({
      success: true,
      message: 'Paket created successfully',
      data: paket
    });
  } catch (error) {
    console.error('Create paket error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating paket' 
    });
  }
});

// UPDATE paket (protected)
router.put('/:id', authMiddleware, paketValidationRules, async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { name, description, price, duration, features, isActive } = req.body;
    
    // Check if paket exists
    let paket = await Paket.findById(req.params.id);
    if (!paket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Paket not found' 
      });
    }
    
    // Check if name is being changed and if new name already exists
    if (name && name !== paket.name) {
      const existingPaket = await Paket.findOne({ name });
      if (existingPaket) {
        return res.status(400).json({ 
          success: false, 
          message: 'Paket with this name already exists' 
        });
      }
    }
    
    // Update paket
    paket.name = name || paket.name;
    paket.description = description || paket.description;
    paket.price = price !== undefined ? price : paket.price;
    paket.duration = duration !== undefined ? duration : paket.duration;
    paket.features = features || paket.features;
    paket.isActive = isActive !== undefined ? isActive : paket.isActive;
    
    await paket.save();
    
    res.json({
      success: true,
      message: 'Paket updated successfully',
      data: paket
    });
  } catch (error) {
    console.error('Update paket error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid paket ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating paket' 
    });
  }
});

// DELETE paket (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const paket = await Paket.findById(req.params.id);
    
    if (!paket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Paket not found' 
      });
    }
    
    await paket.deleteOne();
    
    res.json({
      success: true,
      message: 'Paket deleted successfully'
    });
  } catch (error) {
    console.error('Delete paket error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid paket ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting paket' 
    });
  }
});

module.exports = router;