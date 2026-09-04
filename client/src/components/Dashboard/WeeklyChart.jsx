import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';

const WeeklyChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="card flex items-center justify-center h-[300px]">
                <p className="text-dark-200">No weekly data available yet</p>
            </div>
        );
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-600 border border-dark-300 rounded-lg p-3 shadow-xl">
                    <p className="text-dark-100 font-medium">{label}</p>
                    <p className="text-primary-400 text-sm">
                        Score: {payload[0].value.toFixed(2)}
                    </p>
                    <p className="text-dark-200 text-xs">
                        Tasks: {payload[0].payload.taskCount}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Color based on score
    const getBarColor = (score) => {
        if (score >= 3) return '#22c55e';    // Green
        if (score >= 1.5) return '#6366f1';  // Purple
        if (score > 0) return '#eab308';     // Yellow
        return '#1e293b';                     // Dark (no activity)
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
                📊 Daily Productivity (This Week)
            </h3>
            
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#233554" />
                    <XAxis 
                        dataKey="dayName" 
                        stroke="#8892b0"
                        fontSize={12}
                    />
                    <YAxis 
                        stroke="#8892b0"
                        fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="score" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={getBarColor(entry.score)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyChart;