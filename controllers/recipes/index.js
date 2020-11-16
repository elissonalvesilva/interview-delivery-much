const RecipesBusinesses = require('../../businesses/recipes');
const logger = require('../../utils/logger');

const RecipesController = {
  async handle(req, res, next) {
    try {
      req.query.host = req.headers.host;
      const data = await RecipesBusinesses.handle(req.query);
      return res.status(data.httpCode).json(data.response);
    } catch (e) {
      logger.error('Recipes Controller:', e.message);
      logger.debug(e);
      // error handler middleware
      return next(e);
    }
  },
};

module.exports = RecipesController;
