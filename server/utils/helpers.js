// ============================================
// SERVER UTILITY HELPERS
// ============================================

// Get start and end of day for a given date
const getDayBoundaries = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
};

// Get Monday of the week for a given date
const getWeekMonday = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Get week end date (Sunday) from start date
const getWeekSunday = (mondayDate) => {
    const sunday = new Date(mondayDate);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
};

// Calculate percentage safely (avoid division by zero)
const safePercentage = (actual, expected, maxCap = 100) => {
    if (!expected || expected === 0) return 0;
    const percentage = (actual / expected) * 100;
    return Math.min(parseFloat(percentage.toFixed(1)), maxCap);
};

// Round to N decimal places
const roundTo = (num, decimals = 2) => {
    return parseFloat(num.toFixed(decimals));
};

module.exports = {
    getDayBoundaries,
    getWeekMonday,
    getWeekSunday,
    safePercentage,
    roundTo
};