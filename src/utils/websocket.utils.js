const WebSocket = require('ws');

class WebSocketUtils {
  static broadcast(clients, message, excludeClientId = null) {
    clients.forEach((client, clientId) => {
      if (clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  static sendToClient(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  static createMessage(type, payload) {
    return {
      type,
      timestamp: new Date().toISOString(),
      payload
    };
  }
}

module.exports = WebSocketUtils;
