// server/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from client folder
app.use(express.static(path.join(__dirname, '../client')));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Broadcast drawing data to all clients except the sender
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    // Notify when a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
