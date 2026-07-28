const BaseRepository = require('../../common/BaseRepository');
const Goal = require('./goal.model');

class GoalRepository extends BaseRepository {
  constructor() {
    super(Goal);
  }

  findAllSorted() {
    return this.model.find().sort({ status: 1, targetDate: 1 });
  }
}

module.exports = new GoalRepository();
