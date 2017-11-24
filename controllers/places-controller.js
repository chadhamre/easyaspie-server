placesController = async (ctx, next) => {
  ctx.body = 'Hello World!';
  ctx.status = 200;
}

module.exports = placesController;
