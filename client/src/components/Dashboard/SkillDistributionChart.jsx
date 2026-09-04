import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SkillDistributionChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="card flex items-center justify-center h-[300px]">
                <p className="text-dark-200">No skill data available yet</p>
            </div>
        );
    }

    const COLORS = [
        '#6366f1', '#22c55e', '#eab308', '#ef4444', 
        '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
        '#14b8a6', '#84cc16'
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-600 border border-dark-300 rounded-lg p-3 shadow-xl">
                    <p className="text-dark-100 font-medium">{payload[0].payload.skill}</p>
                    <p className="text-primary-400 text-sm">
                        {payload[0].value}% ({payload[0].payload.hours}h)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
                🎯 Skill Distribution
            </h3>
            
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="percentage"
                        nameKey="skill"
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={index} 
                                fill={COLORS[index % COLORS.length]}
                                stroke="none"
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        formatter={(value) => (
                            <span className="text-dark-200 text-xs">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillDistributionChart;