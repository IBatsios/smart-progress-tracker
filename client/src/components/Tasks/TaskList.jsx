import React from 'react';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
    const getDifficultyBadge = (difficulty) => {
        const classes = {
            easy: 'badge-easy',
            medium: 'badge-medium',
            hard: 'badge-hard'
        };
        const labels = {
            easy: '🟢 Easy',
            medium: '🟡 Medium',
            hard: '🔴 Hard'
        };
        return <span className={`badge ${classes[difficulty]}`}>{labels[difficulty]}</span>;
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        
        try {
            await taskService.deleteTask(id);
            toast.success('Task deleted! 🗑️');
            if (onTaskDeleted) onTaskDeleted(id);
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const handleQuickUpdate = async (id, field, value) => {
        try {
            const result = await taskService.updateTask(id, { [field]: value });
            toast.success('Task updated!');
            if (onTaskUpdated) onTaskUpdated(result.data.task);
        } catch (error) {
            toast.error('Update failed');
        }
    };

    if (!tasks || tasks.length === 0) {
        return (
            <div className="card text-center py-10">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-dark-200">No tasks found. Start logging your work!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task, index) => (
                <div
                    key={task._id}
                    className="card hover:border-primary-500/50 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="flex items-start justify-between gap-4">
                        {/* Left: Task Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-dark-100 font-medium">{task.title}</h4>
                                {getDifficultyBadge(task.difficulty)}
                                <span className="badge bg-primary-500/20 text-primary-400">
                                    {task.skill}
                                </span>
                            </div>

                            {/* Metrics Row */}
                            <div className="flex flex-wrap gap-4 text-sm text-dark-200">
                                <span>⏱️ {task.plannedTime}min planned</span>
                                <span>⏰ {task.actualTime}min actual</span>
                                <span>📊 Score: {task.taskScore}</span>
                                <span>📅 {new Date(task.date).toLocaleDateString()}</span>
                            </div>

                            {task.notes && (
                                <p className="text-xs text-dark-200 mt-2 italic">
                                    💬 {task.notes}
                                </p>
                            )}
                        </div>

                        {/* Right: Completion & Actions */}
                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                            {/* Completion Circle */}
                            <div className={`text-2xl font-bold 
                                ${task.completion === 100 ? 'text-green-400' :
                                  task.completion >= 50 ? 'text-yellow-400' : 'text-red-400'}`}
                            >
                                {task.completion}%
                            </div>

                            {/* Quick Complete Button */}
                            {task.completion < 100 && (
                                <button
                                    onClick={() => handleQuickUpdate(task._id, 'completion', 100)}
                                    className="text-xs bg-green-500/20 text-green-400 px-3 py-1 
                                        rounded-full hover:bg-green-500/30 transition-colors"
                                >
                                    ✅ Mark Complete
                                </button>
                            )}

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(task._id)}
                                className="text-xs text-dark-200 hover:text-red-400 
                                    transition-colors"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-dark-300 rounded-full h-1.5 mt-3">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-500
                                ${task.completion === 100 ? 'bg-green-500' :
                                  task.completion >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${task.completion}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;