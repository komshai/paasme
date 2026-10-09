const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get User Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        email,
        phone,
        address,
        profileImage,
      },
      { new: true }
    ).select('-password -otp');

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords required' });
    }

    const user = await User.findById(req.userId).select('+password');

    const isValid = await user.comparePassword(oldPassword);
    if (!isValid) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Reviews (For Providers)
router.get('/:userId/reviews', async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const reviews = await Booking.find({
      providerId: req.params.userId,
      isRated: true,
    }).select('rating review customerId createdAt').populate('customerId', 'firstName lastName profileImage');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
