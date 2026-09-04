// ============================================
// DATABASE CONNECTION CONFIGURATION
// ============================================
// MongoDB Atlas se connection establish karta hai
// Mongoose ODM use karke schemas aur models banate hain

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // mongoose.connect() ek promise return karta hai
        // Connection string .env file se aati hai
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Yeh options deprecated warnings hatate hain
            // Mongoose 8+ mein yeh by default enabled hain
        });

        console.log(`
        ╔══════════════════════════════════════╗
        ║   📦 MongoDB Connected Successfully   ║
        ║   🏠 Host: ${conn.connection.host}          
        ║   📋 Database: ${conn.connection.name}     
        ╚══════════════════════════════════════╝
        `);
    } catch (error) {
        // Agar connection fail ho toh clearly error dikhao
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        
        // Process exit with failure code
        // 1 = failure, 0 = success
        process.exit(1);
    }
};

// Connection events listen karo for debugging
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
});

module.exports = connectDB;