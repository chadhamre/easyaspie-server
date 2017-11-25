  // create object structure
  const summaryData = { ratings: {}, location: {}, photos: [], price: {}, categories: [] };

// this function summarizes the data for the front-end
const mingleData = async (googleData, foursquareData, yelpData) => {


  // add basic data
  summaryData.name = googleData.result.name;
  summaryData.place_id = googleData.result.place_id;
  summaryData.address = googleData.result.formatted_address;
  summaryData.phone = googleData.result.international_phone_number;
  summaryData.location = googleData.result.geometry.location;
  // add ratings
  summaryData.rating = googleData.result.rating * 2;
  // add photos
  summaryData.ratings.google = googleData.result.rating;


  // add foursquare data
  if (foursquareData) {
    summaryData.ratings.foursquare = foursquareData.rating;
    summaryData.bestPhoto = getBestPhoto(foursquareData.bestPhoto);
    // summaryData.price.foursquare = foursquareData.price.tier
    extractCategoriesFoursquare(foursquareData.categories);
    photosFoursquare(foursquareData.photos.groups[0].items);
  }
  // add Yelp data

  if (yelpData) {
    console.log('HERE', yelpData);
    summaryData.ratings.yelp = yelpData.rating;
    summaryData.photos = yelpData.photos;
    extractCategoriesYelp(yelpData.categories);
    getYelpPrice(yelpData.price);
  }

  if (foursquareData.price && yelpData.price) {
    summaryData.rating = (((googleData.result.rating * 2) + foursquareData.rating) / 2).toFixed(1)
    summaryData.price_range = ((foursquareData.price.tier + getYelpPrice(yelpData.price)) / 2).toFixed(0);
    summaryData.rating = (((googleData.result.rating * 2) + foursquareData.rating + (yelpData.rating * 2)) / 3).toFixed(1);
    summaryData.rating = (((googleData.result.rating * 2) + foursquareData.rating) / 2).toFixed(1);

  }

  return summaryData;
};

// helper functions:
const photosFoursquare = (items) => {
  items.forEach((el) => {
    foursquareData.photos.groups[0].items.push(`${el.prefix}${el.width}x${el.height}${el.suffix}`);
  });
};

const getBestPhoto = (el) => {
  const url = (`${el.prefix}${el.width}x${el.height}${el.suffix}`);
  return url;
};

const extractCategoriesFoursquare = (items) => {
  items.forEach((el) => {
    summaryData.categories.push(el.name, el.pluralName, el.shortName);
  });
};

const extractCategoriesYelp = (items) => {
  items.forEach((el) => {
    summaryData.categories.push(el.alias, el.title);
  });
};

const getYelpPrice = (items) => {
  return items.length
}

module.exports = mingleData;
