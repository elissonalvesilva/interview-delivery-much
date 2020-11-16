const RecipesAttributesFormatter = {
  createIngredients({ ingredients }) {
    return ingredients
      .replace(/\s*,\s*/ig, ',')
      .split(',')
      .sort();
  },

  format(results) {
    const recipes = [];
    for (const item of results) {
      const recipe = {};
      recipe.title = item.title;
      recipe.link = item.href;
      recipe.ingredients = this.createIngredients(item);
      recipes.push(recipe);
    }

    return recipes;
  },
};

module.exports = RecipesAttributesFormatter;
