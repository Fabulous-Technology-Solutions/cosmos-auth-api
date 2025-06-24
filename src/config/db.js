// src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB vCore...');
    
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // vCore connection options
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      retryWrites: false,
      // Add database name if not in connection string
      dbName: process.env.DB_NAME || undefined
    };

    const conn = await mongoose.connect("mongodb+srv://academicuser:dqyzW7r3NDb8gvJ@academichub.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000", options);
    
    console.log('✅ MongoDB vCore connected successfully!');
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    
    return conn;
    
  } catch (error) {
    console.error('❌ MongoDB vCore connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting checklist:');
    console.error('   1. Check your MONGO_URI in .env file');
    console.error('   2. Verify vCore cluster is running');
    console.error('   3. Check firewall/IP allowlist settings');
    console.error('   4. Confirm username/password are correct');
    console.error('\n💡 Expected vCore format:');
    console.error('   mongodb+srv://username:password@cluster.mongocluster.cosmos.azure.com/database?tls=true');
    
    // Don't exit in development, but log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to vCore cluster');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from vCore cluster');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconnected to vCore cluster');
});

// Handle connection interruption
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;