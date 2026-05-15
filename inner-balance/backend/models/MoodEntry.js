const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['Terrible', 'Low', 'Okay', 'Good', 'Excellent']
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);