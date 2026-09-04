// ============================================
// PROGRESS ENGINE - SYSTEM KA HEART ❤️
// ============================================
// Yeh file WEIGHTED PROGRESS CALCULATION handle karti hai
// Raw task data se meaningful progress percentage nikalta hai
// Simple task completion nahi - ACTUAL learning progress measure karta hai

const Task = require('../models/Task');
const WeeklyGoal = require('../models/WeeklyGoal');

// Difficulty multipliers - Hard tasks zyada valuable hain
const DIFFICULTY_MULTIPLIER = {
    'easy': 1.0,
    'medium': 1.5,
    'hard': 2.5
};

// Category bonus - Projects ko extra weightage
const CATEGORY_BONUS = {
    'learning': 1.0,
    'practice': 1.1,
    'project': 1.3,     // Projects zyada valuable hain
    'revision': 0.9,
    'other': 0.8
};

class ProgressEngine {

    // ============================================
    // CALCULATE SINGLE TASK SCORE
    // ============================================
    // Formula: (actualTime/60) × difficultyMultiplier × (completion/100) × categoryBonus
    static calculateTaskScore(task) {
        const timeInHours = task.actualTime / 60;
        const diffMultiplier = DIFFICULTY_MULTIPLIER[task.difficulty] || 1;
        const completionFactor = task.completion / 100;
        const catBonus = CATEGORY_BONUS[task.category] || 1;

        const score = timeInHours * diffMultiplier * completionFactor * catBonus;
        return parseFloat(score.toFixed(2));
    }

    // ============================================
    // CALCULATE DAILY PROGRESS
    // ============================================
    // Ek din ki saari tasks ka combined progress
    static async calculateDailyProgress(userId, date) {
        // Date ke start aur end nikalo
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Us din ki saari tasks fetch karo
        const tasks = await Task.find({
            userId: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (tasks.length === 0) {
            return {
                date: date,
                totalTasks: 0,
                completedTasks: 0,
                totalPlannedTime: 0,
                totalActualTime: 0,
                totalScore: 0,
                dailyProgressPercentage: 0,
                isActive: false
            };
        }

        // Aggregate calculations
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completion === 100).length;
        const totalPlannedTime = tasks.reduce((sum, t) => sum + t.plannedTime, 0);
        const totalActualTime = tasks.reduce((sum, t) => sum + t.actualTime, 0);
        const totalScore = tasks.reduce((sum, t) => sum + t.taskScore, 0);

        // Daily expected score:
        // Planned hours × average difficulty (1.5 for medium)
        const expectedScore = (totalPlannedTime / 60) * 1.5;
        
        // Progress % = (actual score / expected score) × 100
        const dailyProgressPercentage = expectedScore > 0
            ? Math.min(parseFloat(((totalScore / expectedScore) * 100).toFixed(1)), 150)
            : 0;
        // Max 150% cap - agar extra kaam kiya toh bonus but limit hai

        return {
            date: date,
            totalTasks,
            completedTasks,
            totalPlannedTime,    // minutes
            totalActualTime,     // minutes
            totalScore: parseFloat(totalScore.toFixed(2)),
            dailyProgressPercentage,
            isActive: totalActualTime > 0
        };
    }

    // ============================================
    // CALCULATE WEEKLY PROGRESS ⭐
    // ============================================
    // Yeh main progress metric hai
    // Week ki saari tasks ka weighted progress calculate karta hai
    static async calculateWeeklyProgress(userId, weekStartDate) {
        // Week dates calculate karo
        const startDate = new Date(weekStartDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);

        // Week ki saari tasks fetch karo
        const tasks = await Task.find({
            userId: userId,
            date: { $gte: startDate, $lte: endDate }
        });

        // Weekly goal fetch karo (agar set hai)
        const weeklyGoal = await WeeklyGoal.findOne({
            userId: userId,
            weekStartDate: { $gte: startDate, $lte: endDate }
        });

        // ===== BASIC METRICS =====
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completion === 100).length;
        const totalPlannedTime = tasks.reduce((sum, t) => sum + t.plannedTime, 0);
        const totalActualTime = tasks.reduce((sum, t) => sum + t.actualTime, 0);
        const totalScore = tasks.reduce((sum, t) => sum + t.taskScore, 0);

        // ===== EXPECTED SCORE =====
        // Agar weekly goal set hai toh usse use karo, nahi toh tasks se calculate
        let expectedScore;
        if (weeklyGoal) {
            expectedScore = weeklyGoal.expectedScore;
        } else {
            // Default: planned time × medium difficulty
            expectedScore = (totalPlannedTime / 60) * 1.5;
        }

        // ===== WEEKLY PROGRESS PERCENTAGE =====
        // Core Formula: (Total Actual Score / Expected Score) × 100
        const weeklyProgress = expectedScore > 0
            ? Math.min(parseFloat(((totalScore / expectedScore) * 100).toFixed(1)), 150)
            : 0;

        // ===== DAILY BREAKDOWN =====
        // Har din ka individual progress nikalo
        const dailyBreakdown = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);
            
