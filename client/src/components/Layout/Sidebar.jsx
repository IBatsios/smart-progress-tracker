import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();

    const navItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/tasks', icon: '📝', label: 'Tasks' },
        { path: '/planner', icon: '🎯', label: 'Planner' },
        { path: '/analytics', icon: '📈', label: 'Analytics' },
    ];

    return (
        <aside className={`bg-dark-600 border-r border-dark-300 flex flex-col
            transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
        >
            {/* Logo */}
            <div className="p-4 border-b border-dark-300 flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                {!collapsed && (
                    <div>
                        <h1 className="text-lg font-bold gradient-text">Career OS</h1>
                        <p className="text-xs text-dark-200">Smart Progress Tracker</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2.5 rounded-lg
                            transition-all duration-200 group
                            ${isActive 
                                ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-500' 
                                : 'text-dark-200 hover:bg-dark-400 hover:text-dark-100'
                            }
                        `}
                    >
                        <span className="text-lg">{item.icon}</span>
                        {!collapsed && (
                            <span className="font-medium text-sm">{item.label}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-3 border-t border-dark-300 text-dark-200 
                    hover:text-dark-100 hover:bg-dark-400 transition-all"
            >
                {collapsed ? '→' : '← Collapse'}
            </button>

            {/* User Info */}
            {!collapsed && (
                <div className="p-4 border-t border-dark-300">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600 
                            flex items-center justify-center text-white font-medium text-sm">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-dark-100">
                                {user?.name}
                            </p>
                            <p className="text-xs text-dark-200">
                                {user?.careerGoal || 'Set your goal'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;