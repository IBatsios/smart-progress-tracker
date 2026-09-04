import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="bg-dark-600/80 backdrop-blur-lg border-b border-dark-300 
            px-6 py-3 flex items-center justify-between sticky top-0 z-10">
            <div>
                <p className="text-dark-200 text-sm">{today}</p>
                <h2 className="text-lg font-semibold text-dark-100">
                    Hello, {user?.name?.split(' ')[0]}! 👋
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Daily Target Badge */}
                <div className="bg-primary-600/20 border border-primary-500/30 
                    rounded-full px-4 py-1.5 text-sm text-primary-400">
                    🎯 Target: {user?.dailyTargetHours}h/day
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="text-dark-200 hover:text-red-400 text-sm 
                        font-medium transition-colors px-3 py-1.5 
                        rounded-lg hover:bg-red-500/10"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;