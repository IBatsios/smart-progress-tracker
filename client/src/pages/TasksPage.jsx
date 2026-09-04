import React, { useState, useEffect } from 'react';
import TaskLogger from '../components/Tasks/TaskLogger';
import TaskList from '../components/Tasks/TaskList';
import taskService from '../services/taskService';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        date: new Date().toISOString().split('T')[0],
        skill: '',
        difficulty: ''
    });
    const [showLogger, setShowLogger] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filter.date) params.date = filter.date;
            if (filter.skill) params.skill = filter.skill;
            if (filter.difficulty) params.difficulty = filter.difficulty;

            const response = await taskService.getTasks(params);
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Tasks fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskAdded = (newTask) => {
        setTasks(prev => [newTask, ...prev]);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    };

    const handleTaskDeleted = (deletedId) => {
        setTasks(prev => prev.filter(t => t._id !== deletedId));
    };

    // Date navigation helpers
    const goToPrevDay = () => {
        const prevDay = new Date(filter.date);
        prevDay.setDate(prevDay.getDate() - 1);
        setFilter(prev => ({ ...prev, date: prevDay.toISOString().split('T')[0] }));
    };

    const goToNextDay = () => {
        const nextDay = new Date(filter.date);
        nextDay.setDate(nextDay.getDate() + 1);
        setFilter(prev => ({ ...prev, date: nextDay.toISOString().split('T')[0] }));
    };

    const goToToday = () => {
        setFilter(prev => ({ 
            ...prev, 
            date: new Date().toISOString().split('T')[0] 
        }));
    };

    // Check if selected date is today
    const isToday = filter.date === new Date().toISOString().split('T')[0];

    // Calculate today's summary
    const todaySummary = {
        total: tasks.length,
        completed: tasks.filter(t => t.completion === 100).length,
        totalTime: tasks.reduce((sum, t) => sum + t.actualTime, 0),
        totalScore: tasks.reduce((sum, t) => sum + t.taskScore, 0).toFixed(2),
        plannedTime: tasks.reduce((sum, t) => sum + t.plannedTime, 0)
    };

    return (
        <div className="space-y-6">
            {/* ===== PAGE HEADER ===== */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">📝 Task Manager</h1>
                    <p className="text-dark-200 text-sm mt-1">
                        Log, track and manage your daily learning tasks
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex bg-dark-400 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 rounded text-sm transition-all
                                ${viewMode === 'list' 
                                    ? 'bg-primary-600 text-white' 
                                    : 'text-dark-200 hover:text-dark-100'}`}
                        >
                            📋 List
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1 rounded text-sm transition-all
                                ${viewMode === 'grid' 
                                    ? 'bg-primary-600 text-white' 
                                    : 'text-dark-200 hover:text-dark-100'}`}
                        >
                            📊 Grid
                        </button>
                    </div>

                    {/* Add Task Toggle */}
                    <button
                        onClick={() => setShowLogger(!showLogger)}
                        className="btn-primary text-sm"
                    >
                        {showLogger ? '✕ Close Form' : '+ Add Task'}
                    </button>
                </div>
            </div>

            {/* ===== TASK LOGGER FORM ===== */}
            {showLogger && (
                <TaskLogger onTaskAdded={handleTaskAdded} />
            )}

            {/* ===== DATE NAVIGATION & FILTERS ===== */}
            <div className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Date Navigation */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={goToPrevDay}
                            className="p-2 bg-dark-500 rounded-lg text-dark-200 
                                hover:text-dark-100 hover:bg-dark-300 transition-all"
                        >
                            ← Prev
                        </button>

                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={filter.date}
                                onChange={(e) => setFilter(prev => ({ 
                                    ...prev, date: e.target.value 
                                }))}
                                className="input-field w-auto"
                            />
                            {!isToday && (
                                <button
                                    onClick={goToToday}
                                    className="text-xs text-primary-400 hover:text-primary-300
                                        bg-primary-500/10 px-3 py-1.5 rounded-lg font-medium"
                                >
                                    Today
                                </button>
                            )}
                        </div>

                        <button
                            onClick={goToNextDay}
                            className="p-2 bg-dark-500 rounded-lg text-dark-200 
                                hover:text-dark-100 hover:bg-dark-300 transition-all"
                        >
                            Next →
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <select
                            value={filter.difficulty}
                            onChange={(e) => setFilter(prev => ({ 
                                ...prev, difficulty: e.target.value 
                            }))}
                            className="select-field w-auto text-sm"
                        >
                            <option value="">All Difficulty</option>
                            <option value="easy">🟢 Easy</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="hard">🔴 Hard</option>
                        </select>

                        <input
                            type="text"
                            value={filter.skill}
                            onChange={(e) => setFilter(prev => ({ 
                                ...prev, skill: e.target.value 
                            }))}
                            className="input-field w-auto text-sm"
                            placeholder="🔍 Filter by skill..."
                        />

                        {(filter.skill || filter.difficulty) && (
                            <button
                                onClick={() => setFilter(prev => ({ 
                                    ...prev, skill: '', difficulty: '' 
                                }))}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                ✕ Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Day Summary Bar */}
                <div className="grid grid-cols-5 gap-3 mt-4 pt-4 border-t border-dark-300">
                    <div className="text-center">
                        <p className="text-lg font-bold text-dark-100">
                            {todaySummary.total}
                        </p>
                        <p className="text-xs text-dark-200">Total Tasks</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-green-400">
                            {todaySummary.completed}
                        </p>
                        <p className="text-xs text-dark-200">Completed</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-blue-400">
                            {Math.round(todaySummary.plannedTime / 60 * 10) / 10}h
                        </p>
                        <p className="text-xs text-dark-200">Planned</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-orange-400">
                            {Math.round(todaySummary.totalTime / 60 * 10) / 10}h
                        </p>
                        <p className="text-xs text-dark-200">Actual</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-primary-400">
                            {todaySummary.totalScore}
                        </p>
                        <p className="text-xs text-dark-200">Score</p>
                    </div>
                </div>
            </div>

            {/* ===== TASK LIST / GRID ===== */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="large" text="Loading tasks..." />
                </div>
            ) : viewMode === 'list' ? (
                <TaskList
                    tasks={tasks}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                />
            ) : (
                <TaskGrid
                    tasks={tasks}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                />
            )}
        </div>
    );
};

