const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const axios = require('axios');

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

jest.mock('axios');

axios.get.mockImplementation((url) => {
    if (url.includes('/api/cart')) {
        return Promise.resolve({
            data: {
                cart: {
                    items: [
                        {
                            productId: '68bc6369c17579622cbdd9ff',
                            quantity: 2
                        }
                    ]
                }
            }
        });
    }
    if (url.includes('/api/products/')) {
        return Promise.resolve({
            data: {
                data: {
                    _id: '68bc6369c17579622cbdd9ff',
                    title: 'Mock Product',
                    price: {
                        amount: 100,
                        currency: 'INR'
                    },
                    stock: 10,
                    category: 'Electronics'
                }
            }
        });
    }
    return Promise.reject(new Error(`Unhandled GET request to ${url}`));
});

axios.delete.mockImplementation((url) => {
    if (url.includes('/api/cart')) {
        return Promise.resolve({ data: { message: 'Cart cleared' } });
    }
    return Promise.reject(new Error(`Unhandled DELETE request to ${url}`));
});

let mongo;

beforeAll(async () => {
    // Start in-memory MongoDB
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    // Override MONGO_URI for app/db code
    process.env.MONGO_URI = uri;

    // Connect mongoose directly for model tests if needed
    await mongoose.connect(uri, {
        dbName: 'jest',
    });
});

beforeEach(async () => {
    // Clear all collections between tests
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    // Close DB connections and stop server
    await mongoose.connection.close();
    if (mongo) {
        await mongo.stop();
    }
});
