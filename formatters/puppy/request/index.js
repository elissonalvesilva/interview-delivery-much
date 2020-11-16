const conf = require('../../../utils/config');

const puppyHost = conf.get('api:puppy:host');

const PuppyFormatterRequest = {
  format(params) {
    const { i, q, p } = params;
    let requestUrl = `${puppyHost}?`;

    if (i) {
      requestUrl += `i=${i}`;
    }

    if (q) {
      requestUrl += `&q=${q}`;
    }

    if (p) {
      requestUrl += `&p=${p}`;
    }

    return requestUrl;
  },
};

module.exports = PuppyFormatterRequest;
