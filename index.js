require('dotenv').config();
const Koa = require('koa');
const logger = require('koa-logger');
const router = require('./router/routes');

const app = new Koa();
const PORT = process.env.PORT || 4000;

app
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT || 4000);
