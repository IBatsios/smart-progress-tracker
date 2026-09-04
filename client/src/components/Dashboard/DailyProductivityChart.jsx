// ============================================
// DAILY PRODUCTIVITY CHART COMPONENT
// ============================================

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, Legend
} from 'recharts';
import taskService from '../../services/taskService';
import LoadingSpinner from '../Common/LoadingSpinner';

const DailyProductivityChart = ({ date = null }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('score'); // 'score' | 'time' | 'tasks'

    // Target date - default aaj
    const targetDate = date || new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchDailyData();
    }, [targetDate]);

    const fetchDailyData = async () => {
        try {
            setLoading(true);
            const response = await taskService.getTasks({ date: targetDate });
            const tasks = response.data.tasks;

            if (tasks.length === 0) {
                setData(null);
                return;
            }

            // Tasks ko process karo chart ke liye
            const processedData = processTasksForChart(tasks);
            setData(processedData);

        } catch (error) {
            console.error('Daily productivity fetch error:', error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    // Tasks individual task bars and skill-wise aggregation
    const processTasksForChart = (tasks) => {
        // Individual task bars
        const taskBars = tasks.map(task => ({
            name: task.title.length > 20 
                ? task.title.substring(0, 20) + '...' 
                : task.title,
            fullName: task.title,
            skill: task.skill,
            score: task.taskScore || 0,
            plannedTime: task.plannedTime,
            actualTime: task.actualTime,
            completion: task.completion,
            difficulty: task.difficulty
        }));

        // Skill-wise aggregation
        const skillMap = {};
        tasks.forEach(task => {
            const skill = task.skill.toLowerCase();
            if (!skillMap[skill]) {
                skillMap[skill] = {
                    name: task.skill,
                    score: 0,
                    plannedTime: 0,
                    actualTime: 0,
                    taskCount: 0
                };
            }
            skillMap[skill].score += task.taskScore || 0;
            skillMap[skill].plannedTime += task.plannedTime;
            skillMap[skill].actualTime += task.actualTime;
            skillMap[skill].taskCount += 1;
        });

        const skillBars = Object.values(skillMap).map(s => ({
            ...s,
            score: parseFloat(s.score.toFixed(2))
        }));

        // Summary stats
        const summary = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.completion === 100).length,
            totalPlannedMinutes: tasks.reduce((sum, t) => sum + t.plannedTime, 0),
            totalActualMinutes: tasks.reduce((sum, t) => sum + t.actualTime, 0),
            totalScore: parseFloat(tasks.reduce((sum, t) => sum + (t.taskScore || 0), 0).toFixed(2)),
            avgCompletion: parseFloat(
                (tasks.reduce((sum, t) => sum + t.completion, 0) / tasks.length).toFixed(1)
            )
        };

        return { taskBars, skillBars, summary };
    };

    // Difficulty basis bar color
    const getBarColor = (entry) => {
        if (entry.difficulty === 'hard') return '#ef4444';
        if (entry.difficulty === 'medium') return '#eab308';
        if (entry.difficulty === 'easy') return '#22c55e';
        return '#6366f1'; // default for skill-wise
    };

    // color basis on scores
    const getScoreColor = (score) => {
        if (score >= 3) return '#22c55e';     // Green - high
        if (score >= 1.5) return '#6366f1';   // Purple - medium
        if (score > 0) return '#eab308';      // Yellow - low
        return '#374151';                      // Gray - zero
    };

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-dark-600 border border-dark-300 rounded-lg 
                    p-3 shadow-xl max-w-xs">
                    <p className="text-dark-100 font-medium text-sm mb-2">
                        {item.fullName || item.name}
                    </p>
                    
                    {item.skill && (
                        <p className="text-primary-400 text-xs mb-1">
                            🏷️ Skill: {item.skill}
                        </p>
                    )}
                    
                    <div className="space-y-1 text-xs text-dark-200">
                        <p>📊 Score: <span className="text-primary-400 font-medium">
                            {item.score}
                        </span></p>
                        
                        {item.plannedTime !== undefined && (
                            <p>⏱️ Planned: {item.plannedTime} min</p>
                        )}
                        {item.actualTime !== undefined && (
                            <p>⏰ Actual: {item.actualTime} min</p>
                        )}
                        {item.completion !== undefined && (
                            <p>✅ Completion: {item.completion}%</p>
                        )}
                        {item.taskCount && (
                            <p>📝 Tasks: {item.taskCount}</p>
                        )}
                        {item.difficulty && (
                            <p>💎 Difficulty: {item.difficulty}</p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Loading state
    if (loading) {
        return (
            <div className="card flex items-center justify-center h-[350px]">
                <LoadingSpinner text="Loading daily data..." />
            </div>
        );
    }

    // No data state
    if (!data) {
        return (
            <div className="card flex flex-col items-center justify-center h-[350px]">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-dark-200 text-sm">
                    No tasks logged for {targetDate === new Date().toISOString().split('T')[0] 
                        ? 'today' : targetDate}
                </p>
                <p className="text-dark-200 text-xs mt-1">
                    Start logging tasks to see productivity chart
                </p>
            </div>
        );
    }

    const { taskBars, skillBars, summary } = data;

    // View toggle ke basis pe data select karo
    const chartData = viewType === 'tasks' ? taskBars : skillBars;
    const dataKey = viewType === 'time' ? 'actualTime' : 'score';

    return (
        <div className="card">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                    <h3 className="text-lg font-semibold text-dark-100">
                        📊 Daily Productivity
                    </h3>
                    <p className="text-xs text-dark-200 mt-1">
                        {targetDate === new Date().toISOString().split('T')[0] 
                            ? "Today's" : targetDate} performance breakdown
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex bg-dark-500 rounded-lg p-0.5">
                    {[
                        { key: 'score', label: 'By Score' },
                        { key: 'time', label: 'By Time' },
                        { key: 'tasks', label: 'By Task' }
                    ].map(view => (
                        <button
                            key={view.key}
                            onClick={() => setViewType(view.key)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-all
                                ${viewType === view.key
                                    ? 'bg-primary-600 text-white'
                                    : 'text-dark-200 hover:text-dark-100'}`}
                        >
                            {view.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
                <div className="bg-dark-500 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-dark-100">{summary.totalTasks}</p>
                    <p className="text-xs text-dark-200">Tasks</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-green-400">{summary.completedTasks}</p>
                    <p className="text-xs text-dark-200">Done</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-blue-400">
                        {Math.round(summary.totalPlannedMinutes / 60 * 10) / 10}h
                    </p>
                    <p className="text-xs text-dark-200">Planned</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-orange-400">
                        {Math.round(summary.totalActualMinutes / 60 * 10) / 10}h
                    </p>
                    <p className="text-xs text-dark-200">Actual</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-primary-400">{summary.totalScore}</p>
                    <p className="text-xs text-dark-200">Score</p>
                </div>
                <div className="bg-dark-500 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-dark-100">{summary.avgCompletion}%</p>
                    <p className="text-xs text-dark-200">Avg Done</p>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={250}>
                <BarChart 
                    data={chartData} 
                    margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#233554" />
                    <XAxis
                        dataKey="name"
                        stroke="#8892b0"
                        fontSize={11}
                        angle={chartData.length > 5 ? -45 : 0}
                        textAnchor={chartData.length > 5 ? "end" : "middle"}
                        height={chartData.length > 5 ? 70 : 30}
                    />
                    <YAxis stroke="#8892b0" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey={dataKey}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={60}
                        name={viewType === 'time' ? 'Time (min)' : 'Score'}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={viewType === 'tasks' 
                                    ? getBarColor(entry) 
                                    : getScoreColor(entry.score)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Legend for task view */}
            {viewType === 'tasks' && (
                <div className="flex items-center justify-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span className="text-xs text-dark-200">Easy</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-yellow-500" />
                        <span className="text-xs text-dark-200">Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span className="text-xs text-dark-200">Hard</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyProductivityChart;