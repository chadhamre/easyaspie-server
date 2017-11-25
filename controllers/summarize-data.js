// this function summarizes the data for the front-end
const mingleData = async (googleData, foursquareData) => {
  // create object structure
  const summaryData = { ratings: {}, location: {} };
  // add basic data
  summaryData.name = googleData.result.name;
  summaryData.place_id = googleData.result.place_id;
  summaryData.address = googleData.result.formatted_address;
  summaryData.phone = googleData.result.international_phone_number;
  summaryData.location = googleData.result.geometry.location;
  // add ratings
  summaryData.rating = (googleData.result.rating * 2 / 1).toFixed(1);
  // add photos
  summaryData.ratings.google = googleData.result.rating;
  // add foursquare data
  if (foursquareData) {
    summaryData.ratings.foursquare = foursquareData.rating;
    summaryData.rating = ((((googleData.result.rating * 2) + foursquareData.rating)) / 2).toFixed(1);
  }
  return summaryData;
};

module.exports = mingleData;
