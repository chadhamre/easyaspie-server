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
      const apiSlug = '  https://graph.facebook.com/v2.11/search';
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
              console.log(match);
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
    console.log(id);
  }
  // extract summary
  extract(data) {
    //   const categories = data.categories.map(category => category.alias);
    //   const summary = super.summaryStructure(
    //     'yelp',
    //     data.name ? data.name : null,
    //     data.rating ? 2 * data.rating : null,
    //     data.price ? data.price.length : null,
    //     data.review_count ? data.review_count : null,
    //     null,
    //     categories || null,
    //     null,
    //   );
    //   return summary;
  }
}

module.exports = FacebookService;
