const express = require('express');
const router = express.Router();
const {
    getSkillAnalysis,
    getSkillHeatmap,
    getConsistency,
    getJobReadiness,
    getMonthlySummary,
    getWeeklyReview
} = require('../controllers/analyticsController');
const protect = require('../middleware/auth');

router.use(protect);

router.get('/skill-analysis', getSkillAnalysis);
router.get('/skill-heatmap', getSkillHeatmap);
router.get('/consistency', getConsistency);
router.get('/job-readiness', getJobReadiness);
router.get('/monthly-summary', getMonthlySummary);
router.get('/weekly-review', getWeeklyReview);

module.exports = router;