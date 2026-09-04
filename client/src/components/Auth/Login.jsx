import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await login(formData);
        
        if (result.success) {
            navigate('/dashboard');
        }
        
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-500 px-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        🚀 Career OS
                    </h1>
                    <p className="text-dark-200">
                        Smart Progress Tracker - Measure Real Growth
                    </p>
                </div>

                {/* Login Form */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-dark-100 mb-6">
                        Welcome Back! 👋
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Login →'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-dark-200 mt-6 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;