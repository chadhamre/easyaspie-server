// import controllers
const fetchGoogleData = require('./service-google');
const FoursquareService = require('./service-foursquare');
const YelpService = require('./service-yelp');
const HappyCowService = require('./service-happycow');

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
    phone: googleData.international_phone_number,
    address: googleData.formatted_address,
    place_id: googleData.place_id,
    location: googleData.geometry.location,
    hours: googleData.opening_hours.weekday_text ? googleData.opening_hours.weekday_text : null,
    names: {},
    ratings: {
      google: 2 * googleData.rating,
    },
    counts: {},
    prices: {},
  };

  // construct array of services
  const services = [new FoursquareService(), new YelpService(), new HappyCowService()];
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
        const service = Object.keys(obj[key])[0];
        summary[key][service] = obj[key][service];
      }
    });
  });

  ctx.body = summary;
  ctx.status = 200;
};

// export module
module.exports = placesController;
