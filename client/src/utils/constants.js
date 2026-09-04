// ============================================
// APPLICATION CONSTANTS
// ============================================

// Skill categories commonly used
export const COMMON_SKILLS = [
    'React', 'Node.js', 'JavaScript', 'Python', 'DSA',
    'MongoDB', 'Express.js', 'CSS', 'TypeScript', 'SQL',
    'System Design', 'HTML', 'Git', 'Docker', 'AWS',
    'Redux', 'Next.js', 'GraphQL', 'Java', 'C++'
];

// Task categories
export const TASK_CATEGORIES = [
    { value: 'learning', label: '📚 Learning', color: '#3b82f6' },
    { value: 'practice', label: '💻 Practice', color: '#22c55e' },
    { value: 'project', label: '🏗️ Project', color: '#a78bfa' },
    { value: 'revision', label: '🔄 Revision', color: '#eab308' },
    { value: 'other', label: '📌 Other', color: '#8892b0' }
];

// Difficulty levels with multipliers
export const DIFFICULTY_LEVELS = [
    { value: 'easy', label: '🟢 Easy', multiplier: 1.0, color: '#22c55e' },
    { value: 'medium', label: '🟡 Medium', multiplier: 1.5, color: '#eab308' },
    { value: 'hard', label: '🔴 Hard', multiplier: 2.5, color: '#ef4444' }
];

// Chart colors palette
export const CHART_COLORS = [
    '#6366f1', '#22c55e', '#eab308', '#ef4444',
    '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
    '#14b8a6', '#84cc16'
];

// Progress thresholds
export const PROGRESS_THRESHOLDS = {
    excellent: 80,
    good: 60,
    average: 40,
    poor: 20
};

// Day names
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Month names
export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];