const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const agent = require('../agent/agent');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../socket_debug.log');
function log(msg) {
    try {
        fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) {
        console.error('Failed to write log:', e);
    }
}

async function initSocketServer(httpServer) {

    const io = new Server(httpServer, {
        path: "/api/socket/socket.io/",
    })

    io.use((socket, next) => {
        log(`New connection attempt. Handshake headers: ${JSON.stringify(socket.handshake.headers)}`);
        const cookies = socket.handshake.headers?.cookie;
        log(`Cookies string: ${cookies}`);
        const { token } = cookies ? cookie.parse(cookies) : {};
        log(`Parsed token: ${token ? 'exists' : 'not found'}`);

        if (!token) {
            log(`Authentication failed: Token not provided`);
            return next(new Error('Token not provided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            log(`Authentication succeeded for user: ${JSON.stringify(decoded)}`);
            socket.user = decoded;
            socket.token = token;
            next()
        } catch (err) {
            log(`Authentication failed: Invalid token - ${err.message}`);
            return next(new Error('Invalid token'));
        }
    })

    io.on('connection', (socket) => {
        log(`Socket connection fully established for user: ${JSON.stringify(socket.user)}`);

        socket.on('message', async (data) => {
            log(`Received message: ${data}`);
            try {
                const agentResponse = await agent.invoke({
                    messages: [
                        {
                            role: "user",
                            content: data
                        }
                    ]
                }, {
                    metadata: {
                        token: socket.token
                    }
                })

                const lastMessage = agentResponse.messages[ agentResponse.messages.length - 1 ]
                log(`Agent response content: ${lastMessage.content}`);
                socket.emit('message', lastMessage.content)
            } catch (err) {
                log(`Error invoking agent: ${err.message}`);
                socket.emit('message', `Sorry, I encountered an error: ${err.message}`)
            }
        })

        socket.on('disconnect', () => {
            log(`Socket disconnected for user: ${socket.user?.email}`);
        });
    })

}

module.exports = { initSocketServer };