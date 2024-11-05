const { v4: uuidv4 } = require('uuid');

class ChatService {
  constructor() {
    this.clients = new Map();
    this.messages = [];
    this.maxHistory = 100;
  }

  async handleNewConnection(ws) {
    const clientId = uuidv4();
    const clientInfo = {
      ws,
      username: `User-${clientId.slice(0, 6)}`,
      connectedAt: new Date()
    };
    
    this.clients.set(clientId, clientInfo);
    return { clientId, clientInfo };
  }

  async handleDisconnection(clientId) {
    const clientInfo = this.clients.get(clientId);
    if (clientInfo) {
      this.clients.delete(clientId);
    }
    return clientInfo;
  }

  async getMessages(page = 1, limit = 50) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedMessages = this.messages.slice(startIndex, endIndex);
    
    return {
      data: paginatedMessages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(this.messages.length / limit),
        totalMessages: this.messages.length
      }
    };
  }

  async createMessage(content, userId) {
    const message = {
      id: uuidv4(),
      content,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.messages.push(message);
    
    // Keep message history within limit
    if (this.messages.length > this.maxHistory) {
      this.messages.shift();
    }

    return message;
  }

  async updateMessage(messageId, content) {
    const message = this.messages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    message.content = content;
    message.updatedAt = new Date().toISOString();

    return message;
  }

  async deleteMessage(messageId) {
    const index = this.messages.findIndex(m => m.id === messageId);
    if (index === -1) {
      throw new Error('Message not found');
    }

    this.messages.splice(index, 1);
    return true;
  }

  getActiveUsers() {
    return Array.from(this.clients.values()).map(client => ({
      username: client.username,
      connectedAt: client.connectedAt
    }));
  }

  getConnectedClients() {
    return this.clients;
  }
}

module.exports = ChatService;
