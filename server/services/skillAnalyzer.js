// ============================================
// SKILL ANALYZER SERVICE
// ============================================
// Har skill ka deep analysis karta hai
// Strong/weak skills identify karta hai
// Skill distribution aur growth track karta hai

const Task = require('../models/Task');
const mongoose = require('mongoose');

class SkillAnalyzer {

    // ============================================
    // GET COMPLETE SKILL ANALYSIS
    // ============================================
    static async getSkillAnalysis(userId, startDate, endDate) {
        // MongoDB Aggregation Pipeline use karo
        // Yeh powerful hai - group, sum, average sab ek query mein
        const skillData = await Task.aggregate([
            {
                // Stage 1: Filter - sirf is user ke tasks, date range mein
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                // Stage 2: Group by skill name
                $group: {
                    _id: { $toLower: '$skill' },    // Case-insensitive grouping
                    totalTimeMinutes: { $sum: '$actualTime' },
                    totalScore: { $sum: '$taskScore' },
                    taskCount: { $sum: 1 },
                    completedTasks: {
                        $sum: {
                            $cond: [{ $eq: ['$completion', 100] }, 1, 0]
                        }
                    },
                    avgCompletion: { $avg: '$completion' },
                    totalPlannedTime: { $sum: '$plannedTime' },
                    // Difficulty distribution collect karo
                    difficulties: { $push: '$difficulty' },
                    // Scores collect karo for variance calculation
                    scores: { $push: '$taskScore' },
                    // Latest task date
                    lastPracticed: { $max: '$date' }
                }
            },
            {
                // Stage 3: Add calculated fields
                $addFields: {
                    totalTimeHours: { 
                        $round: [{ $divide: ['$totalTimeMinutes', 60] }, 1] 
                    },
                    completionRate: {
                        $round: [
                            { $multiply: [
                                { $divide: ['$completedTasks', '$taskCount'] }, 
                                100 
                            ]},
                            1
                        ]
                    },
                    timeEfficiency: {
                        $cond: [
                            { $gt: ['$totalPlannedTime', 0] },
                            { $round: [
                                { $multiply: [
                                    { $divide: ['$totalTimeMinutes', '$totalPlannedTime'] }, 
                                    100
                                ]},
                                1
                            ]},
                            0
                        ]
                    }
                }
            },
            {
                // Stage 4: Sort by total score (best skills first)
                $sort: { totalScore: -1 }
            }
        ]);

        // ===== CALCULATE STRENGTH LEVEL =====
        // Total score ke basis pe har skill ki strength determine karo
        const maxScore = skillData.length > 0 
            ? Math.max(...skillData.map(s => s.totalScore)) 
            : 0;

        const analyzedSkills = skillData.map(skill => {
            // Relative strength calculate karo
            const relativeScore = maxScore > 0 
                ? (skill.totalScore / maxScore) * 100 
                : 0;

            // Strength level determine karo
            let strength;
            let strengthColor;
            if (relativeScore >= 70 && skill.avgCompletion >= 70) {
                strength = 'strong';
                strengthColor = '#22c55e';    // Green
            } else if (relativeScore >= 40 && skill.avgCompletion >= 50) {
                strength = 'medium';
                strengthColor = '#eab308';    // Yellow
            } else {
                strength = 'weak';
                strengthColor = '#ef4444';    // Red
            }

            // Difficulty distribution count
            const difficultyCount = {
                easy: skill.difficulties.filter(d => d === 'easy').length,
                medium: skill.difficulties.filter(d => d === 'medium').length,
                hard: skill.difficulties.filter(d => d === 'hard').length
            };

            return {
                skill: skill._id,
                totalTimeHours: skill.totalTimeHours,
                totalTimeMinutes: skill.totalTimeMinutes,
                totalScore: parseFloat(skill.totalScore.toFixed(2)),
                taskCount: skill.taskCount,
                completedTasks: skill.completedTasks,
                completionRate: skill.completionRate,
                avgCompletion: parseFloat(skill.avgCompletion.toFixed(1)),
                timeEfficiency: skill.timeEfficiency,
                strength,
                strengthColor,
                relativeScore: parseFloat(relativeScore.toFixed(1)),
                difficultyDistribution: difficultyCount,
                lastPracticed: skill.lastPracticed
            };
        });

        // ===== OVERALL STATISTICS =====
        const totalTime = analyzedSkills.reduce((sum, s) => sum + s.totalTimeMinutes, 0);
        
        // Skill distribution percentage
        const skillDistribution = analyzedSkills.map(skill => ({
            skill: skill.skill,
            percentage: totalTime > 0 
                ? parseFloat(((skill.totalTimeMinutes / totalTime) * 100).toFixed(1))
                : 0,
            hours: skill.totalTimeHours
        }));

        return {
            skills: analyzedSkills,
            skillDistribution,
            summary: {
                totalSkills: analyzedSkills.length,
                strongSkills: analyzedSkills.filter(s => s.strength === 'strong').length,
                mediumSkills: analyzedSkills.filter(s => s.strength === 'medium').length,
                weakSkills: analyzedSkills.filter(s => s.strength === 'weak').length,
                totalTimeHours: parseFloat((totalTime / 60).toFixed(1)),
                mostPracticedSkill: analyzedSkills.length > 0 ? analyzedSkills[0].skill : 'N/A',
                leastPracticedSkill: analyzedSkills.length > 0 
                    ? analyzedSkills[analyzedSkills.length - 1].skill 
                    : 'N/A'
            }
        };
    }

