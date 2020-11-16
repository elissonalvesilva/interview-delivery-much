const Redis = require('ioredis');
const Bluebird = require('bluebird');
const logger = require('../../utils/logger');
const config = require('../../utils/config');

function monit(client, name) {
  client.on('ready', () => {
    logger.info(`Redis client "${name}" is ready`);
  });

  client.on('connect', () => {
    logger.info(`Redis client "${name}" is connected`);
  });

  client.on('reconnecting', () => {
    logger.info(`Redis client "${name}" is reconnecting`);
  });

  client.on('error', (err) => {
    logger.info(`Redis client "${name}" got an error`, err);
  });

  client.on('end', () => {
    logger.info(`Redis client "${name}" connection has ended`);
  });

  client.on('node error', (err) => {
    logger.info(
      `Redis client "${name}" got an error while connecting to a node`,
      err,
    );
  });

  client.on('+node', () => {
    logger.info(`Redis client "${name}" connected to a new node`);
  });

  client.on('-node', () => {
    logger.info(`Redis client "${name}" disconnected from a node`);
  });

  return client;
}

function retryStrategy(times) {
  const delay = Math.min(times * 200, 10000);
  return delay;
}

// Build a Redis Cluster
function buildCluster() {
  const nodes = config.get('redis:nodes');
  const options = config.get('redis:options');

  options.retryStrategy = retryStrategy;
  options.autoResendUnfulfilledCommands = false;
  options.enableOfflineQueue = false;

  return new Redis.Cluster(nodes, options);
}

// Build a Redis Instance
function buildInstance() {
  const options = config.get('redis:options');

  options.retryStrategy = retryStrategy;
  options.autoResendUnfulfilledCommands = false;
  options.enableOfflineQueue = false;

  return new Redis(options);
}

const redisType = config.get('redis:type');

function getRedisClient(name) {
  let redis;

  return () => {
    if (redis) {
      return redis;
    }

    redis = monit(
      redisType === 'cluster' ? buildCluster() : buildInstance(),
      name,
    );

    return redis;
  };
}

const getRedis = getRedisClient('redis');

const connect = () => new Bluebird((resolve, reject) => {
  const redis = getRedis();

  redis.on('ready', () => {
    resolve();
  });

  redis.on('end', reject);
}).timeout(2000);

module.exports = {
  getRedis,
  connect,
};
