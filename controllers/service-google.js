// imports
const fetch = require('node-fetch');

// fetches and returns place details from google places api
const fetchGoogleData = (placeId) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${
    process.env.GOOGLE_PLACES_API_KEY
  }`;
  try {
    return fetch(url, {
      method: 'GET',
    }).then(data => data.json());
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    return {};
  }
};

// export module
module.exports = fetchGoogleData;
