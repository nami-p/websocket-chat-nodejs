const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const messageRoutes = require('./src/routes/message.routes');
const SocketController = require('./src/controllers/socket.controller');
const socketController = new SocketController();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// REST API routes
app.use('/api', messageRoutes);

// WebSocket handling
wss.on('connection', async (ws) => {
  const { status, data, message } = await socketController.connectUser(ws);
  
  if (status === 'error') {
    ws.send(JSON.stringify({ type: 'error', message }));
    return;
  }

  const { clientId } = data;

  ws.on('message', async (message) => {
    const result = await socketController.handleMessage(message, clientId);
    if (result.status === 'error') {
      ws.send(JSON.stringify({ type: 'error', message: result.message }));
    }
  });

  ws.on('close', async () => {
    await socketController.disconnectUser(clientId);
  });
});

server.listen(config.port, () => {
  console.log(`WebSocket server is running on port ${config.port}`);
});