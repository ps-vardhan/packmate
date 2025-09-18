const express = require('express');
const router = express.Router();

// Import route modules
// const userRoutes = require('./users');
// const authRoutes = require('./auth');

// Use routes
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'API Routes' });
});

module.exports = router;