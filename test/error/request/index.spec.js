const RequestError = require('../../../utils/error/request-error');

describe('RequestError', () => {
  it('when object in constructor is empty', () => {
    const requestError = new RequestError({});

    expect(requestError.message).to.be.equal('Request validation failed');
    expect(requestError.status).to.be.equal(400);
    expect(requestError.code).to.be.equal(1001);
    expect(requestError.fields).to.eql([]);
  });

  it('when code and message are passed', () => {
    const code = 1003;
    const message = 'foo';
    const requestError = new RequestError({ code, message });

    expect(requestError.message).to.be.equal(message);
    expect(requestError.status).to.be.equal(400);
    expect(requestError.code).to.be.equal(1003);
    expect(requestError.fields).to.eql([]);
  });

  it('when fields has elements and message is undefined', () => {
    const fields = ['foo', 'bar'];
    const errMsg = `Invalid arguments for parameter "${fields.join(', ')}"`;
    const requestError = new RequestError({ fields });

    expect(requestError.message).to.be.equal(errMsg);
    expect(requestError.status).to.be.equal(400);
    expect(requestError.code).to.be.equal(1001);
    expect(requestError.fields).to.eql(['foo', 'bar']);
  });
});
