import api from './api';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Login
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Get profile
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Update profile
    updateProfile: async (data) => {
        const response = await api.put('/auth/profile', data);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;