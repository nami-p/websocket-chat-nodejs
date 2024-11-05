class MessageController {
    constructor(chatService) {
        this.chatService = chatService;  // Initialize chatService
    }

    // GET /api/messages
    async getMessages(req, res) {
        try {
            const { page = 1, limit = 50 } = req.query;
            const messages = await this.chatService.getMessages(page, limit);
            res.status(200).json({
                status: 'success',
                data: messages
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // POST /api/messages
    async createMessage(req, res) {
        try {
            const { content, userId } = req.body;
            const message = await this.chatService.createMessage(content, userId);
            res.status(201).json({
                status: 'success',
                data: message
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // PUT /api/messages/:id
    async updateMessage(req, res) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const message = await this.chatService.updateMessage(id, content);
            res.status(200).json({
                status: 'success',
                data: message
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // DELETE /api/messages/:id
    async deleteMessage(req, res) {
        try {
            const { id } = req.params;
            await this.chatService.deleteMessage(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = MessageController;