import React from 'react';
import WeeklyPlanner from '../components/Planner/WeeklyPlanner';
import GoalVsActual from '../components/Planner/GoalVsActual';
import PlannedVsActualChart from '../components/Dashboard/PlannedVsActualChart';

const PlannerPage = () => {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-dark-100">🎯 Weekly Planner</h1>
                <p className="text-dark-200 text-sm mt-1">
                    Set weekly goals and track your achievement
                </p>
            </div>

            {/* Planner Form */}
            <WeeklyPlanner />

            {/* Goal vs Actual Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GoalVsActual />
                <PlannedVsActualChart />
            </div>
        </div>
    );
};

export default PlannerPage;