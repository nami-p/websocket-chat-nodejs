# WebSocket Real-Time Chat Server

A scalable WebSocket-based real-time chat server built with Node.js, Express, and WebSocket (ws) library. This server provides real-time bidirectional communication for chat applications with features like message broadcasting, user presence, and message history.

## Features

- 🚀 Real-time bidirectional communication
- 👥 User presence tracking (join/leave notifications)
- 📝 Message history support
- 🔄 Automatic reconnection handling
- ❤️ Connection health monitoring
- 🔍 Basic health check endpoint
- 📊 Message acknowledgments
- 🔐 Unique client identification using UUID

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn package manager

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/websocket-chat-server.git

# Navigate to the project directory
cd websocket-chat-server

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8080
```

## Usage

```bash
# Start the server
npm start

# Start in development mode with nodemon
npm run dev
```

## API Endpoints

### WebSocket Events

#### Client -> Server
```javascript
// Send message
{
  "text": "Hello, world!"
}
```

#### Server -> Client
```javascript
// Connection acknowledgment
{
  "type": "connection_ack",
  "clientId": "uuid",
  "username": "User-123456",
  "timestamp": "2024-11-04T12:00:00.000Z",
  "message": "Connected to chat server"
}

// Message broadcast
{
  "id": "uuid",
  "text": "Message content",
  "sender": "Username",
  "timestamp": "2024-11-04T12:00:00.000Z",
  "clientId": "sender-uuid"
}
```

### HTTP Endpoints

- `GET /health` - Server health check endpoint

## Project Structure

```
websocket-chat-server/
├── src/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   └── websocket.controller.js
│   ├── services/
│   │   └── chat.service.js
│   ├── utils/
│   │   └── websocket.utils.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
