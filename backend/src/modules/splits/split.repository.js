const BaseRepository = require('../../common/BaseRepository');
const SplitExpense = require('./split.model');

class SplitRepository extends BaseRepository {
  constructor() {
    super(SplitExpense);
  }

  findAllSorted() {
    return this.model
      .find()
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .sort({ date: -1 });
  }

  findForParticipant(userId) {
    return this.model
      .find({ 'participants.user': userId })
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .sort({ date: -1 });
  }
}

module.exports = new SplitRepository();
