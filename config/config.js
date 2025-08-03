require('dotenv').config();

module.exports = {
 NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  
  // PostgreSQL Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://tryoutgo_user:your_strong_password_here@localhost:5432/tryoutgo_db',
  
};