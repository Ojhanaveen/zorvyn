// Generic CRUD wrapper around a Mongoose model, extended by feature repositories
// so query logic lives in one place (SRP) and can grow (OCP) without touching services.
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id) {
    return this.model.findById(id);
  }

  findOne(filter) {
    return this.model.findOne(filter);
  }

  find(filter = {}, options = {}) {
    let query = this.model.find(filter);
    if (options.sort) query = query.sort(options.sort);
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    if (options.limit) query = query.limit(options.limit);
    return query;
  }

  updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }
}

module.exports = BaseRepository;
