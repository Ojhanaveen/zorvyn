const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bill name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Rent', 'EMI', 'Subscription', 'Utility', 'Loan', 'Insurance', 'Other'],
    default: 'Other'
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be positive']
  },
  nextDueDate: {
    type: Date,
    required: [true, 'Next due date is required']
  },
  recurrence: {
    type: String,
    enum: ['One-time', 'Weekly', 'Monthly', 'Yearly'],
    default: 'Monthly'
  },
  totalInstallments: {
    type: Number,
    default: null,
    min: 1
  },
  installmentsPaid: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Due', 'Overdue', 'Paid', 'Completed'],
    default: 'Upcoming'
  },
  reminderDaysBefore: {
    type: Number,
    default: 3
  },
  notes: {
    type: String,
    trim: true
  },
  lastPaidDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);
