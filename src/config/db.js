const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Cosmos DB specific connection options
    const options = {
      ssl: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('✅ Azure Cosmos DB connected successfully');
    
    // Optional: Log connection details (without sensitive info)
    console.log(`📊 Connected to: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error('❌ DB Connection Error:', error.message);
    console.error('Connection string format should be:');
    console.error('mongodb://account:key@account.mongo.cosmos.azure.com:10255/database?ssl=true&replicaSet=globaldb&retrywrites=false');
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to Cosmos DB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from Cosmos DB');
});

module.exports = connectDB;