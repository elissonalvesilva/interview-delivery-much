const GiphyRequestFormatter = require('../../../../formatters/giphy/request');

describe('Giphy Request Formatter', () => {
  it('Should return a formatted request', () => {
    const formattedRequest = GiphyRequestFormatter.format('title');
    expect(formattedRequest)
      .to.equals(
        'https://api.giphy.com/v1/gifs/search?api_key=&q=title&limit=1',
      );
  });
});
