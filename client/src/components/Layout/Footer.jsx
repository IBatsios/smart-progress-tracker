// ============================================
// FOOTER COMPONENT
// ============================================
// Application ka footer - credits, links, info

import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark-600 border-t border-dark-300 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🚀</span>
                            <div>
                                <h3 className="text-dark-100 font-bold text-lg">
                                    Career OS
                                </h3>
                                <p className="text-dark-200 text-xs">
                                    Smart Progress Tracker
                                </p>
                            </div>
                        </div>
                        <p className="text-dark-200 text-sm leading-relaxed">
                            Measure your real learning progress, not just activity. 
                            Track skills, consistency, and job readiness all in one place.
                        </p>
                    </div>

                    {/* Features Links */}
                    <div>
                        <h4 className="text-dark-100 font-semibold mb-3 text-sm uppercase 
                            tracking-wider">
                            Features
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { icon: '📊', label: 'Weighted Progress' },
                                { icon: '🧠', label: 'Skill Analysis' },
                                { icon: '🔥', label: 'Consistency Tracking' },
                                { icon: '🎯', label: 'Job Readiness Score' },
                                { icon: '📈', label: 'Visual Dashboards' },
                                { icon: '📋', label: 'Weekly Planning' }
                            ].map((item, i) => (
                                <li key={i} className="text-dark-200 text-sm flex items-center gap-2
                                    hover:text-primary-400 transition-colors cursor-default">
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h4 className="text-dark-100 font-semibold mb-3 text-sm uppercase 
                            tracking-wider">
                            Built With
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {[
                                'React', 'Vite', 'Tailwind CSS', 'Recharts',
                                'Node.js', 'Express.js', 'MongoDB', 'JWT'
                            ].map((tech, i) => (
                                <span
                                    key={i}
                                    className="bg-dark-400 border border-dark-300 
                                        rounded-full px-3 py-1 text-xs text-dark-200
                                        hover:border-primary-500/30 hover:text-primary-400
                                        transition-all cursor-default"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Formula */}
                        <div className="mt-4 bg-dark-500/50 rounded-lg p-3 
                            border border-dark-300/50">
                            <p className="text-xs text-dark-200 font-mono">
                                <span className="text-primary-400">Score</span> = 
                                Time × Difficulty × Completion
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dark-300 pt-4">
                    <div className="flex flex-col md:flex-row items-center 
                        justify-between gap-3">
                        {/* Copyright */}
                        <p className="text-dark-200 text-xs text-center md:text-left">
                            © {currentYear} Smart Progress Tracker (Career OS). 
                            All rights reserved.
                        </p>

                        {/* Made with love */}
                        <p className="text-dark-200 text-xs flex items-center gap-1">
                            Made with 
                            <span className="text-red-400 animate-pulse">❤️</span> 
                            for developers who want to actually grow
                        </p>

                        {/* Version */}
                        <div className="flex items-center gap-2">
                            <span className="bg-primary-600/20 text-primary-400 
                                text-xs px-2 py-0.5 rounded-full font-mono">
                                v1.0.0
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;