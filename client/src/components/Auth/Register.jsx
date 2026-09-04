import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        careerGoal: '',
        dailyTargetHours: 4
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            careerGoal: formData.careerGoal,
            dailyTargetHours: parseInt(formData.dailyTargetHours)
        });

        if (result.success) {
            navigate('/dashboard');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-500 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        🚀 Career OS
                    </h1>
                    <p className="text-dark-200">
                        Start tracking your real progress today
                    </p>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold text-dark-100 mb-6">
                        Create Account ✨
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 
                            px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="John Doe"
                                required
                            />
                        </div>

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

                        <div className="grid grid-cols-2 gap-3">
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
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="label">Confirm</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Career Goal (Optional)</label>
                            <input
                                type="text"
                                name="careerGoal"
                                value={formData.careerGoal}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Full Stack Developer"
                            />
                        </div>

                        <div>
                            <label className="label">Daily Target Hours</label>
                            <select
                                name="dailyTargetHours"
                                value={formData.dailyTargetHours}
                                onChange={handleChange}
                                className="select-field"
                            >
                                {[1,2,3,4,5,6,7,8,10,12].map(h => (
                                    <option key={h} value={h}>{h} hours/day</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account →'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-dark-200 mt-6 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;