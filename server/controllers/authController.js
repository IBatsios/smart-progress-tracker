// ============================================
// AUTH CONTROLLER
// ============================================
// Registration, Login, aur Profile management

const User = require('../models/User');

// ============================================
// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
// ============================================
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, skills, careerGoal, dailyTargetHours } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            skills: skills || [],
            careerGoal: careerGoal || '',
            dailyTargetHours: dailyTargetHours || 4
        });

        // JWT token generate 
        const token = user.generateAuthToken();

        // Success response
        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome aboard! 🚀',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    skills: user.skills,
                    careerGoal: user.careerGoal,
                    dailyTargetHours: user.dailyTargetHours,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
// ============================================
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Password match karo
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Token generate karo
        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Login successful! 👋',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    skills: user.skills,
                    careerGoal: user.careerGoal,
                    dailyTargetHours: user.dailyTargetHours
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private (token required)
// ============================================
exports.getMe = async (req, res, next) => {
    try {
        // req.user auth middleware ne set kiya hai
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    skills: user.skills,
                    careerGoal: user.careerGoal,
                    dailyTargetHours: user.dailyTargetHours,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================
// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
// ============================================
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, skills, careerGoal, dailyTargetHours } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (skills) updateData.skills = skills;
        if (careerGoal !== undefined) updateData.careerGoal = careerGoal;
        if (dailyTargetHours) updateData.dailyTargetHours = dailyTargetHours;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully! ✅',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    skills: user.skills,
                    careerGoal: user.careerGoal,
                    dailyTargetHours: user.dailyTargetHours
                }
            }
        });

    } catch (error) {
        next(error);
    }
};