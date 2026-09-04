// ============================================
// CLIENT-SIDE CALCULATIONS
// ============================================
// Backend logic ka mirror - client side pe bhi
// same calculations kar sakte hain preview ke liye
// Final calculations hamesha backend karega

// ============================================
// DIFFICULTY MULTIPLIERS
// ============================================
const DIFFICULTY_MULTIPLIER = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.5
};

// Category bonus multipliers
const CATEGORY_BONUS = {
    learning: 1.0,
    practice: 1.1,
    project: 1.3,
    revision: 0.9,
    other: 0.8
};

// ============================================
// CALCULATE SINGLE TASK SCORE
// ============================================
// Yeh formula system ka HEART hai
// Task Score = (actualTime/60) × difficultyMultiplier × (completion/100) × categoryBonus
//
// Example:
//   Task: 2 hours, Medium difficulty, 80% complete, Practice
//   Score = (120/60) × 1.5 × (80/100) × 1.1
//   Score = 2 × 1.5 × 0.8 × 1.1 = 2.64
export const calculateTaskScore = (task) => {
    const {
        actualTime = 0,
        difficulty = 'medium',
        completion = 0,
        category = 'learning'
    } = task;

    const timeInHours = actualTime / 60;
    const diffMultiplier = DIFFICULTY_MULTIPLIER[difficulty] || 1;
    const completionFactor = completion / 100;
    const catBonus = CATEGORY_BONUS[category] || 1;

    const score = timeInHours * diffMultiplier * completionFactor * catBonus;
    return parseFloat(score.toFixed(2));
};

// ============================================
// CALCULATE DAILY SCORE FROM TASKS ARRAY
// ============================================
// Ek din ki saari tasks ka total score
export const calculateDailyScore = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const totalScore = tasks.reduce((sum, task) => {
        return sum + (task.taskScore || calculateTaskScore(task));
    }, 0);
    return parseFloat(totalScore.toFixed(2));
};

// ============================================
// CALCULATE DAILY PROGRESS PERCENTAGE
// ============================================
// Daily progress = (actual score / expected score) × 100
// Expected score based on planned time with medium difficulty
export const calculateDailyProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;

    const totalScore = calculateDailyScore(tasks);
    const totalPlannedTime = tasks.reduce((sum, t) => sum + (t.plannedTime || 0), 0);

    // Expected: planned time in hours × medium difficulty (1.5)
    const expectedScore = (totalPlannedTime / 60) * 1.5;

    if (expectedScore === 0) return 0;

    // Cap at 150% - extra work ko credit do but limit lagao
    const progress = Math.min((totalScore / expectedScore) * 100, 150);
    return parseFloat(progress.toFixed(1));
};

// ============================================
// CALCULATE WEEKLY PROGRESS PERCENTAGE
// ============================================
// Weekly ka same logic - 7 days ka combined
export const calculateWeeklyProgress = (weekTasks, expectedScore = null) => {
    if (!weekTasks || weekTasks.length === 0) return 0;

    const totalScore = weekTasks.reduce((sum, t) => {
        return sum + (t.taskScore || calculateTaskScore(t));
    }, 0);

    // Agar expected score provided nahi hai toh calculate karo
    if (!expectedScore) {
        const totalPlannedTime = weekTasks.reduce((sum, t) => 
            sum + (t.plannedTime || 0), 0
        );
        expectedScore = (totalPlannedTime / 60) * 1.5;
    }

    if (expectedScore === 0) return 0;

    const progress = Math.min((totalScore / expectedScore) * 100, 150);
    return parseFloat(progress.toFixed(1));
};

// ============================================
// CALCULATE COMPLETION RATE
// ============================================
// Kitne tasks fully complete hue - percentage mein
export const calculateCompletionRate = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;

    const completedTasks = tasks.filter(t => t.completion === 100).length;
    const rate = (completedTasks / tasks.length) * 100;
    return parseFloat(rate.toFixed(1));
};

// ============================================
// CALCULATE TIME EFFICIENCY
// ============================================
// Actual time vs Planned time comparison
// > 100% means took more time than planned
// < 100% means finished early
export const calculateTimeEfficiency = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;

    const totalPlanned = tasks.reduce((sum, t) => sum + (t.plannedTime || 0), 0);
    const totalActual = tasks.reduce((sum, t) => sum + (t.actualTime || 0), 0);

    if (totalPlanned === 0) return 0;

    const efficiency = (totalActual / totalPlanned) * 100;
    return parseFloat(efficiency.toFixed(1));
};

// ============================================
// CALCULATE SKILL DISTRIBUTION
// ============================================
// Har skill mein kitna percentage time spend hua
export const calculateSkillDistribution = (tasks) => {
    if (!tasks || tasks.length === 0) return [];

    // Skill-wise time aggregate karo
    const skillMap = {};
    let totalTime = 0;

    tasks.forEach(task => {
        const skill = (task.skill || 'unknown').toLowerCase();
        const time = task.actualTime || 0;

        if (!skillMap[skill]) {
            skillMap[skill] = {
                skill: skill,
                totalTime: 0,
                totalScore: 0,
                taskCount: 0,
                completedTasks: 0
            };
        }

        skillMap[skill].totalTime += time;
        skillMap[skill].totalScore += (task.taskScore || calculateTaskScore(task));
        skillMap[skill].taskCount += 1;
        if (task.completion === 100) skillMap[skill].completedTasks += 1;
        totalTime += time;
    });

    // Percentage calculate karo aur array mein convert
    const distribution = Object.values(skillMap).map(skill => ({
        ...skill,
        percentage: totalTime > 0 
            ? parseFloat(((skill.totalTime / totalTime) * 100).toFixed(1)) 
            : 0,
        totalTimeHours: parseFloat((skill.totalTime / 60).toFixed(1)),
        totalScore: parseFloat(skill.totalScore.toFixed(2)),
        completionRate: skill.taskCount > 0 
            ? parseFloat(((skill.completedTasks / skill.taskCount) * 100).toFixed(1))
            : 0
    }));

    // Sort by time spent (highest first)
    return distribution.sort((a, b) => b.totalTime - a.totalTime);
};

