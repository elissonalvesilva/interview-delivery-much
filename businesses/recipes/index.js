const _ = require('lodash');

const PuppyService = require('../../services/puppy');

const RecipesResponseFormatter = require('../../formatters/recipes/response');

const Cache = require('../../utils/cache');

const RecipesBusinesses = {
  async handle(query) {
    let httpCode = 200;
    let response = '';

    const cacheKey = Cache.generateCacheKey(query);

    // format request
    const cacheResponse = await Cache.get({ key: cacheKey });

    if (cacheResponse) {
      httpCode = 200;
      response = cacheResponse;
    } else {
      response = await PuppyService.get(query);

      if (response && 'error' in response) {
        httpCode = 400;
        response = {
          message: 'Error to get recipe',
          error: response.message,
          code: response.code,
        };

        if (response.code === 503) {
          httpCode = 503;
          response = {
            message: 'Puppy Service Unavailable',
          };
        }

        return {
          httpCode,
          response,
        };
      }

      if (_.isEmpty(response)) {
        httpCode = 404;
        response = {
          message: 'Query not found',
        };

        return {
          httpCode,
          response,
        };
      }

      // format response
      response = await RecipesResponseFormatter.format(query, response);
      Cache.set({
        key: cacheKey,
        value: response,
        ttl: 300,
      });
    }

    return {
      httpCode,
      response,
    };
  },
};

module.exports = RecipesBusinesses;
