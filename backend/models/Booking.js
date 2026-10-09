const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceName: String,
    description: String,
    
    // Booking Details
    bookingDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      start: String, // "10:00 AM"
      end: String,   // "11:00 AM"
    },
    
    // Location
    location: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      latitude: Number,
      longitude: Number,
    },
    
    // Amount
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    
    // Payment
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'online', 'card'],
    },
    paymentId: String,
    
    // Rating & Review
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
    isRated: {
      type: Boolean,
      default: false,
    },
    
    // Notes
    customerNotes: String,
    providerNotes: String,
    
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

// Generate unique booking ID
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const count = await this.constructor.countDocuments();
    this.bookingId = `BK${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
