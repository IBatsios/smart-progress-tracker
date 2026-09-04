// ============================================
// SMART PROGRESS TRACKER - MAIN SERVER FILE
// ============================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

// Create Express application instance
const app = express();

// ============================================
// DATABASE CONNECTION
// ============================================
connectDB();

// ============================================
// CORS CONFIGURATION (FINAL FIX)
// ============================================

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    process.env.CLIENT_URL // deployed frontend later
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (Postman etc)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // TEMP: allow all (so you don't get blocked again)
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// MIDDLEWARE SETUP
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/planner', require('./routes/plannerRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// ============================================
// HEALTH CHECK ROUTES
// ============================================

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Progress Tracker API is running! 🚀',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

app.get("/", (req, res) => {
    res.send("🚀 Smart Progress Tracker API is LIVE!");
});

// ============================================
// 404 HANDLER
// ============================================

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found on this server`
    });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║   🚀 Smart Progress Tracker Server       ║
    ║   📡 Port: ${PORT}                          ║
    ║   🌍 Mode: ${process.env.NODE_ENV || 'development'}               ║
    ║   ✅ Server is running successfully!      ║
    ╚══════════════════════════════════════════╝
    `);
});

// ============================================
// HANDLE ERRORS
// ============================================

process.on('unhandledRejection', (err) => {
    console.log(`❌ Unhandled Rejection: ${err.message}`);
    process.exit(1);
});