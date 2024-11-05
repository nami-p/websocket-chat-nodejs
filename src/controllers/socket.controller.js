class SocketController {
  async connectUser(ws) {
    try {
      const { clientId, clientInfo } = await this.chatService.handleNewConnection(ws);
      return { status: 'success', data: { clientId, clientInfo } };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async disconnectUser(clientId) {
    try {
      await this.chatService.handleDisconnection(clientId);
      return { status: 'success' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async handleMessage(data, clientId) {
    try {
      const message = await this.chatService.createMessage(data, clientId);
      return { status: 'success', data: message };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}