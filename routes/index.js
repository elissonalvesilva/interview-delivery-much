const versionRoute = require('./version');
const healthRoute = require('./health');
const recipesRoute = require('./recipes');

const routes = {
  versionRoute,
  healthRoute,
  recipesRoute,
};

module.exports = routes;
