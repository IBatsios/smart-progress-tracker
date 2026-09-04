// ============================================
// JOB READINESS CALCULATOR SERVICE ⭐
// ============================================
// User ki overall job readiness score calculate karta hai
// Skills, projects, consistency, aur time invested - sab consider karta hai
// Yeh ek composite score hai jo batata hai ki user kitna ready hai

const Task = require('../models/Task');
const SkillAnalyzer = require('./skillAnalyzer');
const ConsistencyTracker = require('./consistencyTracker');
const mongoose = require('mongoose');

class JobReadinessCalculator {

    // ============================================
    // MAIN: CALCULATE JOB READINESS SCORE
    // ============================================
    // Score 0-100 mein hota hai
    // Components:
    //   - Skill Coverage (30%) - Kitni skills cover ki
    //   - Skill Depth (25%) - Har skill mein kitna deep gaye
    //   - Project Work (20%) - Kitne projects kiye
    //   - Consistency (15%) - Kitna regular hai
    //   - Difficulty Level (10%) - Kya hard problems solve kar raha hai

    static async calculateReadiness(userId) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3); // Last 3 months ka data

        // ===== FETCH ALL DATA =====
        const tasks = await Task.find({
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate }
        });

        if (tasks.length === 0) {
            return {
                overallScore: 0,
                breakdown: {
                    skillCoverage: { score: 0, weight: 30, weighted: 0 },
                    skillDepth: { score: 0, weight: 25, weighted: 0 },
                    projectWork: { score: 0, weight: 20, weighted: 0 },
                    consistency: { score: 0, weight: 15, weighted: 0 },
                    difficultyLevel: { score: 0, weight: 10, weighted: 0 }
                },
                level: 'Beginner',
                recommendations: ['Start logging your daily tasks to track progress!']
            };
        }

        // ===== 1. SKILL COVERAGE (30%) =====
        // Kitni unique skills practice ki hai
        const uniqueSkills = [...new Set(tasks.map(t => t.skill.toLowerCase()))];
        const skillCount = uniqueSkills.length;
        
        // Scoring: 1 skill = 10, 3 skills = 40, 5+ skills = 70, 7+ = 90, 10+ = 100
        let skillCoverageScore;
        if (skillCount >= 10) skillCoverageScore = 100;
        else if (skillCount >= 7) skillCoverageScore = 90;
        else if (skillCount >= 5) skillCoverageScore = 70;
        else if (skillCount >= 3) skillCoverageScore = 40;
        else skillCoverageScore = skillCount * 10;

        // ===== 2. SKILL DEPTH (25%) =====
        // Har skill mein kitna time invest kiya
        const skillAnalysis = await SkillAnalyzer.getSkillAnalysis(
            userId, startDate, endDate
        );
        
        // Skills with 10+ hours = deep, 5-10 = moderate, <5 = shallow
        const deepSkills = skillAnalysis.skills.filter(s => s.totalTimeHours >= 10).length;
        const moderateSkills = skillAnalysis.skills.filter(
            s => s.totalTimeHours >= 5 && s.totalTimeHours < 10
        ).length;
        
        const skillDepthScore = Math.min(
            (deepSkills * 25) + (moderateSkills * 10), 
            100
        );

        // ===== 3. PROJECT WORK (20%) =====
        // Projects ka count aur completion
        const projectTasks = tasks.filter(t => t.category === 'project');
        const completedProjects = projectTasks.filter(t => t.completion === 100).length;
        const projectHours = projectTasks.reduce((sum, t) => sum + t.actualTime, 0) / 60;
        
        // Scoring: projects done + hours invested
        let projectScore;
        if (completedProjects >= 5 && projectHours >= 30) projectScore = 100;
        else if (completedProjects >= 3 && projectHours >= 15) projectScore = 70;
        else if (completedProjects >= 1 && projectHours >= 5) projectScore = 40;
        else projectScore = Math.min(projectHours * 2, 30);

        // ===== 4. CONSISTENCY (15%) =====
        const consistencyData = await ConsistencyTracker.getConsistencyData(userId, 30);
        const consistencyScore = Math.min(consistencyData.consistencyPercentage, 100);

        // ===== 5. DIFFICULTY LEVEL (10%) =====
        // Kya user hard problems solve kar raha hai?
        const hardTasks = tasks.filter(t => t.difficulty === 'hard');
        const mediumTasks = tasks.filter(t => t.difficulty === 'medium');
        const totalCompletedTasks = tasks.filter(t => t.completion === 100).length;
        
        const hardCompletedPercentage = totalCompletedTasks > 0
            ? ((hardTasks.filter(t => t.completion === 100).length / totalCompletedTasks) * 100)
            : 0;
        
        let difficultyScore;
        if (hardCompletedPercentage >= 30) difficultyScore = 100;
        else if (hardCompletedPercentage >= 20) difficultyScore = 80;
        else if (hardCompletedPercentage >= 10) difficultyScore = 50;
        else difficultyScore = hardCompletedPercentage * 3;

        // ===== CALCULATE OVERALL SCORE =====
        const breakdown = {
            skillCoverage: {
                score: Math.round(skillCoverageScore),
                weight: 30,
                weighted: parseFloat(((skillCoverageScore * 30) / 100).toFixed(1)),
                detail: `${skillCount} skills covered`
            },
            skillDepth: {
                score: Math.round(skillDepthScore),
                weight: 25,
                weighted: parseFloat(((skillDepthScore * 25) / 100).toFixed(1)),
                detail: `${deepSkills} deep skills, ${moderateSkills} moderate`
            },
            projectWork: {
                score: Math.round(projectScore),
                weight: 20,
                weighted: parseFloat(((projectScore * 20) / 100).toFixed(1)),
                detail: `${completedProjects} projects, ${projectHours.toFixed(1)}hrs`
            },
            consistency: {
                score: Math.round(consistencyScore),
                weight: 15,
                weighted: parseFloat(((consistencyScore * 15) / 100).toFixed(1)),
                detail: `${consistencyData.consistencyPercentage}% consistent`
            },
            difficultyLevel: {
                score: Math.round(difficultyScore),
                weight: 10,
                weighted: parseFloat(((difficultyScore * 10) / 100).toFixed(1)),
                detail: `${hardCompletedPercentage.toFixed(0)}% hard problems`
            }
        };

        const overallScore = Math.round(
            breakdown.skillCoverage.weighted +
            breakdown.skillDepth.weighted +
            breakdown.projectWork.weighted +
            breakdown.consistency.weighted +
            breakdown.difficultyLevel.weighted
        );

        // ===== DETERMINE LEVEL =====
        let level, levelEmoji;
        if (overallScore >= 85) { level = 'Job Ready 🎯'; levelEmoji = '🎯'; }
        else if (overallScore >= 70) { level = 'Almost Ready 🔥'; levelEmoji = '🔥'; }
        else if (overallScore >= 50) { level = 'Intermediate 💪'; levelEmoji = '💪'; }
        else if (overallScore >= 30) { level = 'Beginner+ 📚'; levelEmoji = '📚'; }
        else { level = 'Getting Started 🌱'; levelEmoji = '🌱'; }

        // ===== GENERATE RECOMMENDATIONS =====
        const recommendations = this.generateRecommendations(breakdown);

        return {
            overallScore,
            level,
            levelEmoji,
            breakdown,
            recommendations,
            // Extra stats
            stats: {
                totalTasks: tasks.length,
                totalHours: parseFloat((tasks.reduce((s, t) => s + t.actualTime, 0) / 60).toFixed(1)),
                uniqueSkills: skillCount,
                currentStreak: consistencyData.streaks.currentStreak
            }
        };
    }

    // ============================================
    // GENERATE RECOMMENDATIONS
    // ============================================
    static generateRecommendations(breakdown) {
        const recommendations = [];

        // Find weakest area
        const areas = Object.entries(breakdown)
            .map(([key, val]) => ({ area: key, score: val.score }))
            .sort((a, b) => a.score - b.score);

        const weakest = areas[0];

        // Area-specific recommendations
        if (breakdown.skillCoverage.score < 50) {
            recommendations.push(
                '📌 Explore more skills - diversify your learning'
            );
        }
        if (breakdown.skillDepth.score < 50) {
            recommendations.push(
                '📌 Go deeper in existing skills - aim for 10+ hours per skill'
            );
        }
        if (breakdown.projectWork.score < 50) {
            recommendations.push(
                '📌 Start building projects - they\'re the best proof of skills'
            );
        }
        if (breakdown.consistency.score < 50) {
            recommendations.push(
                '📌 Improve consistency - try to study at least 5 days/week'
            );
        }
        if (breakdown.difficultyLevel.score < 50) {
            recommendations.push(
                '📌 Challenge yourself with harder problems'
            );
        }

        // General tips
        if (recommendations.length === 0) {
            recommendations.push('🎉 Great job! Keep maintaining your current pace.');
        }

        return recommendations;
    }
}

module.exports = JobReadinessCalculator;