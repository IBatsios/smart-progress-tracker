// ============================================
// HOME PAGE COMPONENT
// ============================================
// Features showcase, hero section, CTA buttons

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    // Features list
    const features = [
        {
            icon: '📊',
            title: 'Weighted Progress',
            description: 'Not just completion tracking. Our weighted scoring system measures actual learning depth based on time, difficulty, and completion quality.',
            color: 'from-primary-500/20 to-primary-600/5'
        },
        {
            icon: '🧠',
            title: 'Skill Analysis',
            description: 'See which skills are strong, medium, or weak. Get a clear picture of where you stand and what needs improvement.',
            color: 'from-green-500/20 to-green-600/5'
        },
        {
            icon: '🔥',
            title: 'Consistency Tracking',
            description: 'Track your streaks, breaks, and recovery patterns. Consistency is the key to real growth.',
            color: 'from-orange-500/20 to-orange-600/5'
        },
        {
            icon: '🎯',
            title: 'Job Readiness Score',
            description: 'A composite score that tells you how job-ready you are based on skills, projects, consistency, and difficulty level.',
            color: 'from-purple-500/20 to-purple-600/5'
        },
        {
            icon: '📈',
            title: 'Visual Dashboards',
            description: 'Beautiful charts, heatmaps, and progress bars that make your progress visible and motivating.',
            color: 'from-blue-500/20 to-blue-600/5'
        },
        {
            icon: '📋',
            title: 'Weekly Planning',
            description: 'Set weekly goals, distribute time across skills, and track planned vs actual performance.',
            color: 'from-cyan-500/20 to-cyan-600/5'
        }
    ];

    // How it works steps
    const steps = [
        { number: '01', title: 'Log Your Tasks', desc: 'Add daily tasks with skill tags, time, difficulty, and completion %' },
        { number: '02', title: 'System Calculates', desc: 'Weighted progress engine scores your work intelligently' },
        { number: '03', title: 'See Real Progress', desc: 'Charts, heatmaps, and insights show your actual growth' },
        { number: '04', title: 'Improve & Grow', desc: 'Weekly reviews and recommendations guide your next steps' }
    ];

    return (
        <div className="min-h-screen bg-dark-500 overflow-x-hidden">
            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center px-6">
                {/* Background gradient effects */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 
                    rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 
                    rounded-full blur-[150px] pointer-events-none" />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-primary-600/10 
                        border border-primary-500/30 rounded-full px-5 py-2 mb-8">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-primary-400 text-sm font-medium">
                            Open Source • Free Forever
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                        <span className="text-dark-100">Stop Being </span>
                        <span className="animated-gradient-text">Busy</span>
                        <br />
                        <span className="text-dark-100">Start </span>
                        <span className="animated-gradient-text">Growing</span>
                        <span className="text-dark-100"> 🚀</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-dark-200 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Smart Progress Tracker measures your <span className="text-primary-400 font-medium">real learning progress</span>, 
                        not just task completion. Know exactly where you stand with 
                        <span className="text-accent-green font-medium"> skill analysis</span>, 
                        <span className="text-accent-blue font-medium"> consistency tracking</span>, and 
                        <span className="text-accent-orange font-medium"> job readiness scoring</span>.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="btn-primary text-lg px-8 py-3.5 rounded-xl 
                                font-semibold shadow-lg shadow-primary-600/25
                                hover:shadow-xl hover:shadow-primary-600/30
                                transform hover:-translate-y-0.5 transition-all"
                        >
                            Get Started Free →
                        </Link>
                        <Link
                            to="/login"
                            className="btn-secondary text-lg px-8 py-3.5 rounded-xl font-semibold"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary-400">100%</p>
                            <p className="text-xs text-dark-200 mt-1">Free & Open</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">15+</p>
                            <p className="text-xs text-dark-200 mt-1">Features</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-orange-400">Real</p>
                            <p className="text-xs text-dark-200 mt-1">Progress</p>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-dark-200 rounded-full p-1">
                        <div className="w-1.5 h-3 bg-primary-400 rounded-full mx-auto 
                            animate-pulse" />
                    </div>
                </div>
            </section>

            {/* ===== PROBLEM SECTION ===== */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark-100 mb-6">
                        The Problem with Current Tools 😤
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                            <p className="text-3xl mb-3">❌</p>
                            <h3 className="text-dark-100 font-semibold mb-2">
                                Task Trackers
                            </h3>
                            <p className="text-dark-200 text-sm">
                                Only track if task is done or not. No skill analysis, 
                                no weighted scoring, no real progress.
                            </p>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                            <p className="text-3xl mb-3">❌</p>
                            <h3 className="text-dark-100 font-semibold mb-2">
                                Habit Trackers
                            </h3>
                            <p className="text-dark-200 text-sm">
                                Track if you did something daily. But spending 5 min vs 
                                3 hours looks the same.
                            </p>
                        </div>
                        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
                            <p className="text-3xl mb-3">✅</p>
                            <h3 className="text-dark-100 font-semibold mb-2">
                                Career OS
                            </h3>
                            <p className="text-dark-200 text-sm">
                                Weighted scoring + skill analysis + consistency + 
                                job readiness = Real Progress Measurement
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="py-20 px-6 bg-dark-600/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-dark-100 mb-4">
                            Powerful Features ⚡
                        </h2>
                        <p className="text-dark-200 max-w-2xl mx-auto">
                            Everything you need to track real learning progress and 
                            become job-ready.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-br ${feature.color} 
                                    border border-dark-300/50 rounded-xl p-6 
                                    hover:border-primary-500/30 transition-all duration-300
                                    hover:transform hover:-translate-y-1 hover:shadow-lg
                                    stagger-item`}
                            >
                                <span className="text-4xl block mb-4">{feature.icon}</span>
                                <h3 className="text-dark-100 font-semibold text-lg mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-dark-200 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-dark-100 mb-4">
                            How It Works 🔄
                        </h2>
                        <p className="text-dark-200">
                            Simple 4-step process to track real progress
                        </p>
                    </div>

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-6 group"
                            >
                                {/* Step Number */}
                                <div className="flex-shrink-0 w-16 h-16 rounded-2xl 
                                    bg-primary-600/20 border border-primary-500/30 
                                    flex items-center justify-center
                                    group-hover:bg-primary-600/40 transition-all duration-300">
                                    <span className="text-primary-400 font-bold text-lg">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Step Content */}
                                <div className="flex-1 pt-2">
                                    <h3 className="text-dark-100 font-semibold text-lg mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-dark-200 text-sm">
                                        {step.desc}
                                    </p>
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute left-8 
                                        w-0.5 h-8 bg-dark-300 mt-16" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FORMULA SECTION ===== */}
            <section className="py-20 px-6 bg-dark-600/50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark-100 mb-8">
                        The Core Formula 🧮
                    </h2>

                    <div className="bg-dark-400 border border-primary-500/30 rounded-2xl 
                        p-8 shadow-xl shadow-primary-500/5">
                        <code className="text-lg md:text-xl font-mono text-primary-400 
                            leading-relaxed block">
                            Task Score = (Time × Difficulty × Completion)
                        </code>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="bg-green-500/10 rounded-lg p-4">
                                <p className="text-green-400 font-bold text-lg">Easy</p>
                                <p className="text-dark-200 text-sm">1.0x weight</p>
                            </div>
                            <div className="bg-yellow-500/10 rounded-lg p-4">
                                <p className="text-yellow-400 font-bold text-lg">Medium</p>
                                <p className="text-dark-200 text-sm">1.5x weight</p>
                            </div>
                            <div className="bg-red-500/10 rounded-lg p-4">
                                <p className="text-red-400 font-bold text-lg">Hard</p>
                                <p className="text-dark-200 text-sm">2.5x weight</p>
                            </div>
                        </div>

                        <p className="text-dark-200 text-sm mt-6">
                            Hard tasks get 2.5x more credit than easy tasks. 
                            This ensures quality work is valued over quantity.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark-100 mb-6">
                        Ready to Track Real Progress? 🚀
                    </h2>
                    <p className="text-dark-200 mb-10 text-lg">
                        Stop fooling yourself with fake productivity. 
                        Start measuring what actually matters.
                    </p>

                    <Link
                        to="/register"
                        className="btn-primary text-lg px-10 py-4 rounded-xl 
                            font-semibold shadow-lg shadow-primary-600/25
                            inline-block"
                    >
                        Start For Free → It's 100% Free
                    </Link>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-dark-300 py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row 
                    items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🚀</span>
                        <span className="text-dark-100 font-semibold">Career OS</span>
                        <span className="text-dark-200 text-sm">- Smart Progress Tracker</span>
                    </div>
                    <p className="text-dark-200 text-sm">
                        Built with ❤️ using React, Node.js & MongoDB
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;