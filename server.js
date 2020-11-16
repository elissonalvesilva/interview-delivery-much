require('dotenv').config();

const conf = require('./utils/config');

const port = conf.get('port');
const host = conf.get('host');
const environment = conf.get('environment');

const initialize = require('./controllers/initializers');
const logger = require('./utils/logger');

const app = require('./app');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

process.env.TZ = conf.get('timezone');

// just run the application when all initializer init
initialize().then(() => {
  app.listen(port, host, (err) => {
    if (err) {
      logger.error({ error: err });
      return;
    }

    if (process.send) {
      process.send({ status: 'listening' });
    }

    logger.info(`Delivery API (${environment}) listening at ${port}`);
  });
});
