const Router = require('koa-router');
const placesController = require('./controllers/places-controller');

const router = new Router();

router.get('/api/v1/places/', placesController);

module.exports = router;
