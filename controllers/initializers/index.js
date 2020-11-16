const redisClient = require('../../clients/redis');

const initilizer = async () => {
  await redisClient.connect();
};

module.exports = initilizer;
