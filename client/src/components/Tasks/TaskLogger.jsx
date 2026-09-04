// ============================================
// TASK LOGGER COMPONENT
// ============================================
// Daily task entry form

import React, { useState } from 'react';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';

const TaskLogger = ({ onTaskAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skill: '',
        category: 'learning',
        plannedTime: 60,
        actualTime: 0,
        difficulty: 'medium',
        completion: 0,
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Common skills for quick selection
    const commonSkills = [
        'React', 'Node.js', 'Python', 'JavaScript', 'DSA',
        'MongoDB', 'CSS', 'TypeScript', 'System Design', 'SQL'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['plannedTime', 'actualTime', 'completion'].includes(name) 
                ? parseInt(value) || 0 
                : value
        }));
    };

    const handleSkillClick = (skill) => {
        setFormData(prev => ({ ...prev, skill }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await taskService.createTask(formData);
            toast.success('Task logged successfully! 📝');
            
            // Form reset karo
            setFormData({
                title: '',
                description: '',
                skill: '',
                category: 'learning',
                plannedTime: 60,
                actualTime: 0,
                difficulty: 'medium',
                completion: 0,
                notes: '',
                date: new Date().toISOString().split('T')[0]
            });

            // Parent component ko notify karo
            if (onTaskAdded) onTaskAdded(result.data.task);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card animate-fade-in">
            <h3 className="text-lg font-semibold text-dark-100 mb-5 flex items-center gap-2">
                📝 Log New Task
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Title & Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="label">Task Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Build REST API with Express"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">Date *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                </div>

                {/* Row 2: Skill Tags */}
                <div>
                    <label className="label">Skill Tag *</label>
                    <input
                        type="text"
                        name="skill"
                        value={formData.skill}
                        onChange={handleChange}
                        className="input-field mb-2"
                        placeholder="e.g., React, Node.js, DSA"
                        required
                    />
                    {/* Quick skill buttons */}
                    <div className="flex flex-wrap gap-2">
                        {commonSkills.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => handleSkillClick(skill)}
                                className={`px-3 py-1 rounded-full text-xs font-medium 
                                    transition-all duration-200
                                    ${formData.skill === skill
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-dark-500 text-dark-200 hover:bg-dark-300 border border-dark-300'
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Row 3: Category & Difficulty */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="label">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="select-field"
                        >
                            <option value="learning">📚 Learning</option>
                            <option value="practice">💻 Practice</option>
                            <option value="project">🏗️ Project</option>
                            <option value="revision">🔄 Revision</option>
                            <option value="other">📌 Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Difficulty *</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="select-field"
                        >
                            <option value="easy">🟢 Easy (1x)</option>
                            <option value="medium">🟡 Medium (1.5x)</option>
                            <option value="hard">🔴 Hard (2.5x)</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Planned Time (min) *</label>
                        <input
                            type="number"
                            name="plannedTime"
                            value={formData.plannedTime}
                            onChange={handleChange}
                            className="input-field"
                            min="1"
                            max="720"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Actual Time (min)</label>
                        <input
                            type="number"
                            name="actualTime"
                            value={formData.actualTime}
                            onChange={handleChange}
                            className="input-field"
                            min="0"
                            max="720"
                        />
                    </div>
                </div>

                {/* Row 4: Completion Slider */}
                <div>
                    <label className="label">
                        Completion: {formData.completion}%
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            name="completion"
                            value={formData.completion}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            step="5"
                            className="flex-1 h-2 bg-dark-300 rounded-lg appearance-none 
                                cursor-pointer accent-primary-500"
                        />
                        <span className={`text-sm font-bold w-12 text-right
                            ${formData.completion === 100 ? 'text-green-400' :
                              formData.completion >= 50 ? 'text-yellow-400' : 'text-red-400'}`}
                        >
                            {formData.completion}%
                        </span>
                    </div>
                    {/* Progress bar visual */}
                    <div className="w-full bg-dark-300 rounded-full h-2 mt-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300
                                ${formData.completion === 100 ? 'bg-green-500' :
                                  formData.completion >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${formData.completion}%` }}
                        />
                    </div>
                </div>

                {/* Row 5: Notes */}
                <div>
                    <label className="label">Notes (Optional)</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="input-field resize-none"
                        rows="2"
                        placeholder="Any additional notes about this task..."
                        maxLength={500}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white 
                                rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        '✅ Log Task'
                    )}
                </button>
            </form>
        </div>
    );
};

export default TaskLogger;