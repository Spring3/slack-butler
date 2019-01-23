const express = require('express');
const authRoutes = require('./auth.route.js');
const dashboardRoutes = require('./dashboard.route.js');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
