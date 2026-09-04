// ============================================
// REQUEST VALIDATION MIDDLEWARE
// ============================================

const { body, validationResult } = require('express-validator');

// ============================================
// Validation result check karne wala middleware
// ============================================
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// ============================================
// REGISTER VALIDATION RULES
// ============================================
const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
    handleValidationErrors
];

// ============================================
// LOGIN VALIDATION RULES
// ============================================
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty().withMessage('Password is required'),
    
    handleValidationErrors
];

// ============================================
// TASK VALIDATION RULES
// ============================================
const validateTask = [
    body('title')
        .trim()
        .notEmpty().withMessage('Task title is required')
        .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    
    body('skill')
        .trim()
        .notEmpty().withMessage('Skill tag is required'),
    
    body('plannedTime')
        .notEmpty().withMessage('Planned time is required')
        .isInt({ min: 1, max: 720 }).withMessage('Planned time must be between 1-720 minutes'),
    
    body('actualTime')
        .optional()
        .isInt({ min: 0, max: 720 }).withMessage('Actual time must be between 0-720 minutes'),
    
    body('difficulty')
        .notEmpty().withMessage('Difficulty is required')
        .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
    
    body('completion')
        .optional()
        .isInt({ min: 0, max: 100 }).withMessage('Completion must be between 0-100%'),
    
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Please provide a valid date'),
    
    handleValidationErrors
];

// ============================================
// WEEKLY GOAL VALIDATION RULES
// ============================================
const validateWeeklyGoal = [
    body('weekStartDate')
        .notEmpty().withMessage('Week start date is required')
        .isISO8601().withMessage('Invalid date format'),
    
    body('totalPlannedHours')
        .notEmpty().withMessage('Total planned hours is required')
        .isFloat({ min: 1 }).withMessage('Minimum 1 hour per week'),
    
    body('skillGoals')
        .isArray({ min: 1 }).withMessage('At least one skill goal is required'),
    
    body('skillGoals.*.skill')
        .notEmpty().withMessage('Skill name is required for each goal'),
    
    body('skillGoals.*.plannedHours')
        .isFloat({ min: 0 }).withMessage('Planned hours must be positive'),
    
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateTask,
    validateWeeklyGoal
};