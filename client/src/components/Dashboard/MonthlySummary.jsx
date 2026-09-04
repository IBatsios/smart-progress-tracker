import React, { useState, useEffect } from 'react';
import progressService from '../../services/progressService';
import LoadingSpinner from '../Common/LoadingSpinner';

const MonthlySummary = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const response = await progressService.getMonthlySummary();
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Monthly summary error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="card h-48"><LoadingSpinner /></div>;
    if (!summary) return null;

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
                📅 Monthly Summary - {summary.month}
            </h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-dark-500 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-dark-100">{summary.totalTasks}</p>
                    <p className="text-xs text-dark-200">Total Tasks</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-green-400">{summary.completedTasks}</p>
                    <p className="text-xs text-dark-200">Completed</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-blue-400">{summary.totalTimeHours}h</p>
                    <p className="text-xs text-dark-200">Time Invested</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-primary-400">{summary.totalScore}</p>
                    <p className="text-xs text-dark-200">Total Score</p>
                </div>
            </div>

            {/* Weekly Breakdown */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-dark-200">Weekly Breakdown:</p>
                {summary.weeklyBreakdown?.map((week, i) => (
                    <div key={i} className="flex items-center justify-between 
                        bg-dark-500 rounded-lg px-3 py-2">
                        <span className="text-sm text-dark-100">Week {i + 1}</span>
                        <div className="flex items-center gap-4 text-xs text-dark-200">
                            <span>{week.taskCount} tasks</span>
                            <span>{week.totalTimeHours}h</span>
                            <span className="text-primary-400 font-medium">
                                Score: {week.totalScore}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Best Week */}
            {summary.bestWeek && (
                <div className="mt-3 bg-primary-600/10 border border-primary-500/30 
                    rounded-lg p-3 text-center">
                    <p className="text-sm text-primary-400">
                        🏆 Best Week: Score {summary.bestWeek.totalScore} 
                        ({summary.bestWeek.totalTimeHours}h)
                    </p>
                </div>
            )}
        </div>
    );
};

export default MonthlySummary;