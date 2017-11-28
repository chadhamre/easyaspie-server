// import controllers
const fetchGoogleData = require('./service-google');
const FoursquareService = require('./service-foursquare');

// controller
const placesController = async (ctx) => {
  // fetch data from google
  let googleData = await fetchGoogleData(ctx.params.place_id);
  googleData = googleData.result;
  if (googleData.status !== 'OK') {
    ctx.body = {};
    ctx.status = 400;
  }
  // parse google data
  const summary = {
    name: googleData.name,
    location: googleData.geometry.location,
    place_id: googleData.place_id,
    address: googleData.formatted_address,
    phone: googleData.international_phone_number,
    names: {},
    ratings: {},
    counts: {},
    prices: {},
  };

  // construct array of services
  const services = [new FoursquareService()];
  const promises = services.map(async (service) => {
    const id = await service.map(googleData);
    const data = await service.fetch(id);
    const summary = await service.extract(data);
    return summary;
  });

  // resolve all promises
  await Promise.all(promises).then((arr) => {
    arr.forEach((obj) => {
      for (key in obj) {
        summary[key].foursquare = obj[key].foursquare;
      }
    });
  });

  ctx.body = summary;
  ctx.status = 200;
};

// export module
module.exports = placesController;
