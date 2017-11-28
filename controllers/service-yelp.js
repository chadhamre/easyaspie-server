const GeneralService = require('./service-general');
const fetch = require('node-fetch');

class YelpService extends GeneralService {
  // find id
  map(googleData) {
    return new Promise((resolve) => {
      const nameQuery = encodeURI(googleData.name);
      const googleLat = googleData.geometry.location.lat;
      const googleLng = googleData.geometry.location.lng;
      const apiSlug = 'https://api.yelp.com/v3/businesses/search';
      const url = `${apiSlug}?latitude=${googleLat}&longitude=${googleLng}&term=${
        nameQuery
      }&radius=100&limit=1`;
      try {
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.YELP_TOKEN}`,
          },
        })
          .then(data => data.json())
          .then((data) => {
            if (data.total > 0) {
              resolve(data.businesses[0].id);
            }
            resolve('NA');
          });
      } catch (err) {
        // eslint-disable-next-line
        console.error(err);
        resolve('NA');
      }
    });
  }
  // fetch data
  fetch(id) {
    const url = `https://api.yelp.com/v3/businesses/${encodeURI(id)}`;
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
  }
  // extract summary
  extract(data) {
    const summary = super.summaryStructure(
      'yelp',
      data.name ? data.name : null,
      data.rating ? 2 * data.rating : null,
      data.price ? data.price.length : null,
      data.review_count ? data.review_count : null,
    );
    return summary;
  }
}

module.exports = YelpService;
