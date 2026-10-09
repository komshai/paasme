const express = require('express');
const Booking = require('../models/Booking');
const { authMiddleware, providerMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create Booking (Customer)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { serviceId, providerId, bookingDate, timeSlot, location, description, amount } = req.body;

    if (!serviceId || !providerId || !bookingDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = new Booking({
      customerId: req.userId,
      serviceId,
      providerId,
      bookingDate,
      timeSlot,
      location,
      description,
      amount,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await booking.save();
    await booking.populate(['customerId', 'providerId', 'serviceId']);

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Bookings (For Customer)
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.userId })
      .populate('providerId', 'firstName lastName phone provider.businessName provider.ratings')
      .populate('serviceId', 'name category basePrice')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Bookings for Provider
router.get('/provider', providerMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.userId })
      .populate('customerId', 'firstName lastName phone')
      .populate('serviceId', 'name category basePrice')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Booking
router.get('/:bookingId', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('customerId')
      .populate('providerId')
      .populate('serviceId');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Booking Status (Provider)
router.patch('/:bookingId/status', providerMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      {
        status,
        completedAt: status === 'completed' ? new Date() : null,
      },
      { new: true }
    );

    res.json({
      message: 'Booking status updated',
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Rating & Review (Customer)
router.patch('/:bookingId/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      {
        rating,
        review,
        isRated: true,
      },
      { new: true }
    );

    res.json({
      message: 'Rating added successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel Booking
router.patch('/:bookingId/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'pending' && booking.status !== 'accepted') {
      return res.status(400).json({ error: 'Cannot cancel completed/cancelled booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      message: 'Booking cancelled',
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
