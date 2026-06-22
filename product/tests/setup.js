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
