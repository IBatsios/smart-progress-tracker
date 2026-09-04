// ============================================
// WEEKLY GOAL MODEL
// ============================================

const mongoose = require('mongoose');

const WeeklyGoalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Week start date (Monday)
    weekStartDate: {
        type: Date,
        required: true
    },

    // Week end date (Sunday)
    weekEndDate: {
        type: Date,
        required: true
    },

    // Skill-wise planned distribution
    // Example: [{ skill: "React", plannedHours: 10, plannedTasks: 5 }]
    skillGoals: [{
        skill: {
            type: String,
            required: true,
            trim: true
        },

        plannedHours: {
            type: Number,
            required: true,
            min: 0
        },

        plannedTasks: {
            type: Number,
            default: 0,
            min: 0
        },
        // Allocation percentage (e.g., React: 40%)
        allocationPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    }],

    // Total planned hours for the week
    totalPlannedHours: {
        type: Number,
        required: true,
        min: [1, 'Minimum 1 hour per week']
    },

    // Total planned tasks
    totalPlannedTasks: {
        type: Number,
        default: 0
    },

    // Expected total score (calculated based on planned hours and assumed difficulty)
    expectedScore: {
        type: Number,
        default: 0
    },

    // Weekly main focus area
    weeklyFocus: {
        type: String,
        trim: true,
        default: ''
    },

    // Notes for the week
    notes: {
        type: String,
        maxlength: 500,
        default: ''
    }
}, {
    timestamps: true
});

// Compound index 
WeeklyGoalSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

// Calculate expected score before saving
WeeklyGoalSchema.pre('save', function(next) {
    // Expected score = total planned hours × average difficulty (medium = 1.5)
    this.expectedScore = parseFloat((this.totalPlannedHours * 1.5).toFixed(2));
    next();
});

module.exports = mongoose.model('WeeklyGoal', WeeklyGoalSchema);