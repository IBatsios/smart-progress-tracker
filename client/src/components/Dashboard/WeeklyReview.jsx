import React from 'react';

const WeeklyReview = ({ data }) => {
    if (!data) {
        return (
            <div className="card h-64 flex items-center justify-center">
                <p className="text-dark-200">Loading weekly review...</p>
            </div>
        );
    }

    const { metrics, comparison, positives, improvements, actionItems } = data;

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
                📋 Weekly Review
            </h3>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-dark-500 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-dark-100">{metrics.totalTasks}</p>
                    <p className="text-xs text-dark-200">Tasks</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-dark-100">{metrics.totalHours}h</p>
                    <p className="text-xs text-dark-200">Hours</p>
                </div>
            </div>

            {/* Trend */}
            <div className={`rounded-lg p-3 mb-3 text-center text-sm font-medium
                ${comparison.trend === 'improving' 
                    ? 'bg-green-500/10 text-green-400' 
                    : comparison.trend === 'declining'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}
            >
                {comparison.trend === 'improving' ? '📈' : comparison.trend === 'declining' ? '📉' : '→'}
                {' '}Score: {comparison.scoreChangePercent > 0 ? '+' : ''}{comparison.scoreChangePercent}% vs last week
            </div>

            {/* Positives */}
            {positives.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs font-medium text-green-400 mb-1">What went well:</p>
                    {positives.slice(0, 2).map((item, i) => (
                        <p key={i} className="text-xs text-dark-200 ml-2">{item}</p>
                    ))}
                </div>
            )}

            {/* Improvements */}
            {improvements.length > 0 && (
                <div>
                    <p className="text-xs font-medium text-yellow-400 mb-1">To improve:</p>
                    {improvements.slice(0, 2).map((item, i) => (
                        <p key={i} className="text-xs text-dark-200 ml-2">{item}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeeklyReview;