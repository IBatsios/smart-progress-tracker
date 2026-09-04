// ============================================
// CUSTOM HOOK: useProgress
// ============================================

import { useState, useEffect, useCallback } from 'react';
import progressService from '../services/progressService';

export const useProgress = () => {
    const [weeklyProgress, setWeeklyProgress] = useState(null);
    const [dailyProgress, setDailyProgress] = useState(null);
    const [skillAnalysis, setSkillAnalysis] = useState(null);
    const [consistency, setConsistency] = useState(null);
    const [jobReadiness, setJobReadiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all progress data
    const fetchAllProgress = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const results = await Promise.allSettled([
                progressService.getWeeklyProgress(),
                progressService.getDailyProgress(),
                progressService.getSkillAnalysis(30),
                progressService.getConsistency(30),
                progressService.getJobReadiness()
            ]);

            if (results[0].status === 'fulfilled') 
                setWeeklyProgress(results[0].value.data.progress);
            if (results[1].status === 'fulfilled') 
                setDailyProgress(results[1].value.data.progress);
            if (results[2].status === 'fulfilled') 
                setSkillAnalysis(results[2].value.data.analysis);
            if (results[3].status === 'fulfilled') 
                setConsistency(results[3].value.data.consistency);
            if (results[4].status === 'fulfilled') 
                setJobReadiness(results[4].value.data.readiness);

        } catch (err) {
            setError('Failed to fetch progress data');
            console.error('useProgress error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllProgress();
    }, [fetchAllProgress]);

    // Fetch specific data
    const fetchWeekly = async (weekStart) => {
        try {
            const res = await progressService.getWeeklyProgress(weekStart);
            setWeeklyProgress(res.data.progress);
            return res.data.progress;
        } catch (err) {
            console.error('Weekly progress error:', err);
        }
    };

    const fetchSkillAnalysis = async (days = 30) => {
        try {
            const res = await progressService.getSkillAnalysis(days);
            setSkillAnalysis(res.data.analysis);
            return res.data.analysis;
        } catch (err) {
            console.error('Skill analysis error:', err);
        }
    };

    return {
        weeklyProgress,
        dailyProgress,
        skillAnalysis,
        consistency,
        jobReadiness,
        loading,
        error,
        fetchAllProgress,
        fetchWeekly,
        fetchSkillAnalysis,
        refresh: fetchAllProgress
    };
};