const Transaction = require('../models/Transaction');

// @desc    Get all transactions (Filters: date, category, type)
// @route   GET /api/transactions
// @access  Private (Viewer, Analyst, Admin)
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type, search } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (type) query.type = type;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { category: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Strict Role Gate: Viewers cannot see full logs
    if (req.user.role === 'Viewer') {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Viewers are only authorized to see the Dashboard Overview.' 
      });
    }

    const transactions = await Transaction.find(query)
      .populate('createdBy', 'name email role')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private (Analyst, Admin)
const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private (Admin)
const updateTransaction = async (req, res) => {
  try {
    // 1. Strict Role Gate: Only Admin can update
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Analysts and Viewers cannot edit records.' });
    }

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Update only allowed fields
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private (Admin)
const deleteTransaction = async (req, res) => {
  try {
    // 1. Strict Role Gate: Only Admin can delete
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Only Administrators can remove records.' });
    }

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Transaction removed'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard summary stats
// @route   GET /api/transactions/summary
// @access  Private (Analyst, Admin)
const getDashboardSummary = async (req, res) => {
  try {
    // 1. Basic Stats (Income, Expense, Balance)
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const formattedStats = {
      income: 0,
      expense: 0,
      balance: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'Income') formattedStats.income = stat.total;
      if (stat._id === 'Expense') formattedStats.expense = stat.total;
    });

    formattedStats.balance = formattedStats.income - formattedStats.expense;

    // 2. Category Breakdown
    const categoryStats = await Transaction.aggregate([
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id.type',
          category: '$_id.category',
          total: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    // 3. Monthly Trends (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Transaction.aggregate([
      {
        $match: { date: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 4. Recent activity
    const recentActivity = await Transaction.find()
      .populate('createdBy', 'name')
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        summary: formattedStats,
        categoryBreakdown: categoryStats,
        monthlyTrends,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary
};
