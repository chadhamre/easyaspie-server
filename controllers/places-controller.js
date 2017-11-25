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

  // fetch foursquare data
  let foursquareData
  const foursquareId = await mapFoursquare(googleData)
  if (foursquareId !== 'NA') {
    foursquareData = await fetchFoursquare(foursquareId)
  }

  // fetch yelp data
  let yelpData
  const yelpId = await mapYelp(googleData)
  if (yelpId !== 'NA') {
    yelpData = await fetchYelp(yelpId)
  }

  // summarize data from all sources
  const summaryData = await summarizeData(googleData, foursquareData, yelpData);
  // return summary json
  ctx.body = summaryData;
  ctx.status = 200;
};

// export module
module.exports = placesController;
