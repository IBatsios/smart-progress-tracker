// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // ============================================
    // STEP 1: Token extract karo
    // ============================================
    // Format: "Bearer <token>"
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        // "Bearer eyJhbGciOiJ..." se sirf token part nikalo
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided. Please login first.'
        });
    }

    try {
        // ============================================
        // STEP 2: Token verification
        // ============================================
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ============================================
        // STEP 3: User find karo database se
        // ============================================
       
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token may be invalid.'
            });
        }

        // ============================================
        // STEP 4: User ko request mein attach karo
        // ============================================
        req.user = user;

        // Next middleware/route handler 
        next();

    } catch (error) {
        // Token invalid ya expired hai
        console.error('Auth Middleware Error:', error.message);
        
        let message = 'Not authorized. Invalid token.';
        if (error.name === 'TokenExpiredError') {
            message = 'Token expired. Please login again.';
        }
        
        return res.status(401).json({
            success: false,
            message: message
        });
    }
};

module.exports = protect;