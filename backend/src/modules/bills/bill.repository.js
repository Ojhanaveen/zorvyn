const BaseRepository = require('../../common/BaseRepository');
const Bill = require('./bill.model');

class BillRepository extends BaseRepository {
  constructor() {
    super(Bill);
  }

  findAllSorted() {
    return this.model.find().sort({ nextDueDate: 1 });
  }

  findUpcoming(withinDays) {
    const until = new Date();
    until.setDate(until.getDate() + withinDays);
    return this.model
      .find({ nextDueDate: { $lte: until }, status: { $nin: ['Completed'] } })
      .sort({ nextDueDate: 1 });
  }
}

module.exports = new BillRepository();
