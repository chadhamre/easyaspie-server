require('dotenv').config();
const Koa = require('koa');
const logger = require('koa-logger');

const router = require('./router/routes');
const app = new Koa();

app
  .use(logger())
  .use(router.routes())
  .listen(process.env.PORT || 4000);
