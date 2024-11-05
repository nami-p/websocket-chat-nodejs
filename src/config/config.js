module.exports = {
    EVENTS: {
      CONNECTION: 'connection',
      MESSAGE: 'message',
      DISCONNECT: 'disconnect',
      ERROR: 'error'
    },
    MESSAGE_TYPES: {
      CHAT: 'chat',
      SYSTEM: 'system',
      ERROR: 'error',
      ACK: 'acknowledgment'
    },
    MAX_MESSAGE_HISTORY: 100,
    PING_INTERVAL: 30000 // 30 seconds
  };