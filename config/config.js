require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/tryoutgo',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
};