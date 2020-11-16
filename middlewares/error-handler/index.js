const { isCelebrate } = require('celebrate');
const errorFormatter = require('../../formatters/response/errors');
const RequestError = require('../../utils/error/request-error');

/**
 * Return a formatted Error Response
 * @param {Object} err - Err Object from Request
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * @param {Object} next - Next function
 */
function errorHandler(err, req, res, next) { // eslint-disable-line
  if (isCelebrate(err)) {
    return errorFormatter.badRequestResponse(res, {
      err,
      message: err.message,
    });
  }

  if (
    err instanceof SyntaxError
    && err.statusCode === 400
    && err.type === 'entity.parse.failed'
  ) {
    return errorFormatter.badRequestResponse(res, {
      err,
      message: 'Invalid input JSON',
    });
  }

  // request validation error
  if (err instanceof RequestError && err.status === 400) {
    return errorFormatter.badRequestResponse(res, {
      err,
      code: err.code,
      message: err.message,
    });
  }

  return errorFormatter.errorResponse(res, err);
}

module.exports = errorHandler;
