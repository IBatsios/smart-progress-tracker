import React, { useState, useEffect } from 'react';
import progressService from '../../services/progressService';
import toast from 'react-hot-toast';

const WeeklyPlanner = () => {
    const [existingGoal, setExistingGoal] = useState(null);
    const [skillGoals, setSkillGoals] = useState([
        { skill: '', plannedHours: 0, plannedTasks: 0, allocationPercentage: 0 }
    ]);
    const [totalPlannedHours, setTotalPlannedHours] = useState(20);
    const [weeklyFocus, setWeeklyFocus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchExistingGoal();
    }, []);

    const fetchExistingGoal = async () => {
        try {
            const response = await progressService.getWeeklyGoal();
            if (response.data.goal) {
                setExistingGoal(response.data.goal);
                setSkillGoals(response.data.goal.skillGoals);
                setTotalPlannedHours(response.data.goal.totalPlannedHours);
                setWeeklyFocus(response.data.goal.weeklyFocus || '');
            }
        } catch (error) {
            console.error('Fetch goal error:', error);
        }
    };

    const addSkillGoal = () => {
        setSkillGoals([
            ...skillGoals,
            { skill: '', plannedHours: 0, plannedTasks: 0, allocationPercentage: 0 }
        ]);
    };

    const removeSkillGoal = (index) => {
        setSkillGoals(skillGoals.filter((_, i) => i !== index));
    };

    const updateSkillGoal = (index, field, value) => {
        const updated = [...skillGoals];
        updated[index][field] = field === 'skill' ? value : parseFloat(value) || 0;
        
        // Auto-calculate allocation percentage
        const totalSkillHours = updated.reduce((sum, g) => sum + g.plannedHours, 0);
        updated.forEach(g => {
            g.allocationPercentage = totalSkillHours > 0 
                ? parseFloat(((g.plannedHours / totalSkillHours) * 100).toFixed(1))
                : 0;
        });
        
        setSkillGoals(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Get current week's Monday
            const today = new Date();
            const dayOfWeek = today.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const monday = new Date(today);
            monday.setDate(today.getDate() + diff);

            await progressService.createWeeklyGoal({
                weekStartDate: monday.toISOString().split('T')[0],
                skillGoals: skillGoals.filter(g => g.skill),
                totalPlannedHours,
                weeklyFocus
            });

            toast.success('Weekly goal set! 🎯');
            fetchExistingGoal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create goal');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card animate-fade-in">
            <h3 className="text-lg font-semibold text-dark-100 mb-5 flex items-center gap-2">
                🎯 Weekly Planner
                {existingGoal && (
                    <span className="badge bg-green-500/20 text-green-400">
                        Goal Set ✅
                    </span>
                )}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Total Hours & Focus */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Total Planned Hours This Week</label>
                        <input
                            type="number"
                            value={totalPlannedHours}
                            onChange={(e) => setTotalPlannedHours(parseInt(e.target.value) || 0)}
                            className="input-field"
                            min="1"
                            max="80"
                        />
                    </div>
                    <div>
                        <label className="label">Weekly Focus</label>
                        <input
                            type="text"
                            value={weeklyFocus}
                            onChange={(e) => setWeeklyFocus(e.target.value)}
                            className="input-field"
                            placeholder="e.g., Complete React project"
                        />
                    </div>
                </div>

                {/* Skill Goals */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="label mb-0">Skill Distribution</label>
                        <button
                            type="button"
                            onClick={addSkillGoal}
                            className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                        >
                            + Add Skill
                        </button>
                    </div>

                    <div className="space-y-2">
                        {skillGoals.map((goal, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        value={goal.skill}
                                        onChange={(e) => updateSkillGoal(index, 'skill', e.target.value)}
                                        className="input-field text-sm"
                                        placeholder="Skill name"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        value={goal.plannedHours}
                                        onChange={(e) => updateSkillGoal(index, 'plannedHours', e.target.value)}
                                        className="input-field text-sm"
                                        placeholder="Hours"
                                        min="0"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        value={goal.plannedTasks}
                                        onChange={(e) => updateSkillGoal(index, 'plannedTasks', e.target.value)}
                                        className="input-field text-sm"
                                        placeholder="Tasks"
                                        min="0"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-dark-300 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-primary-500"
                                                style={{ width: `${goal.allocationPercentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-dark-200 w-10">
                                            {goal.allocationPercentage}%
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    {skillGoals.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSkillGoal(index)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full"
                >
                    {isSubmitting ? 'Saving...' : existingGoal ? 'Update Goal' : 'Set Weekly Goal 🎯'}
                </button>
            </form>
        </div>
    );
};

export default WeeklyPlanner;