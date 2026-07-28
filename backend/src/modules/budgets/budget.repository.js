const BaseRepository = require('../../common/BaseRepository');
const Budget = require('./budget.model');

class BudgetRepository extends BaseRepository {
  constructor() {
    super(Budget);
  }

  findAllSorted() {
    return this.model.find().sort({ category: 1 });
  }

  findByCategory(category) {
    return this.model.findOne({ category });
  }
}

module.exports = new BudgetRepository();
