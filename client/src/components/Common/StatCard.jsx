import React from 'react';

const StatCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
        primary: 'from-primary-500/20 to-primary-600/5 border-primary-500/30',
        green: 'from-green-500/20 to-green-600/5 border-green-500/30',
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
        orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
        red: 'from-red-500/20 to-red-600/5 border-red-500/30',
        purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} 
            border rounded-xl p-5 transition-all duration-300 
            hover:scale-[1.02] hover:shadow-lg`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-dark-200 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-dark-100 mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-dark-200 text-xs mt-1">{subtitle}</p>
                    )}
                </div>
                {icon && (
                    <span className="text-2xl">{icon}</span>
                )}
            </div>
            {trend && (
                <div className="mt-3 flex items-center gap-1">
                    <span className={`text-xs font-medium ${
                        trend === 'up' ? 'text-green-400' : 
                        trend === 'down' ? 'text-red-400' : 'text-dark-200'
                    }`}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} 
                        {trendValue}
                    </span>
                    <span className="text-dark-200 text-xs">vs last week</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;