const GeneralService = require('./service-general');
const fetch = require('node-fetch');
const Xray = require('x-ray');
const stringSimilarity = require('string-similarity');
const promisify = require('es6-promisify');

const xray = Xray();

class TripAdvisor extends GeneralService {
  // find id
  static async map(googleData) {
    const googleLat = googleData.geometry.location.lat;
    const googleLng = googleData.geometry.location.lng;
    const url = `https://www.tripadvisor.com/GMapsLocationController?Action=update&from=Restaurants&mapProviderFeature=ta-maps-gmaps&mc=${
      googleLat
    },${googleLng}&mz=18&mw=500&mh=500`;
    try {
      return await fetch(url, {
        method: 'GET',
      })
        .then(data => data.json())
        .then((data) => {
          const arr = [];
          data.restaurants.forEach((el) => {
            arr.push({ id: `${el.customHover.titleUrl}`, name: `${el.customHover.title}` });
            return arr;
          });
          return this.matchingAlgo(arr, googleData.name);
        });
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return 'NA';
    }
  }

  // fetch data
  static async fetch(id) {
    const url = `https://www.tripadvisor.com${id}`;
    try {
      let data = await fetch(url, {
        method: 'GET',
      });
      data = await data.text();
      // console.log(data);
      const parsed = await promisify(xray(data, {
        name: '.heading_title',
        rating: 'span.ui_bubble_rating@content',
        count: 'a.more',
        price: 'span.header_tags.rating_and_popularity',
      }))();
      return {
        name: parsed.name,
        price: this.findRating(parsed.price),
        count: Number(parsed.count.split(' ')[0].replace(',', '')),
        rating: 2 * Number(parsed.rating),
        url,
      };
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return {};
    }
  }

  static findRating(pic) {
    if (pic === '$ - $$') return 1.5;
    if (pic === '$$ - $$$') return 2.5;
    if (pic === '$$$ - $$$$') return 3.5;
    return pic.length;
  }

  // extract summary
  static extract(data) {
    const summary = super.summaryStructure(
      'tripadvisor',
      data.name ? data.name : null,
      data.rating ? data.rating : null,
      data.price ? data.price : null,
      data.count ? data.count : null,
      null,
      null,
      null,
      null,
      data.url ? data.url : null,
    );
    return summary;
  }
}

module.exports = TripAdvisor;
