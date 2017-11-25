// import dependencies
const fetchGoogleData = require('./service-google');
const summarizeData = require('./summarize-data');

// controller
const placesController = async (ctx) => {
  // fetch data from google
  const googleData = await fetchGoogleData(ctx.params.place_id);
  if (googleData.status !== 'OK') {
    ctx.body = {};
    ctx.status = 400;
  }
  // mingle data from all sources
  const summaryData = await summarizeData(googleData);
  // return summary json
  ctx.body = summaryData;
  ctx.status = 200;
};

// export module
module.exports = placesController;
