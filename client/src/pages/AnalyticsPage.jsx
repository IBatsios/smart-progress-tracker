import React, { useState, useEffect } from 'react';
import SkillHeatmap from '../components/Dashboard/SkillHeatmap';
import MonthlySummary from '../components/Dashboard/MonthlySummary';
import JobReadinessScore from '../components/Dashboard/JobReadinessScore';
import ConsistencyTracker from '../components/Dashboard/ConsistencyTracker';
import WeeklyReview from '../components/Dashboard/WeeklyReview';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import progressService from '../services/progressService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, Area, AreaChart
} from 'recharts';

const AnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [skillAnalysis, setSkillAnalysis] = useState(null);
    const [consistency, setConsistency] = useState(null);
    const [jobReadiness, setJobReadiness] = useState(null);
    const [weeklyReview, setWeeklyReview] = useState(null);
    const [timePeriod, setTimePeriod] = useState(30); // days

    useEffect(() => {
        fetchAnalyticsData();
    }, [timePeriod]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);

            const [skillRes, consistencyRes, readinessRes, reviewRes] = 
                await Promise.allSettled([
                    progressService.getSkillAnalysis(timePeriod),
                    progressService.getConsistency(timePeriod),
                    progressService.getJobReadiness(),
                    progressService.getWeeklyReview()
                ]);

            if (skillRes.status === 'fulfilled') 
                setSkillAnalysis(skillRes.value.data.analysis);
            if (consistencyRes.status === 'fulfilled') 
                setConsistency(consistencyRes.value.data.consistency);
            if (readinessRes.status === 'fulfilled') 
                setJobReadiness(readinessRes.value.data.readiness);
            if (reviewRes.status === 'fulfilled') 
                setWeeklyReview(reviewRes.value.data.review);

        } catch (error) {
            console.error('Analytics fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="large" text="Loading analytics..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ===== PAGE HEADER ===== */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">📈 Analytics</h1>
                    <p className="text-dark-200 text-sm mt-1">
                        Deep insights into your learning progress
                    </p>
                </div>

                {/* Time Period Selector */}
                <div className="flex bg-dark-400 rounded-lg p-1">
                    {[7, 14, 30, 90].map(days => (
                        <button
                            key={days}
                            onClick={() => setTimePeriod(days)}
                            className={`px-4 py-1.5 rounded text-sm font-medium transition-all
                                ${timePeriod === days
                                    ? 'bg-primary-600 text-white'
                                    : 'text-dark-200 hover:text-dark-100'}`}
                        >
                            {days}d
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== SKILL ANALYSIS SECTION ===== */}
            <div className="card">
                <h3 className="text-lg font-semibold text-dark-100 mb-5">
                    🧠 Skill Analysis (Last {timePeriod} days)
                </h3>

                {skillAnalysis && skillAnalysis.skills.length > 0 ? (
                    <>
                        {/* Skill Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                            <div className="bg-dark-500 rounded-lg p-3 text-center">
                                <p className="text-xl font-bold text-dark-100">
                                    {skillAnalysis.summary.totalSkills}
                                </p>
                                <p className="text-xs text-dark-200">Total Skills</p>
                            </div>
                            <div className="bg-dark-500 rounded-lg p-3 text-center">
                                <p className="text-xl font-bold text-green-400">
                                    {skillAnalysis.summary.strongSkills}
                                </p>
                                <p className="text-xs text-dark-200">Strong 💪</p>
                            </div>
                            <div className="bg-dark-500 rounded-lg p-3 text-center">
                                <p className="text-xl font-bold text-yellow-400">
                                    {skillAnalysis.summary.mediumSkills}
                                </p>
                                <p className="text-xs text-dark-200">Medium 🔶</p>
                            </div>
                            <div className="bg-dark-500 rounded-lg p-3 text-center">
                                <p className="text-xl font-bold text-red-400">
                                    {skillAnalysis.summary.weakSkills}
                                </p>
                                <p className="text-xs text-dark-200">Weak 🔴</p>
                            </div>
                            <div className="bg-dark-500 rounded-lg p-3 text-center">
                                <p className="text-xl font-bold text-blue-400">
                                    {skillAnalysis.summary.totalTimeHours}h
                                </p>
                                <p className="text-xs text-dark-200">Total Time</p>
                            </div>
                        </div>

                        {/* Skill Bars Chart */}
                        <div className="mb-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={skillAnalysis.skills.map(s => ({
                                        name: s.skill,
                                        score: s.totalScore,
                                        hours: s.totalTimeHours,
                                        completion: s.avgCompletion
                                    }))}
                                    margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#233554" />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#8892b0" 
                                        fontSize={11}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis stroke="#8892b0" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#112240',
                                            border: '1px solid #233554',
                                            borderRadius: '8px',
                                            color: '#ccd6f6'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="score" 
                                        fill="#6366f1" 
                                        name="Score"
                                        radius={[4, 4, 0, 0]} 
                                    />
                                    <Bar 
                                        dataKey="hours" 
                                        fill="#22c55e" 
                                        name="Hours"
                                        radius={[4, 4, 0, 0]} 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Skill Detail Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skillAnalysis.skills.map((skill, index) => (
                                <div
                                    key={skill.skill}
                                    className={`rounded-xl border p-4 transition-all duration-300
                                        hover:scale-[1.02] animate-fade-in
                                        ${skill.strength === 'strong' 
                                            ? 'border-green-500/30 bg-green-500/5' 
                                            : skill.strength === 'medium'
                                            ? 'border-yellow-500/30 bg-yellow-500/5'
                                            : 'border-red-500/30 bg-red-500/5'}`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Skill Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-dark-100 font-semibold capitalize">
                                            {skill.skill}
                                        </h4>
                                        <span className={`badge text-xs
                                            ${skill.strength === 'strong' 
                                                ? 'bg-green-500/20 text-green-400'
                                                : skill.strength === 'medium'
                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                : 'bg-red-500/20 text-red-400'}`}
                                        >
                                            {skill.strength === 'strong' ? '💪 Strong' :
                                             skill.strength === 'medium' ? '🔶 Medium' : 
                                             '🔴 Weak'}
                                        </span>
                                    </div>

                                    {/* Strength Bar */}
                                    <div className="w-full bg-dark-300 rounded-full h-2 mb-3">
                                        <div
                                            className="h-2 rounded-full transition-all duration-700"
                                            style={{
                                                width: `${skill.relativeScore}%`,
                                                backgroundColor: skill.strengthColor
                                            }}
                                        />
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-2 text-center">
                                        <div className="bg-dark-500/50 rounded py-1.5">
                                            <p className="text-sm font-bold text-dark-100">
                                                {skill.totalTimeHours}h
                                            </p>
                                            <p className="text-xs text-dark-200">Time</p>
                                        </div>
                                        <div className="bg-dark-500/50 rounded py-1.5">
                                            <p className="text-sm font-bold text-primary-400">
                                                {skill.totalScore}
                                            </p>
                                            <p className="text-xs text-dark-200">Score</p>
                                        </div>
                                        <div className="bg-dark-500/50 rounded py-1.5">
                                            <p className="text-sm font-bold text-dark-100">
                                                {skill.taskCount}
                                            </p>
                                            <p className="text-xs text-dark-200">Tasks</p>
                                        </div>
                                        <div className="bg-dark-500/50 rounded py-1.5">
                                            <p className="text-sm font-bold text-dark-100">
                                                {skill.avgCompletion}%
                                            </p>
                                            <p className="text-xs text-dark-200">Avg Complete</p>
                                        </div>
                                    </div>

                                    {/* Difficulty Distribution */}
                                    <div className="flex items-center gap-2 mt-3 text-xs">
                                        <span className="text-dark-200">Difficulty:</span>
                                        <span className="text-green-400">
                                            E:{skill.difficultyDistribution.easy}
                                        </span>
                                        <span className="text-yellow-400">
                                            M:{skill.difficultyDistribution.medium}
                                        </span>
                                        <span className="text-red-400">
                                            H:{skill.difficultyDistribution.hard}
                                        </span>
                                    </div>

                                    {/* Last Practiced */}
                                    <p className="text-xs text-dark-200 mt-2">
                                        Last practiced: {new Date(skill.lastPracticed).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-4xl mb-3">📊</p>
                        <p className="text-dark-200">
                            No skill data yet. Start logging tasks to see analysis!
                        </p>
                    </div>
                )}
            </div>

            {/* ===== HEATMAP SECTION ===== */}
            <SkillHeatmap />

            {/* ===== CONSISTENCY TREND ===== */}
            {consistency && consistency.dailyActivity && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-dark-100 mb-4">
                        📈 Activity Trend (Last {timePeriod} days)
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                            data={consistency.dailyActivity.map(d => ({
                                date: new Date(d.date).getDate(),
                                score: d.score,
                                time: Math.round(d.timeSpent / 60 * 10) / 10
                            }))}
                            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#233554" />
                            <XAxis dataKey="date" stroke="#8892b0" fontSize={11} />
                            <YAxis stroke="#8892b0" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#112240',
                                    border: '1px solid #233554',
                                    borderRadius: '8px',
                                    color: '#ccd6f6'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#6366f1"
                                fill="#6366f1"
                                fillOpacity={0.2}
                                name="Score"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* ===== BOTTOM SECTION ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ConsistencyTracker data={consistency} />
                <JobReadinessScore data={jobReadiness} />
                <WeeklyReview data={weeklyReview} />
            </div>

            {/* ===== MONTHLY SUMMARY ===== */}
            <MonthlySummary />
        </div>
    );
};

export default AnalyticsPage;