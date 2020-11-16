const { expect } = require('chai');
const GiphyService = require('../../../services/giphy');
const GiphyRequestFormatter = require('../../../formatters/giphy/request');
const Cache = require('../../../utils/cache');
const RedisClient = require('../../../clients/redis');
const logger = require('../../../utils/logger');

describe.only('GiphyService', () => {
  let sandbox;
  let giphyResponse;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(logger, 'info');
    sandbox.stub(logger, 'error');
    sandbox.stub(logger, 'warn');

    giphyResponse = {
      type: 'gif',
      id: 'c1TzVrtoxtCLu',
      url: 'https://giphy.com/gifs/vegetables-c1TzVrtoxtCLu',
      slug: 'vegetables-c1TzVrtoxtCLu',
      bitly_gif_url: 'http://gph.is/2cI4jhd',
      bitly_url: 'http://gph.is/2cI4jhd',
      embed_url: 'https://giphy.com/embed/c1TzVrtoxtCLu',
      username: '',
      source: 'http://sunexports.net/product_vegetable_export_erode.html',
      title: 'Vegetables GIF',
      rating: 'g',
      content_url: '',
      tags:
        [
        ],
      featured_tags:
        [
        ],
      user_tags:
        [
        ],
      source_tld: 'sunexports.net',
      source_post_url:
        'http://sunexports.net/product_vegetable_export_erode.html',
      is_sticker: 0,
      import_datetime: '2016-09-27 13:11:45',
      trending_datetime: '0000-00-00 00:00:00',
      images:
        {
          original:
            {
              height: '480',
              width: '411',
              size: '1213010',
              url: 'https://media0.giphy.com/media/c1TzVrtoxtCLu/giphy.gif',
              mp4_size: '517489',
              mp4: 'https://media0.giphy.com/media/c1TzVrtoxtCLu/giphy.mp4',
              webp_size: '443154',
              webp: 'https://media0.giphy.com/media/c1TzVrtoxtCLu/giphy.webp',
              frames: '7',
              hash: '88b7cf9fb1c03af00f04bfa060725de9',
            },
          downsized:
            {
              height: '480',
              width: '411',
              size: '1213010',
              url: 'https://media0.giphy.com/media/c1TzVrtoxtCLu/giphy.gif',
            },
          downsized_large:
            {
              height: '700',
              width: '600',
              size: '2558501',
              url: 'https://media0.giphy.com/media/c1TzVrtoxtCLu/giphy.gif?',
            },
          downsized_medium:
            {
              height: '700',
              width: '600',
              size: '2558501',
              url: 'https://media0.giphy.com/media/c1TzVrtoxtCLu/giphy.gif',
            },
        },
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should return a response from giphy server', async () => {
    sandbox.stub(GiphyRequestFormatter, 'format').returns(
      'https://api.giphy.com/v1/gifs/search?api_key=\'\'&q=a&limit=1',
    );

    sandbox.stub(GiphyService, 'giphyRequest').returns(
      Promise.resolve(giphyResponse),
    );

    const title = 'Vegetable-Pasta Oven Omelet';

    const response = await GiphyService.get(title);
    expect(response).to.deep.equal(giphyResponse);
  });

  it('Should return a response from giphy cached', async () => {
    sandbox.stub(RedisClient, 'getRedis').returns(null);

    sandbox.stub(Cache, 'get').returns(
      Promise.resolve(giphyResponse),
    );

    sandbox.stub(Cache, 'set').returns(
      Promise.resolve(null),
    );

    sandbox.stub(GiphyRequestFormatter, 'format').returns(
      'https://api.giphy.com/v1/gifs/search?api_key=\'\'&q=a&limit=1',
    );

    sandbox.stub(GiphyService, 'giphyRequest').returns(
      Promise.resolve(giphyResponse),
    );

    const title = 'Vegetable-Pasta Oven Omelet';

    const response = await GiphyService.get(title);
    expect(response).to.deep.equal(giphyResponse);
  });

  it('Should return a error response from giphy server', async () => {
    sandbox.stub(GiphyRequestFormatter, 'format').returns(
      'https://api.giphy.com/v1/gifs/search?api_key=\'\'&q=a&limit=1',
    );

    sandbox.stub(GiphyService, 'giphyRequest').returns(
      Promise.reject(new Error('handle error on rejection')),
    );

    const title = 'Vegetable-Pasta Oven Omelet';

    try {
      await GiphyService.get(title);
    } catch (error) {
      expect(error.msg).to.be.eql('handle error on rejection');
    }
  });
});
