const helmet = require('helmet');
const bodyParser = require('body-parser');
const expressPinoLogger = require('express-pino-logger');
const logger = require('../utils/logger');
const normalizeQueryParams = require('./normalize-query-params');

const expressPino = expressPinoLogger({ logger });
/**
 * Set middlewares
 * @param {Object} express
 */
const applyMiddlewares = (app) => {
  app.use(helmet());
  app.use(expressPino);
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.json());
  app.use(normalizeQueryParams());
};

module.exports = { applyMiddlewares };
