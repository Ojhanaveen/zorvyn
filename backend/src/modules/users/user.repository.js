const BaseRepository = require('../../common/BaseRepository');
const User = require('./user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  findByEmail(email, withPassword = false) {
    const query = this.model.findOne({ email });
    return withPassword ? query.select('+password') : query;
  }

  findAllSafe() {
    return this.model.find().select('-password').sort({ createdAt: -1 });
  }

  findDirectory() {
    return this.model.find({ status: 'Active' }).select('name email role').sort({ name: 1 });
  }
}

module.exports = new UserRepository();
