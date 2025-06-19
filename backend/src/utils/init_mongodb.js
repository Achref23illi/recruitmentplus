const mongoose = require('mongoose');

// Default MongoDB URI if environment variable is not set
const MONGODB_URI = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI || 'mongodb://localhost:27017/recruitment_db';
const DB_NAME = process.env.DB_NAME || 'recruitment_db';

console.log('Attempting to connect to MongoDB...');
console.log('URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
console.log('Database:', DB_NAME);

mongoose.connect(MONGODB_URI, { 
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s
    socketTimeoutMS: 45000, // Close sockets after 45s
}).then(() => {
    console.log('✅ mongoose connected successfully');
}).catch((err) => {
    console.error('❌ mongoose connection failed:', err.message);
    console.error('Please check your MongoDB configuration and ensure the database is running');
});

mongoose.connection.on('connected', () => {
    console.log('✅ Connected to MongoDB');
    console.log('Database Name:', mongoose.connection.db.databaseName);
})

mongoose.connection.on('error', (err) => {
    console.log('❌ MongoDB connection error:', err.message);
})

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ mongoose disconnected');
})

//* close connection to DB when the app is closed
process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    await mongoose.connection.close();
    process.exit(0);
})