// ============================================
// DETERMINE SKILL STRENGTH
// ============================================
// Ek skill strong hai, medium hai ya weak
export const determineSkillStrength = (skill, allSkills) => {
    if (!allSkills || allSkills.length === 0) return 'weak';

    // Sabse zyada score wali skill find karo
    const maxScore = Math.max(...allSkills.map(s => s.totalScore || 0));

    if (maxScore === 0) return 'weak';

    // Relative score calculate karo
    const relativeScore = ((skill.totalScore || 0) / maxScore) * 100;
    const avgCompletion = skill.avgCompletion || skill.completionRate || 0;

    if (relativeScore >= 70 && avgCompletion >= 70) return 'strong';
    if (relativeScore >= 40 && avgCompletion >= 50) return 'medium';
    return 'weak';
};

// ============================================
// CALCULATE STREAK
// ============================================
// Continuous active days count karo
// activeDays = array of { date, isActive } objects (sorted by date)
export const calculateStreak = (dailyActivity) => {
    if (!dailyActivity || dailyActivity.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Current streak - end se count karo
    for (let i = dailyActivity.length - 1; i >= 0; i--) {
        if (dailyActivity[i].isActive) {
            currentStreak++;
        } else {
            break;
        }
    }

    // Longest streak - puri array scan karo
    for (let i = 0; i < dailyActivity.length; i++) {
        if (dailyActivity[i].isActive) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    return { currentStreak, longestStreak };
};

// ============================================
// CALCULATE CONSISTENCY PERCENTAGE
// ============================================
// Active days / Total days × 100
export const calculateConsistency = (activeDays, totalDays) => {
    if (!totalDays || totalDays === 0) return 0;
    const percentage = (activeDays / totalDays) * 100;
    return parseFloat(percentage.toFixed(1));
};

// ============================================
// ESTIMATE JOB READINESS (Client-Side Preview)
// ============================================
// Backend ka simplified version - quick preview ke liye
export const estimateJobReadiness = (tasks, consistencyPercentage = 0) => {
    if (!tasks || tasks.length === 0) return 0;

    // 1. Skill coverage (30%)
    const uniqueSkills = [...new Set(tasks.map(t => (t.skill || '').toLowerCase()))];
    let skillCoverageScore = Math.min(uniqueSkills.length * 12, 100);

    // 2. Time invested (25%)
    const totalHours = tasks.reduce((sum, t) => sum + (t.actualTime || 0), 0) / 60;
    let timeScore = Math.min(totalHours * 2, 100);

    // 3. Project work (20%)
    const projectTasks = tasks.filter(t => t.category === 'project');
    const projectHours = projectTasks.reduce((sum, t) => sum + (t.actualTime || 0), 0) / 60;
    let projectScore = Math.min(projectHours * 5, 100);

    // 4. Consistency (15%)
    let consistencyScore = Math.min(consistencyPercentage, 100);

    // 5. Hard problems (10%)
    const hardCompleted = tasks.filter(t => 
        t.difficulty === 'hard' && t.completion === 100
    ).length;
    let difficultyScore = Math.min(hardCompleted * 10, 100);

    // Weighted total
    const total = (
        (skillCoverageScore * 0.30) +
        (timeScore * 0.25) +
        (projectScore * 0.20) +
        (consistencyScore * 0.15) +
        (difficultyScore * 0.10)
    );

    return Math.round(total);
};

// ============================================
// GET PROGRESS GRADE
// ============================================
// Percentage ke basis pe grade assign karo
export const getProgressGrade = (percentage) => {
    if (percentage >= 80) return { 
        grade: 'A', label: 'Excellent', color: '#22c55e', emoji: '🏆' 
    };
    if (percentage >= 60) return { 
        grade: 'B', label: 'Good', color: '#6366f1', emoji: '👍' 
    };
    if (percentage >= 40) return { 
        grade: 'C', label: 'Average', color: '#eab308', emoji: '📊' 
    };
    if (percentage >= 20) return { 
        grade: 'D', label: 'Needs Work', color: '#f97316', emoji: '📝' 
    };
    return { 
        grade: 'F', label: 'Critical', color: '#ef4444', emoji: '⚠️' 
    };
};

// ============================================
// FORMAT SCORE FOR DISPLAY
// ============================================
export const formatScore = (score) => {
    if (score >= 1000) return `${(score / 1000).toFixed(1)}k`;
    return score.toFixed(1);
};

// ============================================
// COMPARE TWO PERIODS
// ============================================
// Current vs Previous period comparison
export const comparePeriods = (currentScore, previousScore) => {
    if (previousScore === 0 && currentScore === 0) {
        return { change: 0, percentage: 0, trend: 'stable' };
    }

    const change = currentScore - previousScore;
    const percentage = previousScore > 0 
        ? parseFloat(((change / previousScore) * 100).toFixed(1))
        : currentScore > 0 ? 100 : 0;

    const trend = change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable';

    return {
        change: parseFloat(change.toFixed(2)),
        percentage,
        trend
    };
};