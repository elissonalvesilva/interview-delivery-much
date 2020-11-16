// eslint-disable-next-line max-len
const RecipesResponseFormatter = require('../../../../formatters/recipes/response');
const RecipesManager = require('../../../../managers/recipes');

describe('Recipes Response Formatter', () => {
  let sandbox;
  let data;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    data = {
      title: 'Recipe Puppy',
      version: 0.1,
      href: 'http://www.recipepuppy.com/',
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

  afterEach(() => {
    sandbox.restore();
  });

  it('Should return formatted response with recipes', async () => {
    const query = {
      i: ['a,b'],
      q: 'a',
    };
    const recipes = [
      {
        title: 'Vegetable-Pasta Oven Omelet',
        ingredients:
              ['onions', 'olive oil', 'garlic', 'red pepper', 'tomato'],
        link: 'http://find.myrecipes.com/recipes/recipefinder.dyn',
        gif: 'http://img.recipepuppy.com/560556.jpg',
      },
      {
        title: 'Roasted Pepper and Bacon Omelet',
        ingredients:
            ['black pepper', 'black pepper', 'butter', 'eggs', 'salt'],
        link: 'http://www.bigoven.com/43919-Roasted-html',
        gif: 'http://img.recipepuppy.com/560556.jpg',
      },
    ];
    const result = {
      keywords: ['a', 'b'],
      recipes,
    };

    sandbox.stub(RecipesManager, 'formatRecipes').returns(
      Promise.resolve(recipes),
    );

    const response = await RecipesResponseFormatter.format(query, data);
    expect(response).to.deep.equal(result);
  });

  it(`Should return formatted response with
    gif empty to simulate giphy service unavailable`, async () => {
    const query = {
      i: ['a,b'],
      q: 'a',
    };
    const recipes = [
      {
        title: 'Vegetable-Pasta Oven Omelet',
        ingredients:
              ['onions', 'olive oil', 'garlic', 'red pepper', 'tomato'],
        link: 'http://find.myrecipes.com/recipes/recipefinder.dyn',
        gif: '',
      },
      {
        title: 'Roasted Pepper and Bacon Omelet',
        ingredients:
            ['black pepper', 'black pepper', 'butter', 'eggs', 'salt'],
        link: 'http://www.bigoven.com/43919-Roasted-html',
        gif: '',
      },
    ];
    const result = {
      keywords: ['a', 'b'],
      recipes,
    };

    sandbox.stub(RecipesManager, 'formatRecipes').returns(
      Promise.resolve(recipes),
    );

    const response = await RecipesResponseFormatter.format(query, data);
    expect(response).to.deep.equal(result);
  });
});
