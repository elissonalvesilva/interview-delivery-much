const RequestError = require('./request-error');

const throwBadRequest = ({
  code, message, fields,
}) => {
  throw new RequestError({
    code,
    message,
    fields,
  });
};

module.exports = { throwBadRequest };
