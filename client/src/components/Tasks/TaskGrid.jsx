// ============================================
// TASK GRID COMPONENT
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import taskService from '../../services/taskService';
import TaskDetail from './TaskDetail';
import LoadingSpinner from '../Common/LoadingSpinner';
import { formatTime } from '../../utils/helpers';

const TaskGrid = ({ days = 14, onTaskUpdated, onTaskDeleted }) => {
    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
        fetchGridTasks();
    }, [days]);

    const fetchGridTasks = async () => {
        try {
            setLoading(true);
            
            // Last N days ka date range
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const response = await taskService.getTasks({
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                limit: 500  // Saari tasks chahiye
            });

            setAllTasks(response.data.tasks);
        } catch (error) {
            console.error('Grid tasks fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // DATE ARRAY GENERATE KARO
    // ============================================
    const dateArray = useMemo(() => {
        const dates = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push({
                dateStr: date.toISOString().split('T')[0],
                dayName: date.toLocaleDateString('en', { weekday: 'short' }),
                dayNum: date.getDate(),
                month: date.toLocaleDateString('en', { month: 'short' }),
                isToday: i === 0,
                isWeekend: date.getDay() === 0 || date.getDay() === 6
            });
        }
        return dates;
    }, [days]);

    // ============================================
    // UNIQUE SKILLS NIKALO
    // ============================================
    const uniqueSkills = useMemo(() => {
        const skills = [...new Set(allTasks.map(t => t.skill.toLowerCase()))];
        return skills.sort();
    }, [allTasks]);

    // ============================================
    // GRID DATA MATRIX CREATE KARO
    // ============================================
    // gridData[skill][date] = { tasks, totalTime, totalScore, intensity }
    const gridData = useMemo(() => {
        const matrix = {};

        uniqueSkills.forEach(skill => {
            matrix[skill] = {};
            dateArray.forEach(dateInfo => {
                const dayTasks = allTasks.filter(t => 
                    t.skill.toLowerCase() === skill &&
                    new Date(t.date).toISOString().split('T')[0] === dateInfo.dateStr
                );

                const totalTime = dayTasks.reduce((sum, t) => sum + t.actualTime, 0);
                const totalScore = dayTasks.reduce((sum, t) => sum + (t.taskScore || 0), 0);
                const avgCompletion = dayTasks.length > 0
                    ? dayTasks.reduce((sum, t) => sum + t.completion, 0) / dayTasks.length
                    : 0;

                // Intensity level (0-4) for coloring
                let intensity = 0;
                if (totalTime > 0 && totalTime < 30) intensity = 1;
                else if (totalTime >= 30 && totalTime < 60) intensity = 2;
                else if (totalTime >= 60 && totalTime < 120) intensity = 3;
                else if (totalTime >= 120) intensity = 4;

                matrix[skill][dateInfo.dateStr] = {
                    tasks: dayTasks,
                    totalTime,
                    totalScore: parseFloat(totalScore.toFixed(2)),
                    avgCompletion: Math.round(avgCompletion),
                    taskCount: dayTasks.length,
                    intensity
                };
            });
        });

        return matrix;
    }, [allTasks, uniqueSkills, dateArray]);

    // ============================================
    // DAILY TOTALS
    // ============================================
    const dailyTotals = useMemo(() => {
        const totals = {};
        dateArray.forEach(dateInfo => {
            const dayTasks = allTasks.filter(t => 
                new Date(t.date).toISOString().split('T')[0] === dateInfo.dateStr
            );
            totals[dateInfo.dateStr] = {
                taskCount: dayTasks.length,
                totalTime: dayTasks.reduce((sum, t) => sum + t.actualTime, 0),
                totalScore: parseFloat(
                    dayTasks.reduce((sum, t) => sum + (t.taskScore || 0), 0).toFixed(2)
                )
            };
        });
        return totals;
    }, [allTasks, dateArray]);

    // ============================================
    // INTENSITY COLORS
    // ============================================
    const intensityColors = {
        0: '#0d1117',      // No activity - darkest
        1: '#0e4429',      // Light green
        2: '#006d32',      // Medium green
        3: '#26a641',      // Strong green
        4: '#39d353'        // Brightest green
    };

    // ============================================
    // CELL CLICK HANDLER
    // ============================================
    const handleCellClick = (skill, dateStr) => {
        const cellData = gridData[skill]?.[dateStr];
        if (cellData && cellData.tasks.length > 0) {
            // Pehle task ka detail dikhao
            setSelectedTask(cellData.tasks[0]);
            setShowDetail(true);
        }
    };

    // Handle task updated from detail modal
    const handleTaskUpdated = (updatedTask) => {
        setAllTasks(prev => prev.map(t => 
            t._id === updatedTask._id ? updatedTask : t
        ));
        if (onTaskUpdated) onTaskUpdated(updatedTask);
    };

    // Loading state
    if (loading) {
        return (
            <div className="card flex items-center justify-center h-64">
                <LoadingSpinner size="large" text="Loading grid..." />
            </div>
        );
    }

    // No data state
    if (allTasks.length === 0) {
        return (
            <div className="card text-center py-12">
                <p className="text-5xl mb-4">📊</p>
                <h3 className="text-dark-100 font-semibold text-lg mb-2">
                    No Task Data Yet
                </h3>
                <p className="text-dark-200 text-sm">
                    Start logging tasks to see your activity grid!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ===== MAIN GRID ===== */}
            <div className="card overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-dark-100">
                        📊 Activity Grid (Last {days} days)
                    </h3>
                    <div className="text-xs text-dark-200">
                        {allTasks.length} total tasks tracked
                    </div>
                </div>

                <table className="w-full min-w-[600px]">
                    {/* Date Headers */}
                    <thead>
                        <tr>
                            <th className="text-left text-xs text-dark-200 pb-2 pr-4 
                                min-w-[100px] sticky left-0 bg-dark-400 z-10">
                                Skill
                            </th>
                            {dateArray.map(dateInfo => (
                                <th 
                                    key={dateInfo.dateStr} 
                                    className={`text-center pb-2 px-0.5
                                        ${dateInfo.isToday 
                                            ? 'text-primary-400' 
                                            : dateInfo.isWeekend 
                                            ? 'text-dark-300' 
                                            : 'text-dark-200'}`}
                                >
                                    <div className="text-[9px] leading-tight">
                                        {dateInfo.dayName}
                                    </div>
                                    <div className={`text-[10px] font-medium
                                        ${dateInfo.isToday ? 'text-primary-400' : ''}`}>
                                        {dateInfo.dayNum}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Skill Rows */}
                        {uniqueSkills.map(skill => (
                            <tr key={skill}>
                                {/* Skill Name */}
                                <td className="text-sm text-dark-100 pr-4 py-1 
                                    capitalize font-medium sticky left-0 bg-dark-400 z-10
                                    border-r border-dark-300">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary-500" />
                                        {skill}
                                    </div>
                                </td>

                                {/* Grid Cells */}
                                {dateArray.map(dateInfo => {
                                    const cellData = gridData[skill]?.[dateInfo.dateStr];
                                    const intensity = cellData?.intensity || 0;

                                    return (
                                        <td 
                                            key={`${skill}-${dateInfo.dateStr}`} 
                                            className="px-0.5 py-0.5"
                                        >
                                            <div
                                                className={`w-7 h-7 rounded-[4px] cursor-pointer
                                                    transition-all duration-200 
                                                    hover:scale-125 hover:z-20
                                                    hover:ring-2 hover:ring-primary-500/50
                                                    relative group
                                                    ${dateInfo.isToday ? 'ring-1 ring-primary-500/30' : ''}`}
                                                style={{
                                                    backgroundColor: intensityColors[intensity]
                                                }}
                                                onClick={() => handleCellClick(skill, dateInfo.dateStr)}
                                            >
                                                {/* Task count indicator */}
                                                {cellData && cellData.taskCount > 1 && (
                                                    <span className="absolute -top-1 -right-1 
                                                        w-3 h-3 bg-primary-500 rounded-full 
                                                        text-[7px] text-white flex items-center 
                                                        justify-center font-bold">
                                                        {cellData.taskCount}
                                                    </span>
                                                )}

                                                {/* Hover Tooltip */}
                                                <div className="absolute bottom-full left-1/2 
                                                    -translate-x-1/2 mb-2 hidden group-hover:block 
                                                    z-50 pointer-events-none">
                                                    <div className="bg-dark-600 border border-dark-300 
                                                        rounded-lg p-2 shadow-xl whitespace-nowrap
                                                        text-xs">
                                                        <p className="text-dark-100 font-medium capitalize">
                                                            {skill}
                                                        </p>
                                                        <p className="text-dark-200">
                                                            {dateInfo.dateStr}
                                                        </p>
                                                        {cellData && cellData.taskCount > 0 ? (
                                                            <>
                                                                <p className="text-primary-400">
                                                                    {cellData.taskCount} task(s)
                                                                </p>
                                                                <p className="text-dark-200">
                                                                    {formatTime(cellData.totalTime)}
                                                                </p>
                                                                <p className="text-green-400">
                                                                    Score: {cellData.totalScore}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p className="text-dark-300">
                                                                No activity
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}

                        {/* Daily Totals Row */}
                        <tr className="border-t border-dark-300">
                            <td className="text-xs text-dark-200 font-medium py-2 pr-4 
                                sticky left-0 bg-dark-400 z-10 border-r border-dark-300">
                                📊 Daily Total
                            </td>
                            {dateArray.map(dateInfo => {
                                const total = dailyTotals[dateInfo.dateStr];
                                return (
                                    <td 
                                        key={`total-${dateInfo.dateStr}`} 
                                        className="text-center py-2 px-0.5"
                                    >
                                        <span className={`text-[10px] font-medium
                                            ${total?.totalScore > 3 ? 'text-green-400' :
                                              total?.totalScore > 0 ? 'text-dark-200' :
                                              'text-dark-300'}`}
                                        >
                                            {total?.totalScore > 0 ? total.totalScore : '-'}
                                        </span>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>

                {/* ===== LEGEND ===== */}
                <div className="flex items-center justify-between mt-4 pt-3 
                    border-t border-dark-300">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-dark-200">Less</span>
                        {Object.entries(intensityColors).map(([level, color]) => (
                            <div
                                key={level}
                                className="w-4 h-4 rounded-[3px]"
                                style={{ backgroundColor: color }}
                                title={`Level ${level}`}
                            />
                        ))}
                        <span className="text-xs text-dark-200">More</span>
                    </div>

                    <div className="text-xs text-dark-200">
                        Click on a cell to see task details
                    </div>
                </div>
            </div>

            {/* ===== TASK DETAIL MODAL ===== */}
            {showDetail && selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center 
                    bg-black/60 backdrop-blur-sm p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowDetail(false);
                            setSelectedTask(null);
                        }
                    }}
                >
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <TaskDetail
                            task={selectedTask}
                            onClose={() => {
                                setShowDetail(false);
                                setSelectedTask(null);
                            }}
                            onTaskUpdated={handleTaskUpdated}
                        />
                    </div>
                </div>
            )}

            {/* ===== SKILL SUMMARY CARDS ===== */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {uniqueSkills.map(skill => {
                    const skillTasks = allTasks.filter(t => 
                        t.skill.toLowerCase() === skill
                    );
                    const totalTime = skillTasks.reduce((sum, t) => sum + t.actualTime, 0);
                    const totalScore = skillTasks.reduce(
                        (sum, t) => sum + (t.taskScore || 0), 0
                    );
                    const activeDays = new Set(
                        skillTasks.map(t => new Date(t.date).toISOString().split('T')[0])
                    ).size;

                    return (
                        <div key={skill} className="bg-dark-400 border border-dark-300 
                            rounded-xl p-4 hover:border-primary-500/30 transition-all">
                            <h4 className="text-dark-100 font-medium capitalize text-sm mb-2">
                                {skill}
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div>
                                    <p className="text-sm font-bold text-primary-400">
                                        {parseFloat(totalScore.toFixed(1))}
                                    </p>
                                    <p className="text-[10px] text-dark-200">Score</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-blue-400">
                                        {formatTime(totalTime)}
                                    </p>
                                    <p className="text-[10px] text-dark-200">Time</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-dark-100">
                                        {skillTasks.length}
                                    </p>
                                    <p className="text-[10px] text-dark-200">Tasks</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-400">
                                        {activeDays}
                                    </p>
                                    <p className="text-[10px] text-dark-200">Days</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskGrid;