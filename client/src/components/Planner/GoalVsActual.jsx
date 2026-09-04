import React, { useState, useEffect } from 'react';
import progressService from '../../services/progressService';
import LoadingSpinner from '../Common/LoadingSpinner';

const GoalVsActual = () => {
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComparison();
    }, []);

    const fetchComparison = async () => {
        try {
            const response = await progressService.getGoalVsActual();
            setComparison(response.data.comparison);
        } catch (error) {
            console.error('Goal vs actual error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="card h-48"><LoadingSpinner /></div>;
    
    if (!comparison?.hasGoal) {
        return (
            <div className="card text-center py-8">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-dark-200 mb-2">No weekly goal set</p>
                <p className="text-xs text-dark-200">Set a weekly goal to see comparison</p>
            </div>
        );
    }

    const { overall, skillComparison } = comparison;

    return (
        <div className="card animate-fade-in">
            <h3 className="text-lg font-semibold text-dark-100 mb-5">
                📊 Goal vs Actual
            </h3>

            {/* Overall Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-blue-400">{overall.plannedHours}h</p>
                    <p className="text-xs text-dark-200">Planned</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-green-400">{overall.actualHours}h</p>
                    <p className="text-xs text-dark-200">Actual</p>
                </div>
                <div className={`${overall.gapHours > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'} 
                    border rounded-lg p-3 text-center`}>
                    <p className={`text-xl font-bold ${overall.gapHours > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {overall.gapHours > 0 ? `-${overall.gapHours}h` : `+${Math.abs(overall.gapHours)}h`}
                    </p>
                    <p className="text-xs text-dark-200">Gap</p>
                </div>
            </div>

            {/* Achievement Bar */}
            <div className="mb-5">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-200">Achievement</span>
                    <span className="text-primary-400 font-medium">{overall.achievementPercentage}%</span>
                </div>
                <div className="w-full bg-dark-300 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-700
                            ${overall.achievementPercentage >= 100 ? 'bg-green-500' :
                              overall.achievementPercentage >= 70 ? 'bg-primary-500' :
                              overall.achievementPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(overall.achievementPercentage, 100)}%` }}
                    />
                </div>
            </div>

            {/* Skill-wise Comparison */}
            <div className="space-y-3">
                <p className="text-sm font-medium text-dark-200">Skill-wise:</p>
                {skillComparison.map((skill, i) => (
                    <div key={i} className="bg-dark-500 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-dark-100">{skill.skill}</span>
                            <span className={`badge text-xs
                                ${skill.status === 'achieved' ? 'bg-green-500/20 text-green-400' :
                                  skill.status === 'close' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'}`}
                            >
                                {skill.status === 'achieved' ? '✅ Achieved' :
                                 skill.status === 'close' ? '🔶 Close' : '🔴 Behind'}
                            </span>
                        </div>
                        <div className="flex gap-4 text-xs text-dark-200">
                            <span>Planned: {skill.planned.hours}h</span>
                            <span>Actual: {skill.actual.hours}h</span>
                            <span className="text-primary-400">{skill.gap.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalVsActual;