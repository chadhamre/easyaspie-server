require('dotenv').config();
const Koa = require('koa');
const logger = require('koa-logger');
const router = require('./router/routes');
const cache = require('koa-response-cache');

const app = new Koa();
const PORT = process.env.PORT || 4000;

const REDIS_HOST = process.env.REDIS_URL.split(':')[0];
const REDIS_PORT = process.env.REDIS_URL.split(':')[1];

const options = {
  expire: 60,
  routes: ['/api/(.*)'],
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
};

app
  .use(logger())
  .use(cache(options))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT);
