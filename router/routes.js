const Router = require('koa-router');
const placesController = require('../controllers/controller-places');

const router = new Router();

router.get('/api/v1/places/:place_id', placesController);

module.exports = router;