    // ============================================
    // GET SKILL HEATMAP DATA
    // ============================================
    // Heatmap ke liye skill × date matrix generate karo
    static async getSkillHeatmap(userId, startDate, endDate) {
        const tasks = await Task.find({
            userId: new mongoose.Types.ObjectId(userId),
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ date: 1 });

        // Unique skills nikalo
        const skills = [...new Set(tasks.map(t => t.skill.toLowerCase()))];

        // Date range generate karo
        const dates = [];
        const current = new Date(startDate);
        const end = new Date(endDate);
        while (current <= end) {
            dates.push(new Date(current).toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }

        // Heatmap matrix create karo
        // Each cell = { skill, date, intensity }
        const heatmapData = [];

        skills.forEach(skill => {
            dates.forEach(date => {
                const dayTasks = tasks.filter(t => 
                    t.skill.toLowerCase() === skill &&
                    new Date(t.date).toISOString().split('T')[0] === date
                );

                const totalTime = dayTasks.reduce((sum, t) => sum + t.actualTime, 0);
                const totalScore = dayTasks.reduce((sum, t) => sum + t.taskScore, 0);

                // Intensity level (0-4) for heatmap coloring
                let intensity = 0;
                if (totalTime > 0 && totalTime < 30) intensity = 1;      // Light
                else if (totalTime >= 30 && totalTime < 60) intensity = 2;  // Medium
                else if (totalTime >= 60 && totalTime < 120) intensity = 3; // Strong
                else if (totalTime >= 120) intensity = 4;                    // Very Strong

                heatmapData.push({
                    skill,
                    date,
                    timeSpent: totalTime,
                    score: parseFloat(totalScore.toFixed(2)),
                    taskCount: dayTasks.length,
                    intensity
                });
            });
        });

        return {
            skills,
            dates,
            heatmapData,
            // Intensity legend
            legend: [
                { level: 0, label: 'No activity', color: '#1e1e2e' },
                { level: 1, label: '< 30 min', color: '#0e4429' },
                { level: 2, label: '30-60 min', color: '#006d32' },
                { level: 3, label: '1-2 hours', color: '#26a641' },
                { level: 4, label: '2+ hours', color: '#39d353' }
            ]
        };
    }
}

module.exports = SkillAnalyzer;