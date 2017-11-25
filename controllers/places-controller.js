// import dependencies
const fetchGoogleData = require('./fetch-google');
const summarizeData = require('./summarize-data');
const mapFoursquare = require('./map-foursquare');
const fetchFoursquare = require('./fetch-foursquare');

// controller
const placesController = async (ctx) => {
  // fetch data from google
  const googleData = await fetchGoogleData(ctx.params.place_id);
  if (googleData.status !== 'OK') {
    ctx.body = {};
    ctx.status = 400;
  }
  // map place_id to foursquare googleData
  const foursquareId = await mapFoursquare(googleData);
  // fetch foursquare data
  let foursquareData;
  if (foursquareId !== 'NA') {
      foursquareData = await fetchFoursquare(foursquareId);
  }
  console.log(foursquareData)
  // summarize data from all sources
  const summaryData = await summarizeData(googleData,foursquareData.response.venue);
  // return summary json
  ctx.body = summaryData;
  ctx.status = 200;
};

// export module
module.exports = placesController;
