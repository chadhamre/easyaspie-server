// imports
const fetch = require('node-fetch');
const Xray = require('x-ray');
const osmosis = require('osmosis');

const xray = Xray();


// fetches and returns place details from google places api
const fetchHappycowData = (happycowId) =>
  new Promise((resolve) => {
    const url = `https://www.happycow.net${happycowId}`;
    try {
      return fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.YELP_TOKEN}`,
        },
      })
      .then(data => data.text())
      .then(data => {
        xray(data, ['li > a > .details__list > meta@content'])((err, details) => {
          resolve({avg:details[1], number:details[3]})
        })
      });
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return {};
    }
  });

// export module
module.exports = fetchHappycowData;
