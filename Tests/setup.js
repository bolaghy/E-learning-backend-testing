const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Start the in-memory MongoDB server
const startDatabase = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

// Stop the in-memory MongoDB server
const stopDatabase = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    
};

// Clear all collections in the database
const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({}); // Delete all documents in the collection
    }
   
};

module.exports = { startDatabase, stopDatabase, clearDatabase };