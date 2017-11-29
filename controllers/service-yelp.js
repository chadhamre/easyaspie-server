const GeneralService = require('./service-general');
const fetch = require('node-fetch');

class YelpService extends GeneralService {
  // find id
  static async map(googleData) {
    const nameQuery = encodeURI(googleData.name);
    const googleLat = googleData.geometry.location.lat;
    const googleLng = googleData.geometry.location.lng;
    const apiSlug = 'https://api.yelp.com/v3/businesses/search';
    const url = `${apiSlug}?latitude=${googleLat}&longitude=${googleLng}&term=${
      nameQuery
    }&radius=100&limit=1`;
    try {
      return await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.YELP_TOKEN}`,
        },
      })
        .then(data => data.json())
        .then((data) => {
          if (data.error) return 'NA';
          if (data.total > 0) return data.businesses[0].id;
          return 'NA';
        });
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return 'NA';
    }
  }
  // fetch data
  static fetch(id) {
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
  static extract(data) {
    const categories = data.categories.map(category => category.alias);
    const summary = super.summaryStructure(
      'yelp',
      data.name ? data.name : null,
      data.rating ? 2 * data.rating : null,
      data.price ? data.price.length : null,
      data.review_count ? data.review_count : null,
      null,
      categories || null,
      null,
      null,
    );
    return summary;
  }
}

module.exports = YelpService;
