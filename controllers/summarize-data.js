// import dependencies
const pluralize = require('pluralize');

// this function summarizes the data for the front-end
const mingleData = async (googleData, foursquareData, foursquarePhotos, yelpData) => {
  // create object structure
  const summaryData = {
    ratings: {},
    names: {},
    location: {},
    photos: [],
    prices: {},
    categories: [],
  };

  // foursqure helper functions
  const getBestPhoto = el => `${el.prefix}${el.width}x${el.height}${el.suffix}`;

  const photosFoursquare = (items) => {
    items.forEach((el) => {
      summaryData.photos.push(`${el.prefix}${el.width}x${el.height}${el.suffix}`);
    });
  };

  const extractCategoriesFoursquare = (items) => {
    items.forEach((el) => {
      summaryData.categories.push(el.name, el.pluralName, el.shortName);
    });
  };

  // yelp helper functions
  const addYelpPhotos = (photos) => {
    photos.forEach(photo => summaryData.photos.push(photo));
  };

  const addYelpCategories = (items) => {
    items.forEach((el) => {
      summaryData.categories.push(el.alias, el.title);
    });
  };

  // generate averages
  const getAverage = (object, name) => {
    const keys = Object.keys(object);
    const total = keys.reduce((accum, key) => accum + summaryData[`${name}s`][key], 0);
    summaryData[name] = (total / keys.length).toFixed(1);
  };

  // depulicate and clean category array
  const dedupCategories = (array) => {
    const splitArr = [];
    array.forEach(item => item.split(/ or | \/ /).forEach(word => splitArr.push(word)));
    const singularArr = splitArr.map(item => pluralize.singular(item.toLowerCase()));
    const strippedArr = singularArr.map(item => item.replace(' restaurant', '').replace('_', ' '));
    const newArray = [];
    strippedArr.forEach((item) => {
      if (newArray.indexOf(item) === -1) newArray.push(item);
    });
    summaryData.categories = newArray;
  };

  // add google data -----------------------------------------
  summaryData.name = googleData.result.name;
  summaryData.place_id = googleData.result.place_id;
  summaryData.address = googleData.result.formatted_address;
  summaryData.phone = googleData.result.international_phone_number;
  summaryData.location = googleData.result.geometry.location;
  summaryData.ratings.google = 2 * googleData.result.rating;
  summaryData.names.google = googleData.result.name;

  // add foursquare data
  if (foursquareData) {
    summaryData.ratings.foursquare = foursquareData.rating;
    summaryData.bestPhoto = getBestPhoto(foursquareData.bestPhoto);
    summaryData.names.foursquare = foursquareData.name;
    if (foursquareData.price) summaryData.prices.foursquare = foursquareData.price.tier;
    extractCategoriesFoursquare(foursquareData.categories);
    if (foursquarePhotos) photosFoursquare(foursquarePhotos.items);
  }

  // add Yelp data
  if (yelpData) {
    summaryData.ratings.yelp = 2 * yelpData.rating;
    summaryData.names.yelp = yelpData.name;
    if (yelpData.price) summaryData.prices.yelp = yelpData.price.length;
    addYelpPhotos(yelpData.photos);
    addYelpCategories(yelpData.categories);
  }

  // summarizing functions
  dedupCategories(summaryData.categories);
  getAverage(summaryData.prices, 'price');
  getAverage(summaryData.ratings, 'rating');

  return summaryData;
};

module.exports = mingleData;
