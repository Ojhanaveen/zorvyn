const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

connectDB()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
