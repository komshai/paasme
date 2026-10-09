const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
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
        'other',
      ],
    },
    description: String,
    image: String,
    icon: String,
    
    // Pricing
    basePrice: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'per service',
      enum: ['hourly', 'per service', 'fixed', 'per unit'],
    },
    
    // Details
    estimatedDuration: String, // "1-2 hours"
    isPopular: {
      type: Boolean,
      default: false,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