// ============================================
// TASK GRID VIEW COMPONENT
// ============================================
// Grid view - cards layout for visual overview
const TaskGrid = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="card text-center py-10">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-dark-200">No tasks found for this day</p>
            </div>
        );
    }

    const getDifficultyColor = (diff) => {
        if (diff === 'easy') return 'border-green-500/50 bg-green-500/5';
        if (diff === 'medium') return 'border-yellow-500/50 bg-yellow-500/5';
        return 'border-red-500/50 bg-red-500/5';
    };

    const getCompletionColor = (pct) => {
        if (pct === 100) return 'text-green-400';
        if (pct >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task, index) => (
                <div
                    key={task._id}
                    className={`rounded-xl border p-5 transition-all duration-300 
                        hover:scale-[1.02] hover:shadow-lg animate-fade-in
                        ${getDifficultyColor(task.difficulty)}`}
                    style={{ animationDelay: `${index * 80}ms` }}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <h4 className="text-dark-100 font-medium text-sm leading-tight flex-1 mr-2">
                            {task.title}
                        </h4>
                        <span className={`text-xl font-bold ${getCompletionColor(task.completion)}`}>
                            {task.completion}%
                        </span>
                    </div>

                    {/* Skill Badge */}
                    <div className="mb-3">
                        <span className="badge bg-primary-500/20 text-primary-400">
                            {task.skill}
                        </span>
                        <span className={`badge ml-2 ${
                            task.difficulty === 'easy' ? 'badge-easy' :
                            task.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
                        }`}>
                            {task.difficulty === 'easy' ? '🟢' : 
                             task.difficulty === 'medium' ? '🟡' : '🔴'} {task.difficulty}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-dark-300/50 rounded-full h-2 mb-3">
                        <div
                            className={`h-2 rounded-full transition-all duration-500
                                ${task.completion === 100 ? 'bg-green-500' :
                                  task.completion >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${task.completion}%` }}
                        />
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-dark-500/50 rounded-lg py-2">
                            <p className="text-xs text-dark-200">Planned</p>
                            <p className="text-sm font-medium text-dark-100">
                                {task.plannedTime}m
                            </p>
                        </div>
                        <div className="bg-dark-500/50 rounded-lg py-2">
                            <p className="text-xs text-dark-200">Actual</p>
                            <p className="text-sm font-medium text-dark-100">
                                {task.actualTime}m
                            </p>
                        </div>
                        <div className="bg-dark-500/50 rounded-lg py-2">
                            <p className="text-xs text-dark-200">Score</p>
                            <p className="text-sm font-bold text-primary-400">
                                {task.taskScore}
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    {task.notes && (
                        <p className="text-xs text-dark-200 mt-3 italic border-t 
                            border-dark-300/50 pt-2">
                            💬 {task.notes}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TasksPage;