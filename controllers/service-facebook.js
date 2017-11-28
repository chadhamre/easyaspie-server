const GeneralService = require('./service-general');
const fetch = require('node-fetch');
const stringSimilarity = require('string-similarity');

class FacebookService extends GeneralService {
  // find id
  map(googleData) {
    return new Promise((resolve) => {
      const nameQuery = encodeURI(googleData.name);
      const googleLat = googleData.geometry.location.lat;
      const googleLng = googleData.geometry.location.lng;
      const apiSlug = 'https://graph.facebook.com/v2.11/search';
      const url = `${apiSlug}?type=place&categories=["FOOD_BEVERAGE"]&center=${googleLat},${
        googleLng
      }&distance=100`;
      try {
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.FACEBOOK_TOKEN}`,
          },
        })
          .then(data => data.json())
          .then((data) => {
            const titles = [];
            const ids = [];
            data.data.forEach((item) => {
              ids.push(item.id);
              titles.push(item.name);
            });

            const matches = stringSimilarity.findBestMatch(googleData.name, titles);
            if (matches.bestMatch.rating > 0.75) {
              const match = matches.bestMatch.target;
              resolve(ids[titles.indexOf(match)]);
            } else {
              resolve('NA');
            }
          });
      } catch (err) {
        console.error(err);
        resolve('NA');
      }
    });
  }
  // fetch data
  fetch(id) {
    const url = `https://graph.facebook.com/v2.11/${
      id
    }?fields=name,overall_star_rating,website,category,category_list,about,price_range,restaurant_specialties,likes,rating_count`;
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
  extract(data) {
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
    );
    return summary;
  }
}

module.exports = FacebookService;
