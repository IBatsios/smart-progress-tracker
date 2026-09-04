// ============================================
// GLOBAL ERROR HANDLER MIDDLEWARE
// ============================================

const errorHandler = (err, req, res, next) => {
    // Error details log karo (development mein)
    console.error('❌ Error:', err);

    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // ============================================
    // MONGOOSE SPECIFIC ERRORS
    // ============================================

    // Mongoose Validation Error
   
    if (err.name === 'ValidationError') {
        statusCode = 400;
        // Saari validation errors ek string mein combine karo
        const messages = Object.values(err.errors).map(error => error.message);
        message = messages.join('. ');
    }

    // Mongoose Cast Error (Invalid ObjectId)
   
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongoose Duplicate Key Error

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists. Please use a different ${field}.`;
    }

    // ============================================
    // JWT ERRORS
    // ============================================
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please login again.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired. Please login again.';
    }

    // ============================================
    // SEND ERROR RESPONSE
    // ============================================
    res.status(statusCode).json({
        success: false,
        message: message,
    
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;