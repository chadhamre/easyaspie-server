// import controllers
const fetchGoogleData = require('./fetch-google');
const summarizeData = require('./summarize-data');
const mapFoursquare = require('./map-foursquare');
const fetchFoursquare = require('./fetch-foursquare');
const mapYelp = require('./map-yelp');
const fetchYelp = require('./fetch-yelp');

// controller
const placesController = async (ctx) => {
  // fetch data from google
  const googleData = await fetchGoogleData(ctx.params.place_id);
  if (googleData.status !== 'OK') {
    ctx.body = {};
    ctx.status = 400;
  }

  // map place_id to foursquare googleData
  const foursquareData = await mapFoursquare(googleData)
    .then(id => fetchFoursquare(id));

  // map place_id to foursquare googleData
  const yelpData = await mapYelp(googleData)
    .then(id => fetchYelp(id));

  // summarize data from all sources
  const summaryData = await summarizeData(googleData, foursquareData.response.venue);
  // return summary json
  ctx.body = summaryData;
  ctx.status = 200;
};

// export module
module.exports = placesController;
