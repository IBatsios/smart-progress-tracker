const express = require('express');
const router = express.Router();
const {
    getDailyProgress,
    getWeeklyProgress,
    getGoalVsActual
} = require('../controllers/progressController');
const protect = require('../middleware/auth');

router.use(protect);

router.get('/daily', getDailyProgress);
router.get('/weekly', getWeeklyProgress);
router.get('/goal-vs-actual', getGoalVsActual);

module.exports = router;