const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message.controller');
const ChatService = require('../services/chat.service');  // Assuming you have a ChatService

// Create instances
const chatService = new ChatService();
const messageController = new MessageController(chatService);

// Define routes
router.get('/', messageController.getMessages.bind(messageController));
router.post('/', messageController.createMessage.bind(messageController));
router.put('/:id', messageController.updateMessage.bind(messageController));
router.delete('/:id', messageController.deleteMessage.bind(messageController));

module.exports = router;