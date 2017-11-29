// import controllers
const fetchGoogleData = require('./service-google');
const FoursquareService = require('./service-foursquare');
const YelpService = require('./service-yelp');
const HappyCowService = require('./service-happycow');
const GeneralService = require('./service-general');
const FacebookService = require('./service-facebook');
const TripAdvisorService = require('./service-tripadvisor');

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
    hours:
      googleData.opening_hours && googleData.opening_hours.weekday_text
        ? googleData.opening_hours.weekday_text
        : null,
    names: {
      google: googleData.name,
    },
    ratings: {
      google: 2 * googleData.rating,
    },
    counts: {},
    prices: {},
    bestPhoto: null,
    categories: {},
    photos: [],
    cover: null,
  };

  // construct array of services
  const services = [
    FoursquareService,
    YelpService,
    HappyCowService,
    FacebookService,
    TripAdvisorService,
  ];
  const promises = services.map(async (service) => {
    const id = await service.map(googleData);
    if (id !== 'NA') {
      const data = await service.fetch(id);
      const summary = await service.extract(data);
      if (service.fetchPhotos) {
        summary.photos = await service.fetchPhotos(id);
      }
      return summary;
    }
    return null;
  });

  // resolve all promises
  await Promise.all(promises).then((arr) => {
    arr.forEach((obj) => {
      for (const key in obj) {
        if (key === 'bestPhoto') {
          if (obj[key]) summary.bestPhoto = obj[key];
        } else if (key === 'photos' && obj[key] && obj[key].length > 1) {
          obj[key].forEach((el) => {
            if (el.prefix) {
              summary.photos.push({ uri: `${el.prefix}${el.width}x${el.height}${el.suffix}` });
            } else {
              summary.photos.push({ uri: el });
            }
          });
        } else if (key === 'cover') {
          if (obj[key]) summary.cover = obj[key];
        } else if (obj[key] !== null) {
          const service = Object.keys(obj[key])[0];
          summary[key][service] = obj[key][service];
        }
      }
    });
  });

  // combine source data

  summary.categories = GeneralService.dedupCategories(summary.categories);
  summary.rating = 10 * GeneralService.getAverage(summary.ratings);
  summary.price = GeneralService.getAverage(summary.prices);

  // return data to front end
  ctx.body = summary;
  ctx.status = 200;
};

// export module
module.exports = placesController;