            const dayTasks = tasks.filter(t => {
                const taskDate = new Date(t.date);
                return taskDate.toDateString() === currentDate.toDateString();
            });

            const dayScore = dayTasks.reduce((sum, t) => sum + t.taskScore, 0);
            const dayTime = dayTasks.reduce((sum, t) => sum + t.actualTime, 0);

            dailyBreakdown.push({
                date: currentDate.toISOString().split('T')[0],
                dayName: currentDate.toLocaleDateString('en', { weekday: 'short' }),
                taskCount: dayTasks.length,
                timeSpent: dayTime,
                score: parseFloat(dayScore.toFixed(2)),
                isActive: dayTime > 0
            });
        }

        // ===== ACTIVE DAYS =====
        const activeDays = dailyBreakdown.filter(d => d.isActive).length;

        return {
            weekStartDate: startDate,
            weekEndDate: endDate,
            totalTasks,
            completedTasks,
            totalPlannedTime,
            totalActualTime,
            totalScore: parseFloat(totalScore.toFixed(2)),
            expectedScore: parseFloat(expectedScore.toFixed(2)),
            weeklyProgress,
            activeDays,
            consistencyPercentage: parseFloat(((activeDays / 7) * 100).toFixed(1)),
            dailyBreakdown,
            // Goal comparison (agar goal set hai)
            goalComparison: weeklyGoal ? {
                planned: weeklyGoal.totalPlannedHours,
                actual: parseFloat((totalActualTime / 60).toFixed(1)),
                gap: parseFloat((weeklyGoal.totalPlannedHours - (totalActualTime / 60)).toFixed(1))
            } : null
        };
    }

    // ============================================
    // GOAL VS ACTUAL ANALYSIS
    // ============================================
    static async getGoalVsActual(userId, weekStartDate) {
        const startDate = new Date(weekStartDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);

        // Weekly goal fetch karo
        const weeklyGoal = await WeeklyGoal.findOne({
            userId: userId,
            weekStartDate: { $gte: startDate, $lte: endDate }
        });

        if (!weeklyGoal) {
            return {
                hasGoal: false,
                message: 'No weekly goal set for this week'
            };
        }

        // Actual task data fetch karo
        const tasks = await Task.find({
            userId: userId,
            date: { $gte: startDate, $lte: endDate }
        });

        // Skill-wise comparison
        const skillComparison = weeklyGoal.skillGoals.map(goal => {
            // Is skill ke actual tasks filter karo
            const skillTasks = tasks.filter(t => 
                t.skill.toLowerCase() === goal.skill.toLowerCase()
            );

            const actualHours = parseFloat(
                (skillTasks.reduce((sum, t) => sum + t.actualTime, 0) / 60).toFixed(1)
            );
            const actualTasks = skillTasks.length;
            const actualScore = parseFloat(
                skillTasks.reduce((sum, t) => sum + t.taskScore, 0).toFixed(2)
            );

            return {
                skill: goal.skill,
                planned: {
                    hours: goal.plannedHours,
                    tasks: goal.plannedTasks,
                    allocation: goal.allocationPercentage
                },
                actual: {
                    hours: actualHours,
                    tasks: actualTasks,
                    score: actualScore
                },
                gap: {
                    hours: parseFloat((goal.plannedHours - actualHours).toFixed(1)),
                    tasks: goal.plannedTasks - actualTasks,
                    percentage: goal.plannedHours > 0
                        ? parseFloat(((actualHours / goal.plannedHours) * 100).toFixed(1))
                        : 0
                },
                status: actualHours >= goal.plannedHours ? 'achieved' : 
                        actualHours >= goal.plannedHours * 0.7 ? 'close' : 'behind'
            };
        });

        // Overall comparison
        const totalActualHours = parseFloat(
            (tasks.reduce((sum, t) => sum + t.actualTime, 0) / 60).toFixed(1)
        );

        return {
            hasGoal: true,
            overall: {
                plannedHours: weeklyGoal.totalPlannedHours,
                actualHours: totalActualHours,
                gapHours: parseFloat((weeklyGoal.totalPlannedHours - totalActualHours).toFixed(1)),
                achievementPercentage: parseFloat(
                    ((totalActualHours / weeklyGoal.totalPlannedHours) * 100).toFixed(1)
                )
            },
            skillComparison
        };
    }
}

module.exports = ProgressEngine;