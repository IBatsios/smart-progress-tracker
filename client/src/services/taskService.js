import api from './api';

const taskService = {
    // Create task
    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    // Get tasks with filters
    getTasks: async (params = {}) => {
        const response = await api.get('/tasks', { params });
        return response.data;
    },

    // Get today's tasks
    getTodayTasks: async () => {
        const response = await api.get('/tasks/today');
        return response.data;
    },

    // Get single task
    getTask: async (id) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    // Update task
    updateTask: async (id, data) => {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data;
    },

    // Delete task
    deleteTask: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};

export default taskService;