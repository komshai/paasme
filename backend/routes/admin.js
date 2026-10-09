const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Dashboard Stats
router.get('/dashboard', adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ userType: 'provider' });
    const totalCustomers = await User.countDocuments({ userType: 'customer' });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const totalServices = await Service.countDocuments();

    const result = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalProviders,
      totalCustomers,
      totalBookings,
      completedBookings,
      totalServices,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Users
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const { userType, search } = req.query;
    let query = {};

    if (userType) {
      query.userType = userType;
    }

    if (search) {
      query.firstName = { $regex: search, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password -otp')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve Provider
router.patch('/approve-provider/:providerId', adminMiddleware, async (req, res) => {
  try {
    const provider = await User.findByIdAndUpdate(
      req.params.providerId,
      { 'provider.isApproved': true },
      { new: true }
    );

    res.json({
      message: 'Provider approved',
      provider: provider.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Bookings
router.get('/bookings', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'firstName lastName phone')
      .populate('providerId', 'firstName lastName phone')
      .populate('serviceId', 'name category basePrice')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Platform Analytics
router.get('/analytics', adminMiddleware, async (req, res) => {
  try {
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const bookingsByCategory = await Booking.aggregate([
      { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $group: { _id: '$service.category', count: { $sum: 1 } } },
    ]);

    const topProviders = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$providerId', totalBookings: { $sum: 1 }, totalEarnings: { $sum: '$amount' } } },
      { $sort: { totalBookings: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'provider' } },
    ]);

    res.json({
      bookingsByStatus,
      bookingsByCategory,
      topProviders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deactivate User
router.patch('/users/:userId/deactivate', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    );

    res.json({
      message: 'User deactivated',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
