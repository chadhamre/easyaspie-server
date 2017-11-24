const Router = require('koa-router');
const router = new Router();
const placesController = require ('./controllers/places-controller');

router.get('/api/v1/places/', placesController)

module.exports = router
