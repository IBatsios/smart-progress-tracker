import api from './api';

const progressService = {
    // Daily progress
    getDailyProgress: async (date) => {
        const response = await api.get('/progress/daily', { params: { date } });
        return response.data;
    },

    // Weekly progress
    getWeeklyProgress: async (weekStart) => {
        const response = await api.get('/progress/weekly', { params: { weekStart } });
        return response.data;
    },

    // Goal vs Actual
    getGoalVsActual: async (weekStart) => {
        const response = await api.get('/progress/goal-vs-actual', { params: { weekStart } });
        return response.data;
    },

    // Skill analysis
    getSkillAnalysis: async (days = 30) => {
        const response = await api.get('/analytics/skill-analysis', { params: { days } });
        return response.data;
    },

    // Skill heatmap
    getSkillHeatmap: async (days = 30) => {
        const response = await api.get('/analytics/skill-heatmap', { params: { days } });
        return response.data;
    },

    // Consistency
    getConsistency: async (days = 30) => {
        const response = await api.get('/analytics/consistency', { params: { days } });
        return response.data;
    },

    // Job readiness
    getJobReadiness: async () => {
        const response = await api.get('/analytics/job-readiness');
        return response.data;
    },

    // Monthly summary
    getMonthlySummary: async (month, year) => {
        const response = await api.get('/analytics/monthly-summary', { 
            params: { month, year } 
        });
        return response.data;
    },

    // Weekly review
    getWeeklyReview: async () => {
        const response = await api.get('/analytics/weekly-review');
        return response.data;
    },

    // Weekly goal
    createWeeklyGoal: async (data) => {
        const response = await api.post('/planner/weekly-goal', data);
        return response.data;
    },

    getWeeklyGoal: async (weekStart) => {
        const response = await api.get('/planner/weekly-goal', { params: { weekStart } });
        return response.data;
    }
};

export default progressService;