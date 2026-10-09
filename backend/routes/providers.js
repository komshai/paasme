const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { authMiddleware, providerMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get All Providers (For Customers)
router.get('/', async (req, res) => {
  try {
    const { category, city, search } = req.query;
    let query = {
      userType: 'provider',
      isActive: true,
      'provider.isApproved': true,
    };

    if (category) {
      query['provider.category'] = category;
    }

    if (city) {
      query['address.city'] = city;
    }

    if (search) {
      query['provider.businessName'] = { $regex: search, $options: 'i' };
    }

    const providers = await User.find(query)
      .select('firstName lastName phone provider address profileImage')
      .sort({ 'provider.ratings': -1 });

    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Provider Details
router.get('/:providerId', async (req, res) => {
  try {
    const provider = await User.findById(req.params.providerId).select('-password -otp');

    if (!provider || provider.userType !== 'provider') {
      return res.status(404).json({ error: 'Provider not found' });
    }

    // Get provider's total bookings
    const totalBookings = await Booking.countDocuments({ providerId: req.params.providerId });
    const completedBookings = await Booking.countDocuments({
      providerId: req.params.providerId,
      status: 'completed',
    });

    res.json({
      ...provider.toJSON(),
      totalBookings,
      completedBookings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Provider Profile
router.patch('/profile', providerMiddleware, async (req, res) => {
  try {
    const { businessName, category, description, address } = req.body;

    const provider = await User.findByIdAndUpdate(
      req.userId,
      {
        'provider.businessName': businessName,
        'provider.category': category,
        'provider.description': description,
        address,
      },
      { new: true }
    );

    res.json({
      message: 'Profile updated',
      provider: provider.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Provider Dashboard Stats
router.get('/dashboard/stats', providerMiddleware, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ providerId: req.userId });
    const completedBookings = await Booking.countDocuments({
      providerId: req.userId,
      status: 'completed',
    });
    const pendingBookings = await Booking.countDocuments({
      providerId: req.userId,
      status: 'pending',
    });

    const result = await Booking.aggregate([
      { $match: { providerId: req.userId, status: 'completed' } },
      { $group: { _id: null, totalEarnings: { $sum: '$amount' } } },
    ]);

    const totalEarnings = result[0]?.totalEarnings || 0;

    res.json({
      totalBookings,
      completedBookings,
      pendingBookings,
      totalEarnings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
