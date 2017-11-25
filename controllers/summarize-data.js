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

// this function summarizes the data for the front-end
const mingleData = async (googleData, foursquareData) => {
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
  // add foursquare data
  if (foursquareData) {
    summaryData.ratings.foursquare = foursquareData.rating;
    summaryData.rating = (((googleData.result.rating * 2) + foursquareData.rating) / 2).toFixed(1);
    summaryData.bestPhoto = getBestPhoto(foursquareData.bestPhoto);
    summaryData.photos = constructUrl(foursquareData.photos.groups[0].items);
    summaryData.categories = extractCategories(foursquareData.categories);
  }
  if (foursquareData.price) {
    summaryData.price_range = foursquareData.price.tier;
  }

  return summaryData;
};

module.exports = mingleData;
