const { Router } = require('express');
const { celebrate } = require('celebrate');

const validationSchema = require('./validation');
const recipes = require('../../controllers/recipes');

const router = new Router({ mergeParams: true });

const joiOptions = {
  allowUnknown: true,
};

/**
 * Get Joi Schema query and using celebrate to create a validation middleware
 * to query string
 * @param {Object} req - Request object
 * @param {Object} res - Response bject
 * @param {Object} next - Next object
 */
const validateMiddleware = (req, res, next) => {
  const schema = validationSchema;

  celebrate(schema, joiOptions)(req, res, next);
};

router.get(
  '/',
  validateMiddleware,
  recipes.handle,
);

module.exports = router;
