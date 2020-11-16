// eslint-disable-next-line max-len
const RecipesAttributesFormatter = require('../../../../formatters/recipes/RecipesAttributesFormatter');

describe('Recipes Attributes Formatter ', () => {
  let recipes;
  beforeEach(() => {
    recipes = {
      results: [
        {
          title: 'Vegetable-Pasta Oven Omelet',
          href: 'http://find.myrecipes.com/recipes/recipefinder.dyn',
          ingredients: 'tomato, onions, red pepper, garlic, olive oil',
          thumbnail: 'http://img.recipepuppy.com/560556.jpg',
        },
        {
          title: 'Roasted Pepper and Bacon Omelet',
          href: 'http://www.bigoven.com/43919-Roasted-html',
          ingredients: 'eggs, salt, black pepper, butter, black pepper',
          thumbnail: '',
        },
      ],
    };
  });
  describe('createIngredients method', () => {
    beforeEach(() => {
      recipes = {
        title: 'Vegetable-Pasta Oven Omelet',
        href: 'http://find.myrecipes.com/recipes/recipefinder.dyn',
        ingredients: 'tomato, onions, red pepper, garlic, olive oil',
        thumbnail: 'http://img.recipepuppy.com/560556.jpg',
      };
    });

    it('should return Ingredients ordered', () => {
      const response = RecipesAttributesFormatter.createIngredients(recipes);

      expect(response).to.deep.equals([
        'garlic',
        'olive oil',
        'onions',
        'red pepper',
        'tomato',
      ]);
    });
  });

  describe('format method', () => {
    it('should return a formated recipes', () => {
      const response = RecipesAttributesFormatter.format(recipes.results);

      expect(response).to.deep.equals(
        [
          {
            title: 'Vegetable-Pasta Oven Omelet',
            link: 'http://find.myrecipes.com/recipes/recipefinder.dyn',
            ingredients: [
              'garlic',
              'olive oil',
              'onions',
              'red pepper',
              'tomato',
            ],
          },
          {
            title: 'Roasted Pepper and Bacon Omelet',
            link: 'http://www.bigoven.com/43919-Roasted-html',
            ingredients: [
              'black pepper',
              'black pepper',
              'butter',
              'eggs',
              'salt',
            ],
          },
        ],
      );
    });
  });
});
