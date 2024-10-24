import app from './app';
import express from 'express';
import path from 'path';
import http from 'http';
import ChatServer from './chat-server';  // Inkluderer chat-serveren

// Serve client files
app.use(express.static(path.join(__dirname, '/../../client/public')));

const webServer = http.createServer(app);
// Start WebSocket-serveren for chat
const chatServer = new ChatServer(webServer, '/api/v1'); // Chat-server kjører på '/api/v1/chat'

const port = 3000;
webServer.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
