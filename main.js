const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Create a WebSocket server instance
const wss = new WebSocket.Server({ server });

const clients = new Map();

// Message history (optional - for message persistence)
const messageHistory = [];
const MAX_HISTORY = 100;

// Broadcast message to all connected clients except sender
function broadcast(message, senderId) {
  clients.forEach((client, clientId) => {
    if (clientId !== senderId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

// Handle new WebSocket connections
wss.on('connection', (ws, req) => {
  const clientId = uuidv4();
  const clientInfo = {
    ws,
    username: `User-${clientId.slice(0, 6)}`,
    connectedAt: new Date()
  };
  
  clients.set(clientId, clientInfo);
  
  console.log(`New client connected. Total clients: ${clients.size}`);
  
  // Send connection acknowledgment
  ws.send(JSON.stringify({
    type: 'connection_ack',
    clientId,
    username: clientInfo.username,
    timestamp: new Date().toISOString(),
    message: 'Connected to chat server'
  }));
  
  // Send message history to new client
  if (messageHistory.length > 0) {
    ws.send(JSON.stringify({
      type: 'history',
      messages: messageHistory
    }));
  }
  
  // Broadcast new user joined
  broadcast({
    type: 'user_joined',
    username: clientInfo.username,
    timestamp: new Date().toISOString(),
    message: `${clientInfo.username} joined the chat`
  }, clientId);
  
  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const parsedData = JSON.parse(data);
      
      // Create message object
      const message = {
        id: uuidv4(),
        text: parsedData.text,
        sender: clientInfo.username,
        timestamp: new Date().toISOString(),
        clientId
      };
      
      // Store message in history
      messageHistory.push(message);
      if (messageHistory.length > MAX_HISTORY) {
        messageHistory.shift();
      }
      
      // Broadcast message to all clients
      broadcast(message, clientId);
      
      // Send acknowledgment to sender
      ws.send(JSON.stringify({
        type: 'message_ack',
        messageId: message.id,
        timestamp: message.timestamp
      }));
      
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    const clientInfo = clients.get(clientId);
    clients.delete(clientId);
    
    console.log(`Client disconnected. Total clients: ${clients.size}`);
    
    // Broadcast user left message
    broadcast({
      type: 'user_left',
      username: clientInfo.username,
      timestamp: new Date().toISOString(),
      message: `${clientInfo.username} left the chat`
    }, clientId);
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
    
    // Clean up client connection
    clients.delete(clientId);
    
    // Try to send error message to client
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Internal server error'
        }));
      }
    } catch (e) {
      console.error('Failed to send error message to client:', e);
    }
  });
});

// Periodic connection health check
setInterval(() => {
  clients.forEach((client, clientId) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.ping();
    }
  });
}, 30000);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    clients: clients.size,
    uptime: process.uptime()
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});