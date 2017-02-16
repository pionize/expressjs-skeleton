'use strict';

module.exports = (express) => {
    let router = express.Router();
    router.use(require('../../middleware/AccessTokenMiddleware')
        .unless({
            path: [{
                url: '/v1',
                methods: ['GET']
            }, {
                url: '/v1/user',
                methods: ['POST', 'GET']
            }, {
                url: '/v1/user/login',
                methods: ['POST']
            }, {
              url: /\/v1\/user\/(\w+)/,
              methods: ['GET']
            }]
        }));

    router.get('/', (req, res) => res.json({
        status: 200
    }));
    router.use('/user', require('./UserRoute'));
    return router;
};
