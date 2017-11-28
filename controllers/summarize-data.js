// import dependencies
const pluralize = require('pluralize');

// this function summarizes the data for the front-end
const mingleData = async (googleData, foursquareData, foursquarePhotos, yelpData) => {
  // create object structure
  const summaryData = {
    ratings: {},
    names: {},
    location: {},
    prices: {},
    categories: [],
    count: {},
    photos: [],
    hours: [],
  };

  // helper functions -----------------------------------------
  // foursquare helper functions
  const getBestPhoto = el => `${el.prefix}${el.width}x${el.height}${el.suffix}`;

  const photosFoursquare = (items) => {
    items.forEach((el) => {
      summaryData.photos.push({ uri: `${el.prefix}${el.width}x${el.height}${el.suffix}` });
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
  if (!googleData.result.reviews) {
    summaryData.review_count.google = 0;
  } else {
    summaryData.review_count.google = googleData.result.reviews.length;
  }

  // add foursquare data
  if (foursquareData) {
    // add foursquare photos
    if (foursquarePhotos) {
      photosFoursquare(foursquarePhotos.items);
    }
  }

  // add Yelp data
  if (yelpData) {
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
