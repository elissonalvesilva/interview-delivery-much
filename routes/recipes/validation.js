const { Joi } = require('celebrate');
const { throwBadRequest } = require('../../utils/error/bad-request');

module.exports = {
  query: Joi.object({
    i: Joi.array().items(Joi.string()).single().required(),
    q: Joi.string(),
    page: Joi.number().optional(),
  }).error((errors) => {
    if (errors[0]) {
      if (errors[0].code === 'object.missing'
        || errors[0].code === 'any.required') {
        throwBadRequest({
          code: 3002,
          message: 'Missing i',
          fields: ['i'],
        });
      } else {
        let fields = [];
        if (errors[0].path) {
          fields = errors[0].path;
        }
        // throw bad request with default message
        throwBadRequest({
          fields,
        });
      }
    }
  }),
};
