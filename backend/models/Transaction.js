const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: [true, 'Type (Income/Expense) is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Flagged'],
    default: 'Completed'
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
