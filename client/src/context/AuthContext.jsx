// ============================================
// AUTH CONTEXT
// ============================================
// Global authentication state management
// Login, logout, user info 

import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ===== INITIALIZE =====
    // App load pe check karo ki user logged in hai ya nahi
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const savedUser = localStorage.getItem('user');

                if (token && savedUser) {
                    // Verify token by fetching profile
                    const response = await authService.getProfile();
                    setUser(response.data.user);
                }
            } catch (error) {
                // Token invalid - clear everything
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // ===== REGISTER =====
    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            setUser(response.data.user);
            toast.success('Registration successful! Welcome! 🚀');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    // ===== LOGIN =====
    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.data.user);
            toast.success('Welcome back! 👋');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    // ===== LOGOUT =====
    const logout = () => {
        authService.logout();
        setUser(null);
        toast.success('Logged out successfully');
    };

    // ===== UPDATE PROFILE =====
    const updateProfile = async (data) => {
        try {
            const response = await authService.updateProfile(data);
            setUser(response.data.user);
            toast.success('Profile updated! ✅');
            return { success: true };
        } catch (error) {
            toast.error('Profile update failed');
            return { success: false };
        }
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};