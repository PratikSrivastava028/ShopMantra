const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.mock('amqplib', () => ({
    connect: jest.fn().mockResolvedValue({
        createChannel: jest.fn().mockResolvedValue({
            assertQueue: jest.fn().mockResolvedValue(true),
            sendToQueue: jest.fn().mockResolvedValue(true),
            consume: jest.fn().mockResolvedValue(true),
            ack: jest.fn(),
            on: jest.fn(),
        }),
        on: jest.fn(),
    })
}));

let mongo;

beforeAll(async () => {
    // Start in-memory MongoDB
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    process.env.MONGO_URI = uri; // ensure app's db connector uses this
    process.env.JWT_SECRET = "test_jwt_secret"; // set a test JWT secret

    await mongoose.connect(uri);
});

afterEach(async () => {
    // Cleanup all collections between tests
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    if (mongo) await mongo.stop();
});
