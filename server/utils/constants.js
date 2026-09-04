// ============================================
// SERVER-SIDE CONSTANTS
// ============================================
// Backend mein use hone wale saare constant values
// Ek jagah define karo, har jagah use karo

// ============================================
// DIFFICULTY MULTIPLIERS
// ============================================
// Task score calculate karte time difficulty ka weight
// Hard tasks ko zyada credit milega
const DIFFICULTY_MULTIPLIER = {
    easy: 1.0,       // Normal weightage - basic tasks
    medium: 1.5,     // 1.5x - moderate effort tasks
    hard: 2.5        // 2.5x - challenging tasks ko maximum credit
};

// ============================================
// CATEGORY BONUS MULTIPLIERS
// ============================================
// Task category ke basis pe extra bonus
// Projects sabse valuable hain kyunki real experience dete hain
const CATEGORY_BONUS = {
    learning: 1.0,    // Standard - watching tutorials, reading docs
    practice: 1.1,    // Slightly more - hands-on coding practice
    project: 1.3,     // Maximum bonus - real project building
    revision: 0.9,    // Slightly less - revision is important but less new learning
    other: 0.8        // Minimum - miscellaneous tasks
};

// ============================================
// JOB READINESS WEIGHTS
// ============================================
// Job readiness score calculate karne ke components
// Total weight = 100%
const JOB_READINESS_WEIGHTS = {
    skillCoverage: 30,      // Kitni skills cover ki - 30%
    skillDepth: 25,         // Har skill mein kitna deep - 25%
    projectWork: 20,        // Projects kiye ya nahi - 20%
    consistency: 15,        // Regular practice - 15%
    difficultyLevel: 10     // Hard problems solve karna - 10%
};

// ============================================
// SKILL STRENGTH THRESHOLDS
// ============================================
// Skill ko strong/medium/weak categorize karne ke thresholds
const SKILL_STRENGTH = {
    strong: {
        minRelativeScore: 70,     // 70%+ relative score
        minAvgCompletion: 70,     // 70%+ average completion
        color: '#22c55e',         // Green
        label: 'Strong 💪'
    },
    medium: {
        minRelativeScore: 40,     // 40-70% relative score
        minAvgCompletion: 50,     // 50%+ average completion
        color: '#eab308',         // Yellow
        label: 'Medium 🔶'
    },
    weak: {
        minRelativeScore: 0,      // Below 40%
        minAvgCompletion: 0,      // Any completion
        color: '#ef4444',         // Red
        label: 'Weak 🔴'
    }
};

// ============================================
// PROGRESS THRESHOLDS
// ============================================
// Progress percentage ko grade assign karne ke thresholds
const PROGRESS_GRADES = {
    excellent: { min: 80, label: 'Excellent 🏆', color: '#22c55e' },
    good: { min: 60, label: 'Good 👍', color: '#6366f1' },
    average: { min: 40, label: 'Average 📊', color: '#eab308' },
    poor: { min: 20, label: 'Needs Work 📝', color: '#f97316' },
    critical: { min: 0, label: 'Critical ⚠️', color: '#ef4444' }
};

// ============================================
// CONSISTENCY THRESHOLDS
// ============================================
// Streak aur consistency ke levels
const CONSISTENCY_LEVELS = {
    onFire: { minStreak: 7, label: '🔥 On Fire!', minPercentage: 80 },
    goodGoing: { minStreak: 3, label: '💪 Good Going!', minPercentage: 60 },
    active: { minStreak: 1, label: '✅ Active', minPercentage: 30 },
    inactive: { minStreak: 0, label: '⚠️ Streak Broken', minPercentage: 0 }
};

// ============================================
// JOB READINESS LEVELS
// ============================================
// Overall readiness score ke basis pe level
const READINESS_LEVELS = [
    { min: 85, label: 'Job Ready 🎯', emoji: '🎯' },
    { min: 70, label: 'Almost Ready 🔥', emoji: '🔥' },
    { min: 50, label: 'Intermediate 💪', emoji: '💪' },
    { min: 30, label: 'Beginner+ 📚', emoji: '📚' },
    { min: 0, label: 'Getting Started 🌱', emoji: '🌱' }
];

// ============================================
// HEATMAP INTENSITY LEVELS
// ============================================
// Heatmap cell coloring ke liye intensity mapping
const HEATMAP_INTENSITY = [
    { level: 0, maxMinutes: 0, label: 'No activity', color: '#1e1e2e' },
    { level: 1, maxMinutes: 30, label: '< 30 min', color: '#0e4429' },
    { level: 2, maxMinutes: 60, label: '30-60 min', color: '#006d32' },
    { level: 3, maxMinutes: 120, label: '1-2 hours', color: '#26a641' },
    { level: 4, maxMinutes: Infinity, label: '2+ hours', color: '#39d353' }
];

// ============================================
// PAGINATION DEFAULTS
// ============================================
const PAGINATION = {
    defaultPage: 1,
    defaultLimit: 50,
    maxLimit: 100
};

// ============================================
// TIME CONSTANTS
// ============================================
const TIME = {
    minutesPerHour: 60,
    hoursPerDay: 24,
    daysPerWeek: 7,
    maxDailyMinutes: 720,    // 12 hours max per day
    minTaskMinutes: 1         // Minimum 1 minute per task
};

// ============================================
// VALIDATION LIMITS
// ============================================
const VALIDATION = {
    nameMinLength: 2,
    nameMaxLength: 50,
    passwordMinLength: 6,
    titleMaxLength: 200,
    descriptionMaxLength: 1000,
    notesMaxLength: 500,
    minDailyTarget: 1,
    maxDailyTarget: 16,
    minCompletion: 0,
    maxCompletion: 100,
    minQualityRating: 1,
    maxQualityRating: 5
};

// ============================================
// ERROR MESSAGES
// ============================================
const ERROR_MESSAGES = {
    notFound: 'Resource not found',
    unauthorized: 'Not authorized. Please login.',
    tokenExpired: 'Token expired. Please login again.',
    invalidCredentials: 'Invalid email or password',
    duplicateEmail: 'User with this email already exists',
    validationFailed: 'Validation failed. Please check your input.',
    serverError: 'Internal server error. Please try again later.',
    taskNotFound: 'Task not found',
    goalExists: 'Weekly goal already exists for this week'
};

// ============================================
// EXPORT EVERYTHING
// ============================================
module.exports = {
    DIFFICULTY_MULTIPLIER,
    CATEGORY_BONUS,
    JOB_READINESS_WEIGHTS,
    SKILL_STRENGTH,
    PROGRESS_GRADES,
    CONSISTENCY_LEVELS,
    READINESS_LEVELS,
    HEATMAP_INTENSITY,
    PAGINATION,
    TIME,
    VALIDATION,
    ERROR_MESSAGES
};