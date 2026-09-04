// ============================================
// USER MODEL
// ============================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,        
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },

    // Email 
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,       // Duplicate emails not allowed 
        lowercase: true,    // Always lowercase for consistency
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },

    // Password 
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false       // By default queries
    },


    skills: [{
        type: String,
        trim: true
    }],

    // Career goal
    careerGoal: {
        type: String,
        trim: true,
        default: ''
    },

    // Daily target hours 
    dailyTargetHours: {
        type: Number,
        default: 4,
        min: [1, 'Minimum 1 hour target'],
        max: [16, 'Maximum 16 hours target']
    },

    // Account creation date
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// PRE-SAVE MIDDLEWARE - PASSWORD HASHING
// ============================================

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(12);
    
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
});

// ============================================
// METHOD: Generate JWT Token
// ============================================
UserSchema.methods.generateAuthToken = function() {
    // jwt.sign() token create karta hai
    // Payload mein user ki id daalo
    // Secret key se sign karo
    // Expiry set karo
    return jwt.sign(
        { id: this._id },                    // Payload - token 
        process.env.JWT_SECRET,               // Secret key - .env se
        { expiresIn: process.env.JWT_EXPIRE } // Expiry - 30 days
    );
};

// ============================================
// METHOD: Match Password
// ============================================
UserSchema.methods.matchPassword = async function(enteredPassword) {
    // Returns true/false
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);