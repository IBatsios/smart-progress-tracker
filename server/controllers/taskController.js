// ============================================
// TASK CONTROLLER
// ============================================

const Task = require('../models/Task');

// ============================================
// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
// ============================================
exports.createTask = async (req, res, next) => {
    try {
        // userId auth middleware se aata hai
        const taskData = {
            userId: req.user.id,
            title: req.body.title,
            description: req.body.description,
            skill: req.body.skill,
            category: req.body.category || 'learning',
            plannedTime: req.body.plannedTime,
            actualTime: req.body.actualTime || 0,
            difficulty: req.body.difficulty,
            completion: req.body.completion || 0,
            qualityRating: req.body.qualityRating,
            notes: req.body.notes,
            date: new Date(req.body.date)
        };

        // Task create
        const task = await Task.create(taskData);

        res.status(201).json({
            success: true,
            message: 'Task created successfully! 📝',
            data: { task }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/tasks
// @desc    Get all tasks (with filters)
// @access  Private
// ============================================
exports.getTasks = async (req, res, next) => {
    try {
        // Query parameters se filters extract karo
        const {
            date,           // Specific date ke tasks
            startDate,      // Date range start
            endDate,        // Date range end
            skill,          // Skill filter
            difficulty,     // Difficulty filter
            status,         // Status filter
            category,       // Category filter
            page = 1,       // Pagination
            limit = 50      // Items per page
        } = req.query;

        // Base query - sirf logged-in user ke tasks
        const query = { userId: req.user.id };

        // ===== FILTERS APPLY KARO =====
        
        // Specific date
        if (date) {
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            query.date = { $gte: dayStart, $lte: dayEnd };
        }
        
        // Date range
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Skill filter
        if (skill) {
            query.skill = { $regex: new RegExp(skill, 'i') };
        }

        // Difficulty filter
        if (difficulty) {
            query.difficulty = difficulty;
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // ===== EXECUTE QUERY =====
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const tasks = await Task.find(query)
            .sort({ date: -1, createdAt: -1 })   // Newest first
            .skip(skip)
            .limit(parseInt(limit));

        // Total count for pagination
        const totalTasks = await Task.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                tasks,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalTasks / parseInt(limit)),
                    totalTasks,
                    hasMore: skip + tasks.length < totalTasks
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Private
// ============================================
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id       // Security
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { task }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
// ============================================
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Allowed fields update karo
        const allowedUpdates = [
            'title', 'description', 'skill', 'category',
            'plannedTime', 'actualTime', 'difficulty',
            'completion', 'status', 'qualityRating', 'notes', 'date'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                task[field] = field === 'date' ? new Date(req.body[field]) : req.body[field];
            }
        });

        await task.save();

        res.status(200).json({
            success: true,
            message: 'Task updated successfully! ✅',
            data: { task }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
// ============================================
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully! 🗑️',
            data: {}
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/tasks/today
// @desc    Get today's tasks
// @access  Private
// ============================================
exports.getTodayTasks = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tasks = await Task.find({
            userId: req.user.id,
            date: { $gte: today, $lt: tomorrow }
        }).sort({ createdAt: -1 });

        // Today's summary
        const summary = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.completion === 100).length,
            totalPlannedTime: tasks.reduce((sum, t) => sum + t.plannedTime, 0),
            totalActualTime: tasks.reduce((sum, t) => sum + t.actualTime, 0),
            totalScore: parseFloat(tasks.reduce((sum, t) => sum + t.taskScore, 0).toFixed(2))
        };

        res.status(200).json({
            success: true,
            data: { tasks, summary }
        });

    } catch (error) {
        next(error);
    }
};