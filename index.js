// import dependencies
require('dotenv').config();
const Koa = require('koa');
const logger = require('koa-logger');
const router = require('./router/routes');
const cache = require('koa-response-cache');

// instantiate class
const app = new Koa();

// set environment variables
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

// set redis options
const options = {
  expire: 10,
  // expire: 1000000,
  routes: ['/api/(.*)'],
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
};

// run app
app
  // .use(logger())
  .use(cache(options))
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(PORT);

module.exports = server;
