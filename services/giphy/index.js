const axios = require('axios');
const _ = require('lodash');

const logger = require('../../utils/logger');
const Cache = require('../../utils/cache');

const GiphyRequestFormatter = require('../../formatters/giphy/request');

const GiphyService = {
  async giphyRequest(title) {
    const key = title.replace(/\s/g, '');

    try {
      let giphyResponse = await Cache.get(key);
      if (_.isEmpty(giphyResponse)) {
        const request = GiphyRequestFormatter.format(title);
        const { data } = await axios.get(request);

        if (_.isEmpty(data)) {
          return giphyResponse;
        }

        const cacheParams = {
          key,
          value: data,
          ttl: 300,
        };

        Cache.set(cacheParams);
        giphyResponse = data;

        return giphyResponse;
      }

      return giphyResponse;
    } catch (error) {
      return error;
    }
  },
  async get(title) {
    let response = '';

    try {
      response = await this.giphyRequest(title);
    } catch (error) {
      logger.error(error);
      response = {
        error: true,
        message: error.message,
      };
    }

    return response;
  },
};

module.exports = GiphyService;
