const express = require('express');
const Service = require('../models/Service');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get All Services
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query).sort({ isPopular: -1, averageRating: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Service
router.get('/:serviceId', async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Service (Admin)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { name, category, description, basePrice, unit, estimatedDuration } = req.body;

    if (!name || !category || !basePrice) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const service = new Service({
      name,
      category,
      description,
      basePrice,
      unit,
      estimatedDuration,
    });

    await service.save();
    res.status(201).json({
      message: 'Service created',
      service,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Service (Admin)
router.patch('/:serviceId', adminMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.serviceId,
      req.body,
      { new: true }
    );

    res.json({
      message: 'Service updated',
      service,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      'plumbing',
      'electrical',
      'carpentry',
      'cleaning',
      'painting',
      'ac-repair',
      'appliance-repair',
      'beauty',
      'tuition',
      'fitness',
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
