const _ = require('lodash');
const RecipesManager = require('../../../managers/recipes');
// eslint-disable-next-line max-len
const logger = require('../../../utils/logger');
const config = require('../../../utils/config');
const GiphyService = require('../../../services/giphy');

describe('Recipes Manager', () => {
  let sandbox;
  let clock;
  let recipeResponse;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers();

    sandbox.stub(logger, 'info');
    sandbox.stub(logger, 'error');
    sandbox.stub(logger, 'warn');

    // reset manager's state
    RecipesManager.failedRequestsCount = 0;
    RecipesManager.isSourceDown = false;

    recipeResponse = [
      {
        title: 'Vegetable-Pasta Oven Omelet',
        ingredients:
              ['onions', 'olive oil', 'garlic', 'red pepper', 'tomato'],
        link: 'http://find.myrecipes.com/recipes/recipefinder.dyn',
      },
      {
        title: 'Roasted Pepper and Bacon Omelet',
        ingredients:
            ['black pepper', 'black pepper', 'butter', 'eggs', 'salt'],
        link: 'http://www.bigoven.com/43919-Roasted-html',
      },
    ];
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('handleRequestFail method', () => {
    it('should increment failedRequestsCount attribute', () => {
      const countBefore = RecipesManager.failedRequestsCount;
      RecipesManager.handleRequestFail({ message: 'error' });
      expect(RecipesManager.failedRequestsCount).to.be.equal(countBefore + 1);
      expect(logger.error).to.have.been.called;
    });

    describe('When giphy source is not down', function() {
      // eslint-disable-next-line max-len
      it('and the failed requests threshold arent crossed, should not have called the setTimeout', function() {
        const countBefore = RecipesManager.failedRequestsCount;

        const spy = sandbox.spy(global, 'setTimeout');
        RecipesManager.handleRequestFail({ message: 'error' });
        expect(spy).to.not.have.been.called;
        expect(RecipesManager.failedRequestsCount)
          .to.be.equal(countBefore + 1);
      });

      // eslint-disable-next-line max-len
      it('and the failed requests threshold is crossed, should not have called the setTimeout', function() {
        const spy = sandbox.spy(global, 'setTimeout');

        // set failed requests count to the threshold, so when we call the
        // handler the threshold will be crossed
        const { failedRequestsThreshold } = config.get('api:giphy');
        RecipesManager.failedRequestsCount = failedRequestsThreshold;
        RecipesManager.handleRequestFail({ message: 'error' });

        expect(spy).to.have.been.called;
        expect(RecipesManager.isSourceDown).to.be.equal(true);
        expect(RecipesManager.failedRequestsCount)
          .to.be.equal(failedRequestsThreshold + 1);
      });

      it('should reset source down attribute after retryTimeout', function() {
        const spy = sandbox.spy(global, 'setTimeout');

        // set failed requests count to the threshold, so when we call the
        // handler the threshold will be crossed
        const {
          failedRequestsThreshold,
          retryTimeout,
        } = config.get('api:giphy');
        RecipesManager.failedRequestsCount = failedRequestsThreshold;
        RecipesManager.handleRequestFail({ message: 'error' });

        expect(spy).to.have.been.called;
        expect(RecipesManager.isSourceDown).to.be.equal(true);
        expect(RecipesManager.failedRequestsCount)
          .to.be.equal(failedRequestsThreshold + 1);

        // after the retry timeout, the isSourceDown should return to it's
        // original state
        clock.tick(retryTimeout);
        expect(RecipesManager.isSourceDown).to.be.equal(false);
      });
    });

    describe('When giphy source is down', function() {
      // eslint-disable-next-line max-len
      it('and the failed requests threshold arent crossed, should not have called the setTimeout', function() {
        const countBefore = RecipesManager.failedRequestsCount;
        const spy = sandbox.spy(global, 'setTimeout');

        RecipesManager.handleRequestFail({ message: 'error' });

        expect(spy).to.not.have.been.called;
        expect(RecipesManager.failedRequestsCount)
          .to.be.equal(countBefore + 1);
      });

      // eslint-disable-next-line max-len
      it('and the failed requests threshold is crossed, should not have called the setTimeout', function() {
        const countBefore = RecipesManager.failedRequestsCount;
        const spy = sandbox.spy(global, 'setTimeout');

        RecipesManager.handleRequestFail({ message: 'error' });

        expect(spy).to.not.have.been.called;
        expect(RecipesManager.failedRequestsCount)
          .to.be.equal(countBefore + 1);
      });
    });
  });

  describe('getGiphy method', () => {
    describe('When giphy service is down', () => {
      it('should return a recipe without gif', async() => {
        sandbox.stub(GiphyService, 'get').returns(
          Promise.reject(),
        );

        const response = await RecipesManager.getGiphy(recipeResponse);
        expect(response).to.deep.equals(recipeResponse);
      });
    });
    describe('When giphy service return a empty response', () => {
      it('should return a recipe without gif', async() => {
        sandbox.stub(GiphyService, 'get').returns(
          Promise.resolve({}),
        );

        const response = await RecipesManager.getGiphy(recipeResponse);
        expect(response).to.deep.equals(recipeResponse);
      });
    });

    describe('When giphy service is not down', () => {
      beforeEach(() => {
        recipeResponse = {
          title: 'Vegetable-Pasta Oven Omelet',
          ingredients:
                ['onions', 'olive oil', 'garlic', 'red pepper', 'tomato'],
          link: 'http://find.myrecipes.com/recipes/recipefinder.dyn',
        };
      });

      it('should return a recipe with gif', async() => {
        const expected = _.cloneDeep(recipeResponse);
        expected.gif = 'giphy';

        sandbox.stub(GiphyService, 'get').returns(
          Promise.resolve({
            data: [
              { images: { original: { url: 'giphy' } } },
            ],
          }),
        );

        const response = await RecipesManager.getGiphy(recipeResponse);
        expect(response).to.deep.equals(expected);
      });
    });
  });
});
