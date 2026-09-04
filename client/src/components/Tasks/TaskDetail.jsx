// ============================================
// TASK DETAIL COMPONENT
// ============================================

import React, { useState, useEffect } from 'react';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';
import { calculateTaskScore } from '../../utils/calculations';
import { formatTime } from '../../utils/helpers';

const TaskDetail = ({ taskId, task: initialTask, onClose, onTaskUpdated }) => {
    const [task, setTask] = useState(initialTask || null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(!initialTask);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!initialTask && taskId) {
            fetchTask();
        }
    }, [taskId]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const response = await taskService.getTask(taskId);
            setTask(response.data.task);
        } catch (error) {
            toast.error('Failed to load task details');
            console.error('Task detail fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Edit mode start
    const startEditing = () => {
        setEditData({
            title: task.title,
            description: task.description || '',
            skill: task.skill,
            category: task.category,
            plannedTime: task.plannedTime,
            actualTime: task.actualTime,
            difficulty: task.difficulty,
            completion: task.completion,
            notes: task.notes || '',
            qualityRating: task.qualityRating || 3
        });
        setIsEditing(true);
    };

    // Edit field update
    const handleEditChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Save changes
    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await taskService.updateTask(task._id, editData);
            setTask(response.data.task);
            setIsEditing(false);
            toast.success('Task updated! ✅');
            if (onTaskUpdated) onTaskUpdated(response.data.task);
        } catch (error) {
            toast.error('Failed to update task');
        } finally {
            setSaving(false);
        }
    };

    // Quick complete
    const handleQuickComplete = async () => {
        try {
            const response = await taskService.updateTask(task._id, { 
                completion: 100,
                actualTime: task.plannedTime // Actual time = planned time
            });
            setTask(response.data.task);
            toast.success('Task completed! 🎉');
            if (onTaskUpdated) onTaskUpdated(response.data.task);
        } catch (error) {
            toast.error('Failed to complete task');
        }
    };

    // Delete task
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        
        try {
            await taskService.deleteTask(task._id);
            toast.success('Task deleted! 🗑️');
            if (onClose) onClose();
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    // Difficulty badge styling
    const getDifficultyStyle = (diff) => {
        const styles = {
            easy: { bg: 'bg-green-500/20', text: 'text-green-400', label: '🟢 Easy (1.0x)' },
            medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '🟡 Medium (1.5x)' },
            hard: { bg: 'bg-red-500/20', text: 'text-red-400', label: '🔴 Hard (2.5x)' }
        };
        return styles[diff] || styles.medium;
    };

    // Category label
    const getCategoryLabel = (cat) => {
        const labels = {
            learning: '📚 Learning',
            practice: '💻 Practice',
            project: '🏗️ Project',
            revision: '🔄 Revision',
            other: '📌 Other'
        };
        return labels[cat] || cat;
    };

    // Completion color
    const getCompletionColor = (pct) => {
        if (pct === 100) return 'text-green-400';
        if (pct >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    // Loading state
    if (loading) {
        return (
            <div className="card animate-pulse">
                <div className="h-6 bg-dark-300 rounded w-3/4 mb-4" />
                <div className="h-4 bg-dark-300 rounded w-1/2 mb-3" />
                <div className="h-4 bg-dark-300 rounded w-full mb-3" />
                <div className="h-20 bg-dark-300 rounded w-full" />
            </div>
        );
    }

    // No task found
    if (!task) {
        return (
            <div className="card text-center py-8">
                <p className="text-4xl mb-3">❓</p>
                <p className="text-dark-200">Task not found</p>
            </div>
        );
    }

    const diffStyle = getDifficultyStyle(task.difficulty);
    const previewScore = isEditing ? calculateTaskScore(editData) : task.taskScore;

    return (
        <div className="card animate-fade-in">
            {/* ===== HEADER ===== */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => handleEditChange('title', e.target.value)}
                            className="input-field text-lg font-semibold"
                        />
                    ) : (
                        <h3 className="text-xl font-semibold text-dark-100">
                            {task.title}
                        </h3>
                    )}
                    <p className="text-dark-200 text-sm mt-1">
                        📅 {new Date(task.date).toLocaleDateString('en-US', {
                            weekday: 'long', year: 'numeric',
                            month: 'long', day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn-primary text-sm px-4 py-1.5"
                            >
                                {saving ? '💾 Saving...' : '💾 Save'}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-dark-200 hover:text-dark-100 text-sm px-3 py-1.5 
                                    bg-dark-500 rounded-lg"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={startEditing}
                                className="text-primary-400 hover:text-primary-300 text-sm 
                                    px-3 py-1.5 bg-primary-500/10 rounded-lg transition-colors"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 
                                    bg-red-500/10 rounded-lg transition-colors"
                            >
                                🗑️
                            </button>
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="text-dark-200 hover:text-dark-100 text-sm p-1.5 
                                        rounded-lg hover:bg-dark-300"
                                >
                                    ✕
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ===== BADGES ROW ===== */}
            <div className="flex flex-wrap gap-2 mb-5">
                {/* Skill Badge */}
                <span className="badge bg-primary-500/20 text-primary-400 text-sm px-3 py-1">
                    🏷️ {isEditing ? (
                        <input
                            type="text"
                            value={editData.skill}
                            onChange={(e) => handleEditChange('skill', e.target.value)}
                            className="bg-transparent border-none outline-none w-20 text-primary-400"
                        />
                    ) : task.skill}
                </span>

                {/* Difficulty Badge */}
                <span className={`badge ${diffStyle.bg} ${diffStyle.text} text-sm px-3 py-1`}>
                    {isEditing ? (
                        <select
                            value={editData.difficulty}
                            onChange={(e) => handleEditChange('difficulty', e.target.value)}
                            className="bg-transparent border-none outline-none text-inherit cursor-pointer"
                        >
                            <option value="easy">🟢 Easy</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="hard">🔴 Hard</option>
                        </select>
                    ) : diffStyle.label}
                </span>

                {/* Category Badge */}
                <span className="badge bg-dark-300 text-dark-200 text-sm px-3 py-1">
                    {isEditing ? (
                        <select
                            value={editData.category}
                            onChange={(e) => handleEditChange('category', e.target.value)}
                            className="bg-transparent border-none outline-none text-inherit cursor-pointer"
                        >
                            <option value="learning">📚 Learning</option>
                            <option value="practice">💻 Practice</option>
                            <option value="project">🏗️ Project</option>
                            <option value="revision">🔄 Revision</option>
                            <option value="other">📌 Other</option>
                        </select>
                    ) : getCategoryLabel(task.category)}
                </span>

                {/* Status Badge */}
                <span className={`badge text-sm px-3 py-1
                    ${task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                      task.status === 'skipped' ? 'bg-red-500/20 text-red-400' :
                      'bg-dark-300 text-dark-200'}`}
                >
                    {task.status === 'completed' ? '✅' : 
                     task.status === 'in-progress' ? '🔄' : 
                     task.status === 'skipped' ? '⏭️' : '⏳'} {task.status}
                </span>
            </div>

            {/* ===== COMPLETION BAR ===== */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-200">Completion</span>
                    <span className={`text-2xl font-bold ${getCompletionColor(
                        isEditing ? editData.completion : task.completion
                    )}`}>
                        {isEditing ? editData.completion : task.completion}%
                    </span>
                </div>

                {isEditing ? (
                    <input
                        type="range"
                        min="0" max="100" step="5"
                        value={editData.completion}
                        onChange={(e) => handleEditChange('completion', parseInt(e.target.value))}
                        className="w-full h-2 bg-dark-300 rounded-lg appearance-none 
                            cursor-pointer accent-primary-500"
                    />
                ) : null}

                <div className="w-full bg-dark-300 rounded-full h-3 mt-2">
                    <div
                        className={`h-3 rounded-full transition-all duration-700
                            ${(isEditing ? editData.completion : task.completion) === 100 
                                ? 'bg-green-500' 
                                : (isEditing ? editData.completion : task.completion) >= 50 
                                ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${isEditing ? editData.completion : task.completion}%` }}
                    />
                </div>

                {/* Quick complete button */}
                {task.completion < 100 && !isEditing && (
                    <button
                        onClick={handleQuickComplete}
                        className="mt-3 w-full bg-green-500/10 border border-green-500/30 
                            text-green-400 rounded-lg py-2 text-sm font-medium
                            hover:bg-green-500/20 transition-all"
                    >
                        ✅ Mark as 100% Complete
                    </button>
                )}
            </div>

            {/* ===== TIME & SCORE METRICS ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="bg-dark-500 rounded-xl p-4 text-center">
                    <p className="text-xs text-dark-200 mb-1">⏱️ Planned</p>
                    {isEditing ? (
                        <input
                            type="number"
                            value={editData.plannedTime}
                            onChange={(e) => handleEditChange('plannedTime', parseInt(e.target.value) || 0)}
                            className="input-field text-center text-sm py-1"
                            min="1" max="720"
                        />
                    ) : (
                        <p className="text-lg font-bold text-blue-400">
                            {formatTime(task.plannedTime)}
                        </p>
                    )}
                </div>

                <div className="bg-dark-500 rounded-xl p-4 text-center">
                    <p className="text-xs text-dark-200 mb-1">⏰ Actual</p>
                    {isEditing ? (
                        <input
                            type="number"
                            value={editData.actualTime}
                            onChange={(e) => handleEditChange('actualTime', parseInt(e.target.value) || 0)}
                            className="input-field text-center text-sm py-1"
                            min="0" max="720"
                        />
                    ) : (
                        <p className="text-lg font-bold text-orange-400">
                            {formatTime(task.actualTime)}
                        </p>
                    )}
                </div>

                <div className="bg-dark-500 rounded-xl p-4 text-center">
                    <p className="text-xs text-dark-200 mb-1">📊 Score</p>
                    <p className="text-lg font-bold text-primary-400">
                        {previewScore}
                    </p>
                    {isEditing && previewScore !== task.taskScore && (
                        <p className="text-xs text-dark-200 mt-0.5">
                            was: {task.taskScore}
                        </p>
                    )}
                </div>

                <div className="bg-dark-500 rounded-xl p-4 text-center">
                    <p className="text-xs text-dark-200 mb-1">⚡ Efficiency</p>
                    <p className={`text-lg font-bold
                        ${task.plannedTime > 0 && task.actualTime <= task.plannedTime
                            ? 'text-green-400' : 'text-yellow-400'}`}
                    >
                        {task.plannedTime > 0 
                            ? Math.round((task.actualTime / task.plannedTime) * 100) + '%'
                            : 'N/A'}
                    </p>
                </div>
            </div>

            {/* ===== DESCRIPTION ===== */}
            {(task.description || isEditing) && (
                <div className="mb-4">
                    <label className="text-sm text-dark-200 font-medium block mb-1">
                        📝 Description
                    </label>
                    {isEditing ? (
                        <textarea
                            value={editData.description}
                            onChange={(e) => handleEditChange('description', e.target.value)}
                            className="input-field resize-none"
                            rows="3"
                            placeholder="Add task description..."
                        />
                    ) : (
                        <p className="text-dark-200 text-sm bg-dark-500 rounded-lg p-3">
                            {task.description || 'No description'}
                        </p>
                    )}
                </div>
            )}

            {/* ===== NOTES ===== */}
            <div className="mb-4">
                <label className="text-sm text-dark-200 font-medium block mb-1">
                    💬 Notes
                </label>
                {isEditing ? (
                    <textarea
                        value={editData.notes}
                        onChange={(e) => handleEditChange('notes', e.target.value)}
                        className="input-field resize-none"
                        rows="2"
                        placeholder="Add notes..."
                        maxLength={500}
                    />
                ) : (
                    <p className="text-dark-200 text-sm bg-dark-500 rounded-lg p-3">
                        {task.notes || 'No notes added'}
                    </p>
                )}
            </div>

            {/* ===== QUALITY RATING ===== */}
            {isEditing && (
                <div className="mb-4">
                    <label className="text-sm text-dark-200 font-medium block mb-2">
                        ⭐ Quality Rating
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleEditChange('qualityRating', star)}
                                className={`text-2xl transition-all duration-200
                                    ${star <= (editData.qualityRating || 0)
                                        ? 'text-yellow-400 scale-110'
                                        : 'text-dark-300 hover:text-dark-200'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== META INFO ===== */}
            <div className="border-t border-dark-300 pt-3 mt-3">
                <div className="flex flex-wrap gap-4 text-xs text-dark-200">
                    <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                    {task.updatedAt !== task.createdAt && (
                        <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
                    )}
                    <span>ID: {task._id}</span>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;