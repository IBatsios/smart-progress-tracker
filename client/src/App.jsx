// ============================================
// MAIN APP COMPONENT
// ============================================
// Routing aur layout setup

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

// Page Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import PlannerPage from './pages/PlannerPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Auth Components
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/Common/LoadingSpinner';

function App() {
    const { user, loading } = useAuth();

    // Initial loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-dark-500 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-500">
            {user ? (
                // ===== AUTHENTICATED LAYOUT =====
                <div className="flex h-screen overflow-hidden">
                    {/* Sidebar - left side navigation */}
                    <Sidebar />
                    
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Top Navbar */}
                        <Navbar />
                        
                        {/* Page Content - scrollable */}
                        <main className="flex-1 overflow-y-auto p-6 bg-dark-500">
                            <Routes>
                                <Route path="/" element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/dashboard" element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/tasks" element={
                                    <ProtectedRoute>
                                        <TasksPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/planner" element={
                                    <ProtectedRoute>
                                        <PlannerPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/analytics" element={
                                    <ProtectedRoute>
                                        <AnalyticsPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="*" element={<Navigate to="/dashboard" />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            ) : (
                // ===== PUBLIC LAYOUT =====
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </div>
    );
}

export default App;