'use strict';

/**
 * API version index
 *
 * @param express
 * @returns {*}
 */
module.exports = (express) => {
  let router = express.Router();

  const defaultVersion = require('./v1/Index')(express);

  router.use('/', defaultVersion);
  router.use('/v1', defaultVersion);
  router.use('/v2', require('./v2/Index')(express));

  return router;
};
