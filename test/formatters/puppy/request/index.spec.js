const PuppyRequestFormatter = require('../../../../formatters/puppy/request');

describe('Puppy Request Formatter', () => {
  it('Should return a formatted request', () => {
    const params = {
      i: 'a',
      q: 'b',
    };
    const formattedRequest = PuppyRequestFormatter.format(params);
    expect(formattedRequest)
      .to.equals('http://www.recipepuppy.com/api/?i=a&q=b');
  });

  it('Should return a formatted request with page', () => {
    const params = {
      i: 'a',
      q: 'b',
      p: 2,
    };
    const formattedRequest = PuppyRequestFormatter.format(params);
    expect(formattedRequest)
      .to.equals('http://www.recipepuppy.com/api/?i=a&q=b&p=2');
  });
});
