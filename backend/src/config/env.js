require('dotenv').config();

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  // Phase 2 seam: AI insights (Gemini). Not used yet, wired in when a key is supplied.
  geminiApiKey: process.env.GEMINI_API_KEY || null
};
