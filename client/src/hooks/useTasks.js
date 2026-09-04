// ============================================
// CUSTOM HOOK: useTasks
// ============================================

import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

export const useTasks = (initialDate = null) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(
        initialDate || new Date().toISOString().split('T')[0]
    );

    // Fetch tasks for selected date
    const fetchTasks = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await taskService.getTasks({
                date: params.date || date,
                ...params
            });
            setTasks(response.data.tasks);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
            console.error('useTasks fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [date]);

    // Initial fetch aur date change pe refetch
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Add new task
    const addTask = async (taskData) => {
        try {
            const response = await taskService.createTask(taskData);
            const newTask = response.data.task;
            setTasks(prev => [newTask, ...prev]);
            toast.success('Task added! 📝');
            return { success: true, task: newTask };
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add task');
            return { success: false, error: err.response?.data?.message };
        }
    };

    // Update task
    const updateTask = async (id, updateData) => {
        try {
            const response = await taskService.updateTask(id, updateData);
            const updatedTask = response.data.task;
            setTasks(prev => 
                prev.map(t => t._id === id ? updatedTask : t)
            );
            toast.success('Task updated! ✅');
            return { success: true, task: updatedTask };
        } catch (err) {
            toast.error('Failed to update task');
            return { success: false };
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            await taskService.deleteTask(id);
            setTasks(prev => prev.filter(t => t._id !== id));
            toast.success('Task deleted! 🗑️');
            return { success: true };
        } catch (err) {
            toast.error('Failed to delete task');
            return { success: false };
        }
    };

    // Quick complete
    const completeTask = async (id) => {
        return updateTask(id, { completion: 100 });
    };

    // Summary calculations
    const summary = {
        total: tasks.length,
        completed: tasks.filter(t => t.completion === 100).length,
        inProgress: tasks.filter(t => t.completion > 0 && t.completion < 100).length,
        pending: tasks.filter(t => t.completion === 0).length,
        totalPlannedTime: tasks.reduce((sum, t) => sum + t.plannedTime, 0),
        totalActualTime: tasks.reduce((sum, t) => sum + t.actualTime, 0),
        totalScore: parseFloat(
            tasks.reduce((sum, t) => sum + t.taskScore, 0).toFixed(2)
        )
    };

    return {
        tasks,
        loading,
        error,
        date,
        setDate,
        summary,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        refresh: fetchTasks
    };
};