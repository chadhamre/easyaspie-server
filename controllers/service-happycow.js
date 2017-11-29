const GeneralService = require('./service-general');
const fetch = require('node-fetch');
const Xray = require('x-ray');
const stringSimilarity = require('string-similarity');

const xray = Xray();

class HappyCowService extends GeneralService {
  // find id
  map(googleData) {
    return new Promise((resolve) => {
      const googleLat = googleData.geometry.location.lat;
      const googleLng = googleData.geometry.location.lng;
      const types = '&vegan=true&vegetarian=true&vegfriendly=true';
      const apiSlug = 'https://www.happycow.net/searchmap';
      const url = `${apiSlug}?lat=${googleLat}&lng=${googleLng}&limit=18${types}`;
      try {
        fetch(url, {
          method: 'GET',
          headers: {
            Referer: 'https://www.happycow.net',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/11.0.1 Safari/604.3.5',
          },
        })
          .then(data => data.text())
          .then((data) => {
            xray(data, ['.thumbnail__details@data-name'])((err, titles) => {
              if (titles.length > 0) {
                xray(data, ['.thumbnail__link@href'])((err, links) => {
                  const matches = stringSimilarity.findBestMatch(googleData.name, titles);
                  if (matches.bestMatch.rating > 0.75) {
                    const match = matches.bestMatch.target;
                    // console.log(match,titles)
                    resolve(links[titles.indexOf(match)]);
                  } else resolve('NA');
                });
              } else {
                resolve('NA');
              }
            });
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
    return new Promise((resolve) => {
      const url = `https://www.happycow.net${id}`;
      try {
        return fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.YELP_TOKEN}`,
          },
        })
          .then(data => data.text())
          .then((data) => {
            xray(data, {
              details: ['li > a > .details__list > meta@content'],
              name: '.header__title',
            })((err, parsed) => {
              resolve({
                rating: parsed.details[1],
                count: Number(parsed.details[3]),
                name: parsed.name,
              });
            });
          });
      } catch (err) {
        // eslint-disable-next-line
        console.error(err);
        return {};
      }
    });
  }
  // extract summary
  extract(data) {
    const summary = super.summaryStructure(
      'happycow',
      data.name ? data.name : null,
      data.rating ? 2 * data.rating : null,
      null,
      data.count ? data.count : null,
      null,
      null,
    );
    return summary;
  }
}

module.exports = HappyCowService;
