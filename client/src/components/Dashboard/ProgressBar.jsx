import React from 'react';

const ProgressBar = ({ progress }) => {
    const percentage = progress?.weeklyProgress || 0;
    
    const getColor = (pct) => {
        if (pct >= 80) return { bg: 'bg-green-500', text: 'text-green-400', glow: 'shadow-green-500/30' };
        if (pct >= 60) return { bg: 'bg-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/30' };
        if (pct >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/30' };
        return { bg: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/30' };
    };

    const color = getColor(percentage);

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-dark-100">
                        Weekly Progress
                    </h3>
                    <p className="text-sm text-dark-200">
                        Based on weighted task scores
                    </p>
                </div>
                <div className={`text-3xl font-bold ${color.text}`}>
                    {percentage}%
                </div>
            </div>

            {/* Main Progress Bar */}
            <div className="w-full bg-dark-300 rounded-full h-4 overflow-hidden">
                <div
                    className={`h-full rounded-full ${color.bg} transition-all duration-1000 
                        ease-out shadow-lg ${color.glow}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>

            {/* Stats Below */}
            <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                    <p className="text-lg font-bold text-dark-100">
                        {progress?.totalTasks || 0}
                    </p>
                    <p className="text-xs text-dark-200">Total Tasks</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-green-400">
                        {progress?.completedTasks || 0}
                    </p>
                    <p className="text-xs text-dark-200">Completed</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-blue-400">
                        {progress?.totalScore?.toFixed(1) || 0}
                    </p>
                    <p className="text-xs text-dark-200">Total Score</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-orange-400">
                        {progress?.activeDays || 0}/7
                    </p>
                    <p className="text-xs text-dark-200">Active Days</p>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;