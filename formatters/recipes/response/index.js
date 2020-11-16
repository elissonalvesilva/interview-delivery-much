const RecipesManager = require('../../../managers/recipes');

const RecipesResponseFormatter = {
  async format({ i }, { results }) {
    const response = {};

    if (i) {
      response.keywords = i[0].includes(',') ? i[0].split(',') : i;
    }

    if (results) {
      response.recipes = await RecipesManager.formatRecipes(results);
    }

    return response;
  },
};

module.exports = RecipesResponseFormatter;
