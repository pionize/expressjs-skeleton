'use strict';

/**
 * API v2 routes
 *
 * @param express
 * @returns {*}
 */
module.exports = (express) => {
  let router = express.Router();

  router.get('/', (req, res) => res.json({ status: 200 }));
  return router;
};
