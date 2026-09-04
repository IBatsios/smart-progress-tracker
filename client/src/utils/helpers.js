// ============================================
// HELPER FUNCTIONS
// ============================================

// Format minutes to human readable string
// 90 -> "1h 30m"
export const formatTime = (minutes) => {
    if (!minutes || minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
};

// Format date to readable string
// 2024-01-15 -> "Jan 15, 2024"
export const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// Get relative date string
// Today, Yesterday, 3 days ago etc.
export const getRelativeDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateStr);
};

// Get current week's Monday date
export const getWeekMonday = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Get week date range string
// "Jan 15 - Jan 21, 2024"
export const getWeekRangeString = (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

// Calculate task score (client-side mirror of backend logic)
export const calculateTaskScore = (actualTime, difficulty, completion) => {
    const multipliers = { easy: 1.0, medium: 1.5, hard: 2.5 };
    const timeInHours = actualTime / 60;
    const multiplier = multipliers[difficulty] || 1;
    const completionFactor = completion / 100;
    return parseFloat((timeInHours * multiplier * completionFactor).toFixed(2));
};

// Get greeting based on time of day
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
};

// Truncate long text
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Get progress color based on percentage
export const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#22c55e'; // green
    if (percentage >= 60) return '#6366f1'; // purple
    if (percentage >= 40) return '#eab308'; // yellow
    return '#ef4444'; // red
};

// Debounce function for search inputs
export const debounce = (func, wait = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};