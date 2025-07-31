const express = require('express');
const router = express.Router();

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/health'
    }
  });
});

module.exports = router;