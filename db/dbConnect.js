const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is undefined! Please set it in Environment Variables.");
    }

    // Log connection attempt
    console.log("🔄 Attempting to connect to MongoDB...");
    
    // Modify URI to use Photo-Sharing database
    const modifiedUri = uri.replace(/\?/, '/Photo-Sharing?');
    console.log("📝 Connection URI:", modifiedUri.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')); // Hide credentials

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
      dbName: 'Photo-Sharing' // Explicitly set database name
    };

    await mongoose.connect(modifiedUri, options);
    
    // Log successful connection
    console.log("✅ Successfully connected to MongoDB Atlas!");
    console.log("📊 Database:", mongoose.connection.name);
    console.log("🔌 Connection state:", mongoose.connection.readyState);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error("❌ Unable to connect to MongoDB Atlas:", error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error("🔍 Possible causes:");
      console.error("1. MongoDB server is not running");
      console.error("2. Network connectivity issues");
      console.error("3. IP address not whitelisted in MongoDB Atlas");
      console.error("4. Invalid connection string");
    }
    throw error;
  }
};

module.exports = dbConnect;