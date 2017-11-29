const GeneralService = require('./service-general');
const fetch = require('node-fetch');
const Xray = require('x-ray');
const stringSimilarity = require('string-similarity');
const promisify = require('es6-promisify');

const xray = Xray();

class HappyCowService extends GeneralService {
  // find id
  static async map(googleData) {
    const googleLat = googleData.geometry.location.lat;
    const googleLng = googleData.geometry.location.lng;
    const types = '&vegan=true&vegetarian=true&vegfriendly=true';
    const apiSlug = 'https://www.happycow.net/searchmap';
    const url = `${apiSlug}?lat=${googleLat}&lng=${googleLng}&limit=18${types}`;
    try {
      let data = await fetch(url, {
        method: 'GET',
        headers: {
          Referer: 'https://www.happycow.net',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/11.0.1 Safari/604.3.5',
        },
      });
      data = await data.text();
      const titles = await promisify(xray(data, ['.thumbnail__details@data-name']))();
      if (titles.length > 0) {
        const links = await promisify(xray(data, ['.thumbnail__link@href']))();
        const titlesClean = titles.map(title =>
          title.toLowerCase().replace(/restaurant|the\srestaurant/g, ''));
        const nameQueryClean = googleData.name
          .toLowerCase()
          .replace(/restaurant|the\srestaurant/g, '');
        const matches = stringSimilarity.findBestMatch(nameQueryClean, titlesClean);
        if (matches.bestMatch.rating > 0.6) {
          const match = matches.bestMatch.target;
          return links[titlesClean.indexOf(match)];
        }
        return 'NA';
      }
      return 'NA';
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return 'NA';
    }
  }

  // fetch data
  static async fetch(id) {
    const url = `https://www.happycow.net${id}`;
    try {
      let data = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.YELP_TOKEN}`,
        },
      });
      data = await data.text();
      const parsed = await promisify(xray(data, {
        details: ['li > a > .details__list > meta@content'],
        name: '.header__title',
      }))();
      return {
        rating: parsed.details[1],
        count: Number(parsed.details[3]),
        name: parsed.name,
      };
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return {};
    }
  }

  // extract summary
  static extract(data) {
    const summary = super.summaryStructure(
      'happycow',
      data.name ? data.name : null,
      data.rating ? 2 * data.rating : null,
      null,
      data.count ? data.count : null,
      null,
      null,
      null,
    );
    return summary;
  }
}

module.exports = HappyCowService;
