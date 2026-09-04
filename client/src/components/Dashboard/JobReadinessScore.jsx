import React from 'react';

const JobReadinessScore = ({ data }) => {
    if (!data) {
        return (
            <div className="card h-64 flex items-center justify-center">
                <p className="text-dark-200">Loading readiness data...</p>
            </div>
        );
    }

    const { overallScore, level, breakdown, recommendations } = data;

    // Circular progress component
    const CircularProgress = ({ score, size = 120 }) => {
        const radius = (size - 12) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;

        const getColor = (s) => {
            if (s >= 80) return '#22c55e';
            if (s >= 60) return '#6366f1';
            if (s >= 40) return '#eab308';
            return '#ef4444';
        };

        return (
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="#233554" strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={getColor(score)} strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
        );
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
                🎯 Job Readiness Score
            </h3>

            {/* Score Circle */}
            <div className="flex justify-center mb-4 relative">
                <CircularProgress score={overallScore} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-dark-100">{overallScore}</span>
                    <span className="text-xs text-dark-200">/ 100</span>
                </div>
            </div>

            {/* Level Badge */}
            <div className="text-center mb-4">
                <span className="inline-block bg-primary-600/20 border border-primary-500/30 
                    rounded-full px-4 py-1 text-sm text-primary-400 font-medium">
                    {level}
                </span>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
                {Object.entries(breakdown).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-dark-200 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 bg-dark-300 rounded-full h-1.5">
                                <div
                                    className="h-1.5 rounded-full bg-primary-500 transition-all duration-500"
                                    style={{ width: `${val.score}%` }}
                                />
                            </div>
                            <span className="text-xs text-dark-100 w-8 text-right">
                                {val.score}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Recommendation */}
            {recommendations && recommendations.length > 0 && (
                <div className="mt-4 bg-dark-500 rounded-lg p-3">
                    <p className="text-xs text-dark-200">{recommendations[0]}</p>
                </div>
            )}
        </div>
    );
};

export default JobReadinessScore;