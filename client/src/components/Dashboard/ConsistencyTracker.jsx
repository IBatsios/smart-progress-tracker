import React from 'react';

const ConsistencyTracker = ({ data }) => {
    if (!data) {
        return (
            <div className="card h-64 flex items-center justify-center">
                <p className="text-dark-200">Loading consistency data...</p>
            </div>
        );
    }

    const { streaks, consistencyPercentage, dailyActivity, insights } = data;

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
                📆 Consistency Tracker
            </h3>

            {/* Streak Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-dark-500 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-orange-400">
                        {streaks?.currentStreak || 0}
                    </p>
                    <p className="text-xs text-dark-200">Current Streak 🔥</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-primary-400">
                        {streaks?.longestStreak || 0}
                    </p>
                    <p className="text-xs text-dark-200">Longest Streak</p>
                </div>
            </div>

            {/* Activity Dots (last 14 days) */}
            <div className="mb-4">
                <p className="text-sm text-dark-200 mb-2">Last 14 days:</p>
                <div className="flex flex-wrap gap-1.5">
                    {dailyActivity?.slice(-14).map((day, i) => (
                        <div
                            key={i}
                            className={`w-5 h-5 rounded-sm transition-all duration-200
                                ${day.isActive 
                                    ? 'bg-green-500 hover:bg-green-400' 
                                    : 'bg-dark-300 hover:bg-dark-200'
                                }`}
                            title={`${day.date}: ${day.isActive ? `${day.timeSpent}min` : 'No activity'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Status Badge */}
            <div className="bg-dark-500 rounded-lg p-3">
                <p className="text-sm font-medium text-dark-100">
                    {streaks?.streakStatus}
                </p>
                <p className="text-xs text-dark-200 mt-1">
                    {consistencyPercentage}% consistent over {data.period?.totalDays} days
                </p>
            </div>

            {/* Insights */}
            {insights && insights.length > 0 && (
                <div className="mt-3 space-y-1">
                    {insights.slice(0, 2).map((insight, i) => (
                        <p key={i} className="text-xs text-dark-200">
                            {insight.icon} {insight.message}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConsistencyTracker;