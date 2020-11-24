const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const socketio = require('socket.io');
const expressLayouts = require('express-ejs-layouts');

const users = require('./utils/users');
const formatter = require('./utils/formatMessage');
const botname = {
    user: 'Chatbot',
    id: 1,
    room: 'All',
};

// Init App server and soket-server respectively
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Dotenv config
dotenv.config();

// Connect DB
require('./config/db')();

// Public Dir
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/index'));

// Socket io
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ name, room }) => {
        users.createUser(socket.id, name, room);

        socket.join(room);
        socket.emit(
            'message',
            formatter(`Hello ${name} Welcome to chat!`, botname)
        );

        socket.broadcast.emit(
            'message',
            formatter(`${name} Joined the chat.`, botname)
        );

        io.to(room).emit('roomUsers', {
            users: users.getRoomUser(room),
        });
    });

    socket.on('chatMessage', (msg) => {
        if (typeof msg !== 'string' || !msg.trim() || !msg) {
            return;
        }
        const user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatter(msg, user));
        }
    });

    socket.on('disconnect', () => {
        const user = users.deleteUser(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatter(`${user.user} leaves the chat.`, botname)
            );

            io.to(user.room).emit('roomUsers', {
                users: users.getRoomUser(user.room),
            });
        }
    });
});

// PORT
const PORT = process.env.PORT || 4500;

server.listen(PORT, () =>
    console.log(
        `Server running on in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
    )
);
