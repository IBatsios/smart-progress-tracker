// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

import React, { useState, useEffect } from 'react';
import StatCard from '../Common/StatCard';
import ProgressBar from './ProgressBar';
import WeeklyChart from './WeeklyChart';
import SkillDistributionChart from './SkillDistributionChart';
import ConsistencyTracker from './ConsistencyTracker';
import JobReadinessScore from './JobReadinessScore';
import WeeklyReview from './WeeklyReview';
import LoadingSpinner from '../Common/LoadingSpinner';
import progressService from '../../services/progressService';
import taskService from '../../services/taskService';

const DashboardMain = () => {
    const [loading, setLoading] = useState(true);
    const [weeklyProgress, setWeeklyProgress] = useState(null);
    const [todayData, setTodayData] = useState(null);
    const [skillAnalysis, setSkillAnalysis] = useState(null);
    const [consistency, setConsistency] = useState(null);
    const [jobReadiness, setJobReadiness] = useState(null);
    const [weeklyReview, setWeeklyReview] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Parallel API calls for better performance
            const [
                weeklyRes,
                todayRes,
                skillRes,
                consistencyRes,
                readinessRes,
                reviewRes
            ] = await Promise.allSettled([
                progressService.getWeeklyProgress(),
                taskService.getTodayTasks(),
                progressService.getSkillAnalysis(30),
                progressService.getConsistency(30),
                progressService.getJobReadiness(),
                progressService.getWeeklyReview()
            ]);

            if (weeklyRes.status === 'fulfilled') setWeeklyProgress(weeklyRes.value.data.progress);
            if (todayRes.status === 'fulfilled') setTodayData(todayRes.value.data);
            if (skillRes.status === 'fulfilled') setSkillAnalysis(skillRes.value.data.analysis);
            if (consistencyRes.status === 'fulfilled') setConsistency(consistencyRes.value.data.consistency);
            if (readinessRes.status === 'fulfilled') setJobReadiness(readinessRes.value.data.readiness);
            if (reviewRes.status === 'fulfilled') setWeeklyReview(reviewRes.value.data.review);

        } catch (error) {
            console.error('Dashboard data fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="large" text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ===== TOP STAT CARDS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Weekly Progress"
                    value={`${weeklyProgress?.weeklyProgress || 0}%`}
                    subtitle="Weighted score based"
                    icon="📊"
                    color="primary"
                    trend={weeklyProgress?.weeklyProgress >= 70 ? 'up' : 'down'}
                    trendValue={`${weeklyProgress?.weeklyProgress || 0}%`}
                />
                <StatCard
                    title="Today's Tasks"
                    value={`${todayData?.summary?.completedTasks || 0}/${todayData?.summary?.totalTasks || 0}`}
                    subtitle={`Score: ${todayData?.summary?.totalScore || 0}`}
                    icon="✅"
                    color="green"
                />
                <StatCard
                    title="Consistency"
                    value={`${consistency?.consistencyPercentage || 0}%`}
                    subtitle={`🔥 ${consistency?.streaks?.currentStreak || 0} day streak`}
                    icon="📆"
                    color="orange"
                />
                <StatCard
                    title="Job Readiness"
                    value={`${jobReadiness?.overallScore || 0}%`}
                    subtitle={jobReadiness?.level || 'Getting Started'}
                    icon={jobReadiness?.levelEmoji || '🌱'}
                    color="purple"
                />
            </div>

            {/* ===== WEEKLY PROGRESS BAR ===== */}
            <ProgressBar progress={weeklyProgress} />

            {/* ===== CHARTS ROW ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyChart data={weeklyProgress?.dailyBreakdown} />
                <SkillDistributionChart data={skillAnalysis?.skillDistribution} />
            </div>

            {/* ===== BOTTOM SECTION ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ConsistencyTracker data={consistency} />
                <JobReadinessScore data={jobReadiness} />
                <WeeklyReview data={weeklyReview} />
            </div>
        </div>
    );
};

export default DashboardMain;