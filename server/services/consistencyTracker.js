// ============================================
// CONSISTENCY TRACKER SERVICE
// ============================================
// User ki consistency track karta hai
// Streaks, breaks, recovery patterns analyze karta hai
// Consistent learning = better results

const Task = require('../models/Task');
const mongoose = require('mongoose');

class ConsistencyTracker {

    // ============================================
    // GET CONSISTENCY DATA
    // ============================================
    static async getConsistencyData(userId, days = 30) {
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        // Last N days ka daily activity data fetch karo
        const dailyActivity = await Task.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$date' }
                    },
                    totalTime: { $sum: '$actualTime' },
                    taskCount: { $sum: 1 },
                    totalScore: { $sum: '$taskScore' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Active dates set banao for quick lookup
        const activeDatesSet = new Set(dailyActivity.map(d => d._id));

        // ===== DATE ARRAY GENERATE KARO =====
        const allDates = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0];
            const dayData = dailyActivity.find(d => d._id === dateStr);
            
            allDates.push({
                date: dateStr,
                dayName: current.toLocaleDateString('en', { weekday: 'short' }),
                isActive: activeDatesSet.has(dateStr),
                timeSpent: dayData ? dayData.totalTime : 0,
                taskCount: dayData ? dayData.taskCount : 0,
                score: dayData ? parseFloat(dayData.totalScore.toFixed(2)) : 0
            });
            
            current.setDate(current.getDate() + 1);
        }

        // ===== STREAK CALCULATION =====
        const streakData = this.calculateStreaks(allDates);

        // ===== CONSISTENCY PERCENTAGE =====
        const activeDays = allDates.filter(d => d.isActive).length;
        const totalDays = allDates.length;
        const consistencyPercentage = parseFloat(
            ((activeDays / totalDays) * 100).toFixed(1)
        );

        // ===== BEST & WORST PERIODS =====
        const weeklyConsistency = this.calculateWeeklyConsistency(allDates);

        return {
            period: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                totalDays,
                activeDays
            },
            consistencyPercentage,
            streaks: streakData,
            dailyActivity: allDates,
            weeklyConsistency,
            insights: this.generateConsistencyInsights(
                consistencyPercentage, 
                streakData, 
                allDates
            )
        };
    }

    // ============================================
    // CALCULATE STREAKS
    // ============================================
    static calculateStreaks(allDates) {
        let currentStreak = 0;
        let longestStreak = 0;
        let totalBreaks = 0;
        let breakLengths = [];
        let currentBreak = 0;

        // Current streak - aaj se peeche count karo
        for (let i = allDates.length - 1; i >= 0; i--) {
            if (allDates[i].isActive) {
                currentStreak++;
            } else {
                break;  // Pehle inactive day pe ruk jaao
            }
        }

        // Longest streak - puri history mein sabse lamba streak
        let tempStreak = 0;
        for (let i = 0; i < allDates.length; i++) {
            if (allDates[i].isActive) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
                
                // Agar break tha toh record karo
                if (currentBreak > 0) {
                    breakLengths.push(currentBreak);
                    totalBreaks++;
                    currentBreak = 0;
                }
            } else {
                tempStreak = 0;
                currentBreak++;
            }
        }

        // Average break length
        const avgBreakLength = breakLengths.length > 0
            ? parseFloat((breakLengths.reduce((a, b) => a + b, 0) / breakLengths.length).toFixed(1))
            : 0;

        return {
            currentStreak,
            longestStreak,
            totalBreaks,
            avgBreakLength,
            // Streak status message
            streakStatus: currentStreak >= 7 ? '🔥 On Fire!' :
                         currentStreak >= 3 ? '💪 Good Going!' :
                         currentStreak >= 1 ? '✅ Active' :
                         '⚠️ Streak Broken'
        };
    }

    // ============================================
    // WEEKLY CONSISTENCY BREAKDOWN
    // ============================================
    static calculateWeeklyConsistency(allDates) {
        const weeks = [];
        
        for (let i = 0; i < allDates.length; i += 7) {
            const weekDays = allDates.slice(i, i + 7);
            const activeDays = weekDays.filter(d => d.isActive).length;
            const weekScore = weekDays.reduce((sum, d) => sum + d.score, 0);
            
            weeks.push({
                weekNumber: Math.ceil((i + 1) / 7),
                startDate: weekDays[0]?.date,
                endDate: weekDays[weekDays.length - 1]?.date,
                activeDays,
                totalDays: weekDays.length,
                consistency: parseFloat(((activeDays / weekDays.length) * 100).toFixed(1)),
                totalScore: parseFloat(weekScore.toFixed(2))
            });
        }

        return weeks;
    }

    // ============================================
    // GENERATE CONSISTENCY INSIGHTS
    // ============================================
    static generateConsistencyInsights(percentage, streaks, allDates) {
        const insights = [];

        // Overall consistency insight
        if (percentage >= 80) {
            insights.push({
                type: 'positive',
                icon: '🏆',
                message: `Excellent! ${percentage}% consistency - you're very dedicated!`
            });
        } else if (percentage >= 60) {
            insights.push({
                type: 'neutral',
                icon: '👍',
                message: `Good consistency at ${percentage}%. Try to push for 80%+!`
            });
        } else {
            insights.push({
                type: 'warning',
                icon: '⚠️',
                message: `Consistency is ${percentage}%. Regular practice is key to improvement.`
            });
        }

        // Streak insight
        if (streaks.currentStreak >= 7) {
            insights.push({
                type: 'positive',
                icon: '🔥',
                message: `Amazing ${streaks.currentStreak}-day streak! Keep it going!`
            });
        } else if (streaks.currentStreak === 0) {
            insights.push({
                type: 'warning',
                icon: '🔄',
                message: 'Your streak is broken. Start fresh today!'
            });
        }

        // Most productive day
        const bestDay = allDates.reduce((best, current) => 
            current.score > best.score ? current : best
        , allDates[0]);

        if (bestDay && bestDay.score > 0) {
            insights.push({
                type: 'info',
                icon: '⭐',
                message: `Your most productive day was ${bestDay.date} with score ${bestDay.score}`
            });
        }

        return insights;
    }
}

module.exports = ConsistencyTracker;