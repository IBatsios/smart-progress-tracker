// ============================================
// ANALYTICS CONTROLLER
// ============================================

const SkillAnalyzer = require('../services/skillAnalyzer');
const ConsistencyTracker = require('../services/consistencyTracker');
const JobReadinessCalculator = require('../services/jobReadinessCalculator');
const Task = require('../models/Task');

// ============================================
// @route   GET /api/analytics/skill-analysis
// @desc    Get skill-wise analysis
// @access  Private
// ============================================
exports.getSkillAnalysis = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const analysis = await SkillAnalyzer.getSkillAnalysis(
            req.user.id, startDate, endDate
        );

        res.status(200).json({
            success: true,
            data: { analysis }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/analytics/skill-heatmap
// @desc    Get skill heatmap data
// @access  Private
// ============================================
exports.getSkillHeatmap = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const heatmap = await SkillAnalyzer.getSkillHeatmap(
            req.user.id, startDate, endDate
        );

        res.status(200).json({
            success: true,
            data: { heatmap }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/analytics/consistency
// @desc    Get consistency tracking data
// @access  Private
// ============================================
exports.getConsistency = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;

        const consistency = await ConsistencyTracker.getConsistencyData(
            req.user.id, days
        );

        res.status(200).json({
            success: true,
            data: { consistency }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/analytics/job-readiness
// @desc    Get job readiness score
// @access  Private
// ============================================
exports.getJobReadiness = async (req, res, next) => {
    try {
        const readiness = await JobReadinessCalculator.calculateReadiness(
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: { readiness }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/analytics/monthly-summary
// @desc    Get monthly summary
// @access  Private
// ============================================
exports.getMonthlySummary = async (req, res, next) => {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth();
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59);

        const tasks = await Task.find({
            userId: req.user.id,
            date: { $gte: startDate, $lte: endDate }
        });

        // Weekly breakdown
        const weeks = [];
        let weekStart = new Date(startDate);
        
        while (weekStart <= endDate) {
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            const weekTasks = tasks.filter(t => {
                const taskDate = new Date(t.date);
                return taskDate >= weekStart && taskDate <= weekEnd;
            });

            const weekScore = weekTasks.reduce((sum, t) => sum + t.taskScore, 0);
            const weekTime = weekTasks.reduce((sum, t) => sum + t.actualTime, 0);

            weeks.push({
                weekStart: weekStart.toISOString().split('T')[0],
                weekEnd: Math.min(weekEnd, endDate) === endDate 
                    ? endDate.toISOString().split('T')[0]
                    : weekEnd.toISOString().split('T')[0],
                taskCount: weekTasks.length,
                completedTasks: weekTasks.filter(t => t.completion === 100).length,
                totalScore: parseFloat(weekScore.toFixed(2)),
                totalTimeHours: parseFloat((weekTime / 60).toFixed(1))
            });

            weekStart = new Date(weekEnd);
            weekStart.setDate(weekStart.getDate() + 1);
        }

        // Find best week
        const bestWeek = weeks.reduce((best, current) => 
            current.totalScore > best.totalScore ? current : best
        , weeks[0] || { totalScore: 0 });

        const summary = {
            month: startDate.toLocaleString('en', { month: 'long', year: 'numeric' }),
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.completion === 100).length,
            totalTimeHours: parseFloat(
                (tasks.reduce((sum, t) => sum + t.actualTime, 0) / 60).toFixed(1)
            ),
            totalScore: parseFloat(
                tasks.reduce((sum, t) => sum + t.taskScore, 0).toFixed(2)
            ),
            avgDailyScore: parseFloat(
                (tasks.reduce((sum, t) => sum + t.taskScore, 0) / 30).toFixed(2)
            ),
            weeklyBreakdown: weeks,
            bestWeek: bestWeek
        };

        res.status(200).json({
            success: true,
            data: { summary }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/analytics/weekly-review
// @desc    Get automated weekly review
// @access  Private
// ============================================
exports.getWeeklyReview = async (req, res, next) => {
    try {
        // Current week dates
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() + diff);
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // This week's tasks
        const tasks = await Task.find({
            userId: req.user.id,
            date: { $gte: weekStart, $lte: weekEnd }
        });

        // Previous week's tasks (for comparison)
        const prevWeekStart = new Date(weekStart);
        prevWeekStart.setDate(prevWeekStart.getDate() - 7);
        const prevWeekEnd = new Date(weekStart);
        prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);

        const prevTasks = await Task.find({
            userId: req.user.id,
            date: { $gte: prevWeekStart, $lte: prevWeekEnd }
        });

        // Current week metrics
        const currentScore = tasks.reduce((sum, t) => sum + t.taskScore, 0);
        const currentTime = tasks.reduce((sum, t) => sum + t.actualTime, 0);
        const currentCompleted = tasks.filter(t => t.completion === 100).length;

        // Previous week metrics
        const prevScore = prevTasks.reduce((sum, t) => sum + t.taskScore, 0);
        const prevTime = prevTasks.reduce((sum, t) => sum + t.actualTime, 0);

        // ===== GENERATE REVIEW =====
        const review = {
            period: {
                start: weekStart.toISOString().split('T')[0],
                end: weekEnd.toISOString().split('T')[0]
            },
            metrics: {
                totalTasks: tasks.length,
                completedTasks: currentCompleted,
                totalScore: parseFloat(currentScore.toFixed(2)),
                totalHours: parseFloat((currentTime / 60).toFixed(1))
            },
            comparison: {
                scoreChange: parseFloat((currentScore - prevScore).toFixed(2)),
                scoreChangePercent: prevScore > 0
                    ? parseFloat((((currentScore - prevScore) / prevScore) * 100).toFixed(1))
                    : 0,
                timeChange: parseFloat(((currentTime - prevTime) / 60).toFixed(1)),
                trend: currentScore > prevScore ? 'improving' : 
                       currentScore === prevScore ? 'stable' : 'declining'
            },
            // What went well
            positives: [],
            // What to improve
            improvements: [],
            // Action items
            actionItems: []
        };

        // Generate positives
        if (currentScore > prevScore) {
            review.positives.push('📈 Score improved compared to last week!');
        }
        if (currentCompleted >= 5) {
            review.positives.push(`✅ Completed ${currentCompleted} tasks this week!`);
        }
        
        // Top skill this week
        const skillScores = {};
        tasks.forEach(t => {
            skillScores[t.skill] = (skillScores[t.skill] || 0) + t.taskScore;
        });
        const topSkill = Object.entries(skillScores)
            .sort((a, b) => b[1] - a[1])[0];
        
        if (topSkill) {
            review.positives.push(`⭐ Best skill this week: ${topSkill[0]}`);
        }

        // Generate improvements
        if (currentScore < prevScore) {
            review.improvements.push('📉 Score decreased - try to increase effort');
        }
        if (tasks.length < 5) {
            review.improvements.push('📝 Log more tasks - aim for at least 5/week');
        }

        // Incomplete tasks check
        const incompleteTasks = tasks.filter(t => t.completion < 100 && t.completion > 0);
        if (incompleteTasks.length > 0) {
            review.improvements.push(
                `⚠️ ${incompleteTasks.length} tasks are partially complete - try to finish them`
            );
        }

        // Action items
        review.actionItems.push('🎯 Set clear goals for next week');
        if (review.comparison.trend === 'declining') {
            review.actionItems.push('💪 Increase daily study time by 30 minutes');
        }

        res.status(200).json({
            success: true,
            data: { review }
        });

    } catch (error) {
        next(error);
    }
};