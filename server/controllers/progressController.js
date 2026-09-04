// ============================================
// PROGRESS CONTROLLER
// ============================================

const ProgressEngine = require('../services/progressEngine');

// ============================================
// @route   GET /api/progress/daily
// @desc    Get daily progress
// @access  Private
// ============================================
exports.getDailyProgress = async (req, res, next) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        
        const progress = await ProgressEngine.calculateDailyProgress(
            req.user.id, 
            new Date(date)
        );

        res.status(200).json({
            success: true,
            data: { progress }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/progress/weekly
// @desc    Get weekly progress
// @access  Private
// ============================================
exports.getWeeklyProgress = async (req, res, next) => {
    try {
        // Week start date - default current week ka Monday
        let weekStart = req.query.weekStart;
        
        if (!weekStart) {
            const today = new Date();
            const dayOfWeek = today.getDay();
            // Monday ko 0 index pe laao
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const monday = new Date(today);
            monday.setDate(today.getDate() + diff);
            weekStart = monday.toISOString().split('T')[0];
        }

        const progress = await ProgressEngine.calculateWeeklyProgress(
            req.user.id,
            weekStart
        );

        res.status(200).json({
            success: true,
            data: { progress }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/progress/goal-vs-actual
// @desc    Get goal vs actual comparison
// @access  Private
// ============================================
exports.getGoalVsActual = async (req, res, next) => {
    try {
        let weekStart = req.query.weekStart;
        
        if (!weekStart) {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const monday = new Date(today);
            monday.setDate(today.getDate() + diff);
            weekStart = monday.toISOString().split('T')[0];
        }

        const comparison = await ProgressEngine.getGoalVsActual(
            req.user.id,
            weekStart
        );

        res.status(200).json({
            success: true,
            data: { comparison }
        });

    } catch (error) {
        next(error);
    }
};