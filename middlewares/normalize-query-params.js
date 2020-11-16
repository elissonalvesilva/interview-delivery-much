const _ = require('lodash');

function parseParamValue(value) {
  const parsedValue = value.trim().toLowerCase();

  return parsedValue;
}

/**
 * Normalize the query parameters keys and values to lowercase
 * @return {Void}
 */
function NormalizeQueryParams() {
  return function normalizeQueryParams(req, res, next) {
    req.query = _.transform(req.query, (result, val, key) => {
      const lowerCaseKey = key.toLowerCase();

      if (Array.isArray(val)) { // parse each value from array params
        val.forEach((element) => {
          const parsedValue = parseParamValue(element);
          if (result[lowerCaseKey]) {
            result[lowerCaseKey].push(parsedValue);
          } else {
            result[lowerCaseKey] = [parsedValue];
          }
        });
      } else {
        result[lowerCaseKey] = parseParamValue(val);
      }
    });

    next();
  };
}

module.exports = NormalizeQueryParams;
