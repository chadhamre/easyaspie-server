require('dotenv').config();
const Koa = require('koa');
const logger = require('koa-logger');
const router = require('./router/routes');
const cache = require('koa-response-cache');

const app = new Koa();
const PORT = process.env.PORT || 4000;

const REDIS_HOST = process.env.REDIS_URL.split(':')[2];
const REDIS_PORT = process.env.REDIS_URL.split(':')[3];

console.log('HOST', REDIS_HOST);
console.log('PORT', REDIS_PORT);

const options = {
  expire: 1000000,
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
