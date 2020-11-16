const bluebird = require('bluebird');
const _ = require('lodash');

const logger = require('../../utils/logger');
const conf = require('../../utils/config');

// eslint-disable-next-line max-len
const RecipesAttributesFormatter = require('../../formatters/recipes/RecipesAttributesFormatter');
const GiphyService = require('../../services/giphy');

const {
  serviceTimeout,
  failedRequestsThreshold,
  retryTimeout,
} = conf.get('api:giphy');

const RecipesManager = {
  isSourceDown: false,
  failedRequestsCount: 0,

  async handleRequestFail(err) {
    this.failedRequestsCount += 1;
    // eslint-disable-next-line max-len
    logger.error(err.message, `RecipesManager: GiphyService request, current failedRequestsCount=${this.failedRequestsCount}`);
    logger.debug(err);

    // apparently source is down, stop trusting it, and use only cache
    // temporarily
    if (
      !this.isSourceDown
      && this.failedRequestsCount > failedRequestsThreshold
    ) {
      this.isSourceDown = true;
      logger.error('RecipesManager: giphy is probably down');

      // attempt to trust that source is up again after timeout
      setTimeout(() => {
        this.isSourceDown = false;
        logger.info('RecipesManager: attempt to use giphy again');
      }, retryTimeout);
    }
  },

  async getGiphy(recipe) {
    let giphyResponse = null;
    try {
      const { title } = recipe;

      giphyResponse = await bluebird.resolve(
        GiphyService.get(title),
      )
        .timeout(serviceTimeout)
        .catch((err) => {
          throw err;
        });

      if (_.isEmpty(giphyResponse)) {
        return recipe;
      }

      if (!this.isSourceDown) {
        // if this request was successfull then reset the counter
        this.failedRequestsCount = 0;
      }
    } catch (err) { // the service request timed out or failed
      this.handleRequestFail(err);
      return recipe;
    }

    const formatedRecipes = recipe;

    if (!_.isEmpty(giphyResponse.data[0]) && !('error' in giphyResponse)) {
      formatedRecipes.gif = giphyResponse.data[0].images.original.url;
    }

    return formatedRecipes;
  },

  async formatRecipes(recipes) {
    const recipesItems = RecipesAttributesFormatter.format(recipes);

    const newRecipesItemsPromises = recipesItems.map(
      async (recipe) => this.getGiphy(recipe)
        .catch((err) => {
          logger.error('RecipesManager.formatRecipes:', err.message);
          logger.debug(err);

          return recipe;
        }),
    );

    return Promise.all(newRecipesItemsPromises);
  },
};

module.exports = RecipesManager;
