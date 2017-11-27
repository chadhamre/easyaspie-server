// import controllers
const fetchGoogleData = require('./fetch-google');
const summarizeData = require('./summarize-data');
const mapFoursquare = require('./map-foursquare');
const { fetchFoursquareData, fetchFoursquarePhotos } = require('./fetch-foursquare');
const mapYelp = require('./map-yelp');
const fetchYelp = require('./fetch-yelp');
const mapHappycow = require('./map-happycow');
const fetchHappycow = require('./fetch-happycow');

// controller
const placesController = async (ctx) => {
  // fetch data from google
  const googleData = await fetchGoogleData(ctx.params.place_id);
  if (googleData.status !== 'OK') {
    ctx.body = {};
    ctx.status = 400;
  }

  // fetch foursquare data
  let foursquareData;
  const foursquareId = await mapFoursquare(googleData);
  if (foursquareId !== 'NA') {
    foursquareData = await fetchFoursquareData(foursquareId);
  }
  // fetch foursquare photos
  let foursquarePhotos;
  if (foursquareData.photos.count > 5) {
    foursquarePhotos = await fetchFoursquarePhotos(foursquareId);
  }

  // fetch yelp data
  let yelpData;
  const yelpId = await mapYelp(googleData);
  if (yelpId !== 'NA') {
    yelpData = await fetchYelp(yelpId);
  }

  // fetch happw code data
  let happycowData;
  const happycowId = await mapHappycow(googleData);
  if (happycowId !== 'NA') {
    happycowData = await fetchHappycow(happycowId);
  }

  // summarize data from all sources
  const summaryData = await summarizeData(googleData, foursquareData, foursquarePhotos, yelpData, happycowData);
  // return summary json
  ctx.body = summaryData;
  ctx.status = 200;
};

// export module
module.exports = placesController;
