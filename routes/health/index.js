const { Router } = require('express');

const router = new Router({ mergeParams: true });

// health check route
router.get('/', async (req, res) => res.json({
  status: 'ok',
}));

module.exports = router;
