// helper functions:
const constructUrl = (items) => {
  const arr = [];
  items.forEach((el) => {
    arr.push(`${el.prefix}${el.width}x${el.height}${el.suffix}`);
  });
  return arr;
};

const getBestPhoto = (el) => {
  const url = (`${el.prefix}${el.width}x${el.height}${el.suffix}`);
  return url;
};

const extractCategories = (items) => {
  const arr = [];

  items.forEach((el) => {
    arr.push(el.name, el.pluralName, el.shortName);
  });
  return arr;
};

const extractCategoriesYelp = (items) => {
  const arr = [];

  items.forEach((el) => {
    arr.push(el.alias, el.title);
  });
  return arr;
};

const getYelpPrice = (items) => {
  return items.length
}

// this function summarizes the data for the front-end
const mingleData = async (googleData, foursquareData, yelpData) => {
  // create object structure
  const summaryData = { ratings: {}, location: {}, photos: [{}] };
  // add basic data
  summaryData.name = googleData.result.name;
  summaryData.place_id = googleData.result.place_id;
  summaryData.address = googleData.result.formatted_address;
  summaryData.phone = googleData.result.international_phone_number;
  summaryData.location = googleData.result.geometry.location;
  // add ratings
  summaryData.rating = (((googleData.result.rating) * 2) / 1).toFixed(1);
  // add photos
  summaryData.ratings.google = googleData.result.rating;
  summaryData.ratings.yelp = yelpData.rating;
  // add foursquare data
  if (foursquareData && yelpData) {
    console.log('HERE', yelpData);
    summaryData.ratings.foursquare = foursquareData.rating;
    summaryData.rating = (((googleData.result.rating * 2) + foursquareData.rating + (yelpData.rating * 2)) / 3).toFixed(1);
    summaryData.bestPhoto = getBestPhoto(foursquareData.bestPhoto);
    summaryData.photos = constructUrl(foursquareData.photos.groups[0].items).concat(yelpData.photos);
    summaryData.categories = extractCategories(foursquareData.categories).concat(extractCategoriesYelp(yelpData.categories));
  }
  if (foursquareData.price || yelpData.price) {
    summaryData.price_range = ((foursquareData.price.tier + getYelpPrice(yelpData.price)) / 2).toFixed(0);
  }


  return summaryData;
};

module.exports = mingleData;
