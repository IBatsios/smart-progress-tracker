// ============================================
// PLANNER CONTROLLER
// ============================================
// Weekly goals management

const WeeklyGoal = require('../models/WeeklyGoal');

// ============================================
// @route   POST /api/planner/weekly-goal
// @desc    Create weekly goal
// @access  Private
// ============================================
exports.createWeeklyGoal = async (req, res, next) => {
    try {
        const {
            weekStartDate,
            skillGoals,
            totalPlannedHours,
            totalPlannedTasks,
            weeklyFocus,
            notes
        } = req.body;

        // Calculate week end date (6 days after start)
        const startDate = new Date(weekStartDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        // Check if goal already exists for this week
        const existingGoal = await WeeklyGoal.findOne({
            userId: req.user.id,
            weekStartDate: {
                $gte: startDate,
                $lte: endDate
            }
        });

        if (existingGoal) {
            return res.status(400).json({
                success: false,
                message: 'Weekly goal already exists for this week. Update instead.'
            });
        }

        const goal = await WeeklyGoal.create({
            userId: req.user.id,
            weekStartDate: startDate,
            weekEndDate: endDate,
            skillGoals,
            totalPlannedHours,
            totalPlannedTasks: totalPlannedTasks || 0,
            weeklyFocus: weeklyFocus || '',
            notes: notes || ''
        });

        res.status(201).json({
            success: true,
            message: 'Weekly goal created! 🎯',
            data: { goal }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/planner/weekly-goal
// @desc    Get current week's goal
// @access  Private
// ============================================
exports.getWeeklyGoal = async (req, res, next) => {
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

        const startDate = new Date(weekStart);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        const goal = await WeeklyGoal.findOne({
            userId: req.user.id,
            weekStartDate: { $gte: startDate, $lte: endDate }
        });

        res.status(200).json({
            success: true,
            data: { goal }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   PUT /api/planner/weekly-goal/:id
// @desc    Update weekly goal
// @access  Private
// ============================================
exports.updateWeeklyGoal = async (req, res, next) => {
    try {
        const goal = await WeeklyGoal.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Weekly goal not found'
            });
        }

        const updates = ['skillGoals', 'totalPlannedHours', 'totalPlannedTasks', 'weeklyFocus', 'notes'];
        updates.forEach(field => {
            if (req.body[field] !== undefined) {
                goal[field] = req.body[field];
            }
        });

        await goal.save();

        res.status(200).json({
            success: true,
            message: 'Weekly goal updated! ✅',
            data: { goal }
        });

    } catch (error) {
        next(error);
    }
};