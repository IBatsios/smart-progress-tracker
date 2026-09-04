const express = require('express');
const router = express.Router();
const {
    createWeeklyGoal,
    getWeeklyGoal,
    updateWeeklyGoal
} = require('../controllers/plannerController');
const protect = require('../middleware/auth');
const { validateWeeklyGoal } = require('../middleware/validation');

router.use(protect);

router.route('/weekly-goal')
    .get(getWeeklyGoal)
    .post(validateWeeklyGoal, createWeeklyGoal);

router.put('/weekly-goal/:id', updateWeeklyGoal);

module.exports = router;