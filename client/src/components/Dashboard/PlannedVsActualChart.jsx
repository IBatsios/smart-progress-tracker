import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import progressService from '../../services/progressService';

const PlannedVsActualChart = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchGoalData();
    }, []);

    const fetchGoalData = async () => {
        try {
            const response = await progressService.getGoalVsActual();
            if (response.data.comparison.hasGoal) {
                setData(response.data.comparison.skillComparison);
            }
        } catch (error) {
            console.error('Goal vs actual fetch error:', error);
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="card flex items-center justify-center h-[300px]">
                <div className="text-center">
                    <p className="text-4xl mb-2">🎯</p>
                    <p className="text-dark-200">Set weekly goals to see comparison</p>
                </div>
            </div>
        );
    }

    const chartData = data.map(item => ({
        name: item.skill,
        planned: item.planned.hours,
        actual: item.actual.hours,
        achievement: item.gap.percentage
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-600 border border-dark-300 rounded-lg p-3 shadow-xl">
                    <p className="text-dark-100 font-medium mb-1">{label}</p>
                    <p className="text-blue-400 text-sm">
                        Planned: {payload[0]?.value}h
                    </p>
                    <p className="text-green-400 text-sm">
                        Actual: {payload[1]?.value}h
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
                🎯 Planned vs Actual (This Week)
            </h3>
            
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#233554" />
                    <XAxis dataKey="name" stroke="#8892b0" fontSize={11} />
                    <YAxis stroke="#8892b0" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        formatter={(value) => (
                            <span className="text-dark-200 text-xs">{value}</span>
                        )}
                    />
                    <Bar dataKey="planned" fill="#3b82f6" name="Planned" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="#22c55e" name="Actual" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PlannedVsActualChart;