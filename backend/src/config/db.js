const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  await mongoose.connect(env.mongoUri);
  console.log('📦 Connected to MongoDB');
};

module.exports = connectDB;
