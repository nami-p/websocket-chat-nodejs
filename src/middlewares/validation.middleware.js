class ValidationMiddleware {
    static validateMessage(req, res, next) {
      const { content } = req.body;
      
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Message content is required and must be a non-empty string'
        });
      }
  
      next();
    }
  
    static validatePagination(req, res, next) {
      const { page, limit } = req.query;
      
      if (page && (!Number.isInteger(+page) || +page < 1)) {
        return res.status(400).json({
          status: 'error',
          message: 'Page must be a positive integer'
        });
      }
  
      if (limit && (!Number.isInteger(+limit) || +limit < 1)) {
        return res.status(400).json({
          status: 'error',
          message: 'Limit must be a positive integer'
        });
      }
  
      next();
    }
  }
  
  module.exports = ValidationMiddleware;