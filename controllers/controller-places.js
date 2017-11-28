// import controllers
const fetchGoogleData = require('./service-google');
const FoursquareService = require('./service-foursquare');

// controller
const placesController = async (ctx) => {
  // fetch data from google
  const googleData = await fetchGoogleData(ctx.params.place_id);
  if (googleData.status !== 'OK') {
    ctx.body = {};
    ctx.status = 400;
  }

  // construct array of services
  const services = [new FoursquareService()];

  const promises = services.map(async (service) => {
    const id = await service.map(googleData);
    console.log(id);
  });

  ctx.body = {};
  ctx.status = 200;
};

// export module
module.exports = placesController;
