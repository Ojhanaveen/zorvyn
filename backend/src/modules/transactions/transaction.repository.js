const BaseRepository = require('../../common/BaseRepository');
const Transaction = require('./transaction.model');

class TransactionRepository extends BaseRepository {
  constructor() {
    super(Transaction);
  }

  findWithFilters(query) {
    return this.model.find(query).populate('createdBy', 'name email role').sort({ date: -1 });
  }

  recentActivity(limit = 5) {
    return this.model.find().populate('createdBy', 'name').sort({ date: -1 }).limit(limit);
  }

  totalsByType() {
    return this.model.aggregate([
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
  }

  categoryBreakdown() {
    return this.model.aggregate([
      { $group: { _id: { type: '$type', category: '$category' }, total: { $sum: '$amount' } } },
      { $project: { _id: 0, type: '$_id.type', category: '$_id.category', total: 1 } },
      { $sort: { total: -1 } }
    ]);
  }

  monthlyTrends(since) {
    return this.model.aggregate([
      { $match: { date: { $gte: since } } },
      {
        $group: {
          _id: { month: { $month: '$date' }, year: { $year: '$date' }, type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
  }

  spendByCategorySince(since, type = 'Expense') {
    return this.model.aggregate([
      { $match: { date: { $gte: since }, type } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);
  }
}

module.exports = new TransactionRepository();
