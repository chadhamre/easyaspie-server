// imports
const fetch = require('node-fetch');

// fetches and returns place details from google places api
const fetchYelpData = (yelpId) => {
  const url = `https://api.yelp.com/v3/businesses/${yelpId}`;
  try {
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.YELP_TOKEN}`,
      },
    }).then(data => data.json());
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    return {};
  }
};

// export module
module.exports = fetchYelpData;
