const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  share: {
    type: Number,
    required: true,
    min: 0
  },
  settled: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const splitExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [1, 'Total amount must be positive']
  },
  category: {
    type: String,
    default: 'Shared',
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: {
    type: [participantSchema],
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'A split requires at least one participant'
    }
  },
  status: {
    type: String,
    enum: ['Open', 'Settled'],
    default: 'Open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SplitExpense', splitExpenseSchema);
