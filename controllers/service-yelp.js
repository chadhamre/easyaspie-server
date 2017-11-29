const GeneralService = require('./service-general');
const fetch = require('node-fetch');
const stringSimilarity = require('string-similarity');

class YelpService extends GeneralService {
  // find id
  map(googleData) {
    return new Promise((resolve) => {
      const nameQuery = encodeURI(googleData.name);
      const googleLat = googleData.geometry.location.lat;
      const googleLng = googleData.geometry.location.lng;
      const apiSlug = 'https://api.yelp.com/v3/businesses/search';
      const url = `${apiSlug}?latitude=${googleLat}&longitude=${googleLng}&radius=100&limit=20`;
      try {
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.YELP_TOKEN}`,
          },
        })
          .then(data => data.json())
          .then((data) => {
            if (data.error) return resolve('NA');
            if (data.total > 0) {
              const titles = [];
              const ids = [];
              data.businesses.forEach((item) => {
                ids.push(item.id);
                titles.push(item.name);
              });
              if (titles.length === 0) return resolve('NA');
              const nameQueryClean = nameQuery
                .toLowerCase()
                .replace(' the restaurant' || ' retaurant', '');
              const titlesClean = titles.map(title =>
                title.toLowerCase().replace(' the restaurant' || ' restaurant', ''));
              const matches = stringSimilarity.findBestMatch(nameQueryClean, titlesClean);
              if (matches.bestMatch.rating >= 0.5) {
                const match = matches.bestMatch.target;
                resolve(ids[titlesClean.indexOf(match)]);
              } else {
                resolve('NA');
              }
            }
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
