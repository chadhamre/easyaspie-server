require('dotenv').config();
const Koa = require('koa');
const logger = require('koa-logger');
const router = require('./router/routes');
const cache = require('koa-response-cache');

const app = new Koa();
const PORT = process.env.PORT || 4000;

let REDIS_HOST;
let REDIS_PORT;
if (process.env.DEPLOYMENT === 'local') {
  REDIS_HOST = process.env.REDIS_HOST;
  REDIS_PORT = process.env.REDIS_PORT;
} else {
  REDIS_PORT = process.env.REDIS_URL.split(':')[3];
  REDIS_HOST = `${process.env.REDIS_URL.split(':')[0]}:${process.env.REDIS_URL.split(':')[2]}`;
}

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
