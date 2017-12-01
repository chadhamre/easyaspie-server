const GeneralService = require('./service-general');
const fetch = require('node-fetch');
const stringSimilarity = require('string-similarity');

const fieldNames = [
  'name',
  'overall_star_rating',
  'website',
  'category',
  'category_list',
  'about',
  'price_range',
  'restaurant_specialties',
  'likes',
  'rating_count',
  'cover',
  'page_token',
];

class FacebookService extends GeneralService {
  // find id
  static async map(googleData) {
    const googleLat = googleData.geometry.location.lat;
    const googleLng = googleData.geometry.location.lng;
    const apiSlug = 'https://graph.facebook.com/v2.11/search';
    const url = `${apiSlug}?type=place&center=${googleLat},${
      googleLng
    }&distance=100&fields=name,overall_star_rating,website,category`;
    try {
      return await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.FACEBOOK_TOKEN}`,
        },
      })
        .then(data => data.json())
        .then(data => this.matchingAlgo(data.data, googleData.name));
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return 'NA';
    }
  }

  // fetch data
  static fetch(id) {
    // console.log('FACEBOOK ID:', id);
    const url = `https://graph.facebook.com/v2.11/${id}?fields=${fieldNames.join()}`;
    try {
      return fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.FACEBOOK_TOKEN}`,
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
    const categories = data.category_list.map(category => category.name);
    const summary = super.summaryStructure(
      'facebook',
      data.name ? data.name : null,
      data.overall_star_rating ? 2 * data.overall_star_rating : null,
      data.price_range ? data.price_range.length : null,
      data.rating_count ? data.rating_count : null,
      null,
      categories || null,
      null,
      data.cover ? data.cover.source : null,
      data.page_token ? `https://facebook.com/${data.page_token}` : null,
    );
    return summary;
  }
}

module.exports = FacebookService;
