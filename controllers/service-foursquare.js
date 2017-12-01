// imports
const fetch = require('node-fetch');
const GeneralService = require('./service-general');
const stringSimilarity = require('string-similarity');

// class definition
class FoursquareService extends GeneralService {
  // the map method tries to match a google places ID with a foursquare ID
  static async map(googleData) {
    // build api URL
    const googleLat = googleData.geometry.location.lat;
    const googleLng = googleData.geometry.location.lng;
    const apiSlug = 'https://api.foursquare.com/v2/venues/search?ll=';
    const clientSecret = process.env.FOURSQUARE_CLIENT_SECRET;
    const clientId = process.env.FOURSQUARE_CLIENT_ID;
    const url = `${apiSlug}${googleLat},${googleLng}&radius=300&client_id=${
      clientId
    }&client_secret=${clientSecret}&v=20171124`;
    // try searching foursquare
    try {
      return await fetch(url, { method: 'GET' })
        .then(data => data.json())
        .then((data) => {
          if (data.meta.code === 200 && data.response.venues.length > 0) {
            return this.matchingAlgo(data.response.venues, googleData.name);
          }
        });
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return 'NA';
    }
  }

  // the fetch method tries to fetch data for a given foursquare ID
  static async fetch(id) {
    const url = `https://api.foursquare.com/v2/venues/${id}?client_id=${
      process.env.FOURSQUARE_CLIENT_ID
    }&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=20171124`;
    try {
      const id = await fetch(url, { method: 'GET' })
        .then(data => data.json())
        .then(data => data.response.venue);
      return id;
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return {};
    }
  }

  static async fetchPhotos(id) {
    const url = `https://api.foursquare.com/v2/venues/${id}/photos?limit=100&client_id=${
      process.env.FOURSQUARE_CLIENT_ID
    }&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=20171124`;
    try {
      const id = await fetch(url, { method: 'GET' })
        .then(data => data.json())
        .then(data => data.response.photos.items);
      return id;
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
      return {};
    }
  }

  // the extract method extracts the important information form the foursquare data
  static extract(data) {
    const categories = data.categories.map(category => category.shortName);
    // extract common data
    const summary = super.summaryStructure(
      'foursquare',
      data.name || null,
      data.rating || null,
      data.price ? data.price.tier : null,
      data.stats ? data.stats.tipCount : null,
      data.bestPhoto
        ? `${data.bestPhoto.prefix}${data.bestPhoto.width}x${data.bestPhoto.height}${
          data.bestPhoto.suffix
        }`
        : null,
      categories || null,
      [],
      null,
      data.canonicalUrl || null,
    );
    return summary;
  }
}

module.exports = FoursquareService;
