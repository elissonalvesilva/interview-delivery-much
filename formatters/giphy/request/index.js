const conf = require('../../../utils/config');

const giphyHost = conf.get('api:giphy:host');

const GIPHY_KEY = process.env.GIPHY_KEY || '';

const GiphyRequestFormatter = {
  format(title) {
    const requestURL = `${giphyHost}?api_key=${GIPHY_KEY}&q=${title}&limit=1`;

    return requestURL;
  },
};

module.exports = GiphyRequestFormatter;
