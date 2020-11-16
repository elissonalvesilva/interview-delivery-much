const { expect } = require('chai');
const RecipesBusinesses = require('../../../businesses/recipes');
const PuppyService = require('../../../services/puppy');

// eslint-disable-next-line max-len
const RecipesResponseFormatter = require('../../../formatters/recipes/response');
const RedisClient = require('../../../clients/redis');

const Cache = require('../../../utils/cache');

describe('Recipes Businessess', () => {
  let sandbox;
  let response;
  let puppyResponse;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    response = {
      keywords: ['a', 'b'],
      recipes: [
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
              ['black pepper', 'butter', 'eggs', 'salt'],
          link: 'http://www.bigoven.com/43919-Roasted-html',
          gif: 'http://img.recipepuppy.com/560556.jpg',
        },
      ],
    };

    puppyResponse = {
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
          href: 'http://www.bigoven.com/43919-Roasted.html',
          ingredients: 'eggs, salt, black pepper, butter',
          thumbnail: '',
        },
      ],
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return a response with httpCode = 200', async () => {
    sandbox.stub(RedisClient, 'getRedis').returns(null);

    sandbox.stub(Cache, 'get').returns(
      Promise.resolve(null),
    );

    sandbox.stub(Cache, 'set').returns(
      Promise.resolve(null),
    );

    sandbox.stub(PuppyService, 'get').returns(
      Promise.resolve(puppyResponse),
    );

    sandbox.stub(RecipesResponseFormatter, 'format').returns(
      Promise.resolve(response),
    );

    const query = {
      i: ['a,b'],
      q: 'a',
      p: 20,
    };
    const businessesResponse = await RecipesBusinesses.handle(query);
    expect(businessesResponse).to.deep.equal({
      httpCode: 200,
      response,
    });
  });

  it('should return a response with not found recipe', async () => {
    sandbox.stub(RedisClient, 'getRedis').returns(null);

    sandbox.stub(Cache, 'get').returns(
      Promise.resolve(null),
    );

    sandbox.stub(Cache, 'set').returns(
      Promise.resolve(null),
    );

    sandbox.stub(PuppyService, 'get').returns(
      Promise.resolve({}),
    );

    const query = {
      i: ['a,b'],
      q: 'a',
      p: 20,
    };
    const businessesResponse = await RecipesBusinesses.handle(query);
    expect(businessesResponse).to.deep.equal({
      httpCode: 404,
      response: {
        message: 'Query not found',
      },
    });
  });

  it('should return a response with error on service', async () => {
    sandbox.stub(RedisClient, 'getRedis').returns(null);

    sandbox.stub(Cache, 'get').returns(
      Promise.resolve(null),
    );

    sandbox.stub(Cache, 'set').returns(
      Promise.resolve(null),
    );

    sandbox.stub(PuppyService, 'get').returns(
      Promise.resolve({
        error: true,
        message: 'Error to get recipe',
        code: 400,
      }),
    );

    const query = {
      i: ['a,b'],
      q: 'a',
      p: 20,
    };
    const businessesResponse = await RecipesBusinesses.handle(query);
    expect(businessesResponse).to.deep.equal({
      httpCode: 400,
      response: {
        message: 'Error to get recipe',
        error: 'Error to get recipe',
        code: 400,
      },
    });
  });

  it('should return a response with puppy recipe unavailable',
    async () => {
      sandbox.stub(RedisClient, 'getRedis').returns(null);

      sandbox.stub(Cache, 'get').returns(
        Promise.resolve(null),
      );

      sandbox.stub(Cache, 'set').returns(
        Promise.resolve(null),
      );

      sandbox.stub(PuppyService, 'get').returns(
        Promise.resolve({
          error: true,
          code: 503,
        }),
      );

      const query = {
        i: ['a,b'],
        q: 'a',
        p: 20,
      };
      const businessesResponse = await RecipesBusinesses.handle(query);
      expect(businessesResponse).to.deep.equal({
        httpCode: 503,
        response: {
          message: 'Puppy Service Unavailable',
        },
      });
    });

  it('should return a response from cache', async () => {
    sandbox.stub(RedisClient, 'getRedis').returns(null);

    sandbox.stub(Cache, 'get').returns(
      Promise.resolve(response),
    );

    sandbox.stub(Cache, 'set').returns(
      Promise.resolve(null),
    );

    const query = {
      i: ['a,b'],
      q: 'a',
      p: 20,
    };
    const businessesResponse = await RecipesBusinesses.handle(query);
    expect(businessesResponse).to.deep.equal({
      httpCode: 200,
      response,
    });
  });
});
