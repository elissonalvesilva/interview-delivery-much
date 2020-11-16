const axios = require('axios');
const logger = require('../../utils/logger');

const PuppyFormatterRequest = require('../../formatters/puppy/request');

const PuppyService = {
  async get(query) {
    let response = '';

    try {
      const request = PuppyFormatterRequest.format(query);
      const { data } = await axios.get(request);

      response = data;
    } catch (error) {
      logger.error(error);
      response = {
        error: true,
        message: error.message,
        code: error.status,
      };
    }

    return response;
  },
};

module.exports = PuppyService;
