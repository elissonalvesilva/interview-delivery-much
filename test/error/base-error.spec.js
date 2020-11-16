const BaseError = require('../../utils/error/base');

describe('BaseError', () => {
  it('should create a object with message and status', () => {
    const message = 'foo';
    const status = 404;
    const error = new BaseError(message, status);

    expect(error.message).to.equal('foo');
    expect(error.status).to.equal(404);
  });

  it('should contain status 500 when status is not passed', () => {
    const message = 'foo';
    const error = new BaseError(message);

    expect(error.message).to.equal('foo');
    expect(error.status).to.equal(500);
  });
});
