// imports
const fetch = require('node-fetch');

// fetches and returns place details from google places api
const fetchFoursquareData = (foursquareId) => {
  const url = `https://api.foursquare.com/v2/venues/${foursquareId}?client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=20171124`
  try {
    return fetch(url, {
      method: 'GET',
    }).then(data => data.json());
  } catch (err) {
    console.error(err);
    return {};
  }
};

// export module
module.exports = fetchFoursquareData;
