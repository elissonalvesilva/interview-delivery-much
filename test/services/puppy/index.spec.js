const { expect } = require('chai');
const PuppyService = require('../../../services/puppy');
const PuppyRequestFormatter = require('../../../formatters/puppy/request');

describe('PuppyService', () => {
  let sandbox;
  let puppyResponse;
  beforeEach(() => {
    sandbox = sinon.createSandbox();

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

  it('Should return a response from puppy service', async () => {
    sandbox.stub(PuppyRequestFormatter, 'format').returns(
      'http://www.recipepuppy.com/api/?i=a&q=b',
    );

    sandbox.stub(PuppyService, 'get').returns(
      Promise.resolve(puppyResponse),
    );

    const query = {
      i: ['a'],
      q: 'b',
    };

    const response = await PuppyService.get(query);
    expect(response).to.deep.equal(puppyResponse);
  });

  it('Should return a error response from puppy service', async () => {
    sandbox.stub(PuppyRequestFormatter, 'format').returns(
      'http://www.recipepuppy.com/api/?i=a&q=b',
    );

    sandbox.stub(PuppyService, 'get').returns(
      Promise.reject(new Error('handle error on rejection')),
    );

    const query = {
      i: ['a'],
      q: 'b',
    };

    try {
      await PuppyService.get(query);
    } catch (error) {
      expect(error.message).to.be.eql('handle error on rejection');
    }
  });
});
