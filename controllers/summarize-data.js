// import dependencies
const pluralize = require('pluralize')

// this function summarizes the data for the front-end
const mingleData = async (googleData, foursquareData, yelpData) => {

  // create object structure
  const summaryData = { ratings: {}, location: {}, photos: [], prices:{}, categories: [] };

  // helper functions -----------------------------------------
  // foursqure helper functions
  const getBestPhoto = (el) => {
    const url = (`${el.prefix}${el.width}x${el.height}${el.suffix}`);
    return url;
  };

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
    photos.forEach(photo => summaryData.photos.push(photo))
  }

  const addYelpCategories = (items) => {
    items.forEach((el) => {
      summaryData.categories.push(el.alias, el.title);
    });
  };

  // generate averages
  const getAverage = (object, name) => {
    let keys = Object.keys(object)
    let total = 0;
    keys.forEach(key => total += summaryData[name+'s'][key] )
    summaryData[name] = (total / keys.length).toFixed(1)
  }

  dedupCategories = (array) => {
    array.forEach((item, key) => {
      console.log(item, key)
      array[key] = pluralize.singular(item.toLowerCase())
    })

    let newArray = [];
    array.forEach(item => {
      if (newArray.indexOf(item) === -1) newArray.push(item)
    })

    summaryData.categories = newArray;
  }

  // add google data -----------------------------------------
  summaryData.name = googleData.result.name;
  summaryData.place_id = googleData.result.place_id;
  summaryData.address = googleData.result.formatted_address;
  summaryData.phone = googleData.result.international_phone_number;
  summaryData.location = googleData.result.geometry.location;
  summaryData.ratings.google = 2 * googleData.result.rating;

  // add foursquare data
  if (foursquareData) {
    summaryData.ratings.foursquare = foursquareData.rating;
    summaryData.bestPhoto = getBestPhoto(foursquareData.bestPhoto);
    if (foursquareData.price) summaryData.prices.foursquare = foursquareData.price.tier;
    extractCategoriesFoursquare(foursquareData.categories);
    photosFoursquare(foursquareData.photos.groups[0].items);
  }

  // add Yelp data
  if (yelpData) {
    summaryData.ratings.yelp = 2 * yelpData.rating;
    if (yelpData.price) summaryData.prices.yelp = yelpData.price.length;
    addYelpPhotos(yelpData.photos);
    addYelpCategories(yelpData.categories);
  }

  // summarizing functions
  dedupCategories(summaryData.categories)
  getAverage(summaryData.prices, 'price')
  getAverage(summaryData.ratings, 'rating')

  return summaryData;
};



module.exports = mingleData;
