// imports
const fetch = require('node-fetch');
const GeneralService = require('./service-general');

// class definition
class FoursquareService extends GeneralService {
  // the map method tries to match a google places ID with a foursquare ID
  map(googleData) {
    return new Promise((resolve) => {
      const nameQuery = googleData.result.name
        .split(' ')
        .map(el => `&query=${encodeURI(el)}`)
        .join('');

      const googleLat = googleData.result.geometry.location.lat;
      const googleLng = googleData.result.geometry.location.lng;
      const apiSlug = 'https://api.foursquare.com/v2/venues/search?ll=';
      const url = `${apiSlug}${googleLat},${googleLng}${nameQuery}&radius=100&client_id=${
        process.env.FOURSQUARE_CLIENT_ID
      }&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=20171124`;

      try {
        fetch(url, {
          method: 'GET',
          headers: {},
        })
          .then(data => data.json())
          .then((data) => {
            if (data.meta.code === 200 && data.response.venues.length > 0) {
              resolve(data.response.venues[0].id);
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

  // the fetch method tries to fetch data for a given foursquare ID
  fetch() {
    return fetch('…')
      .then(data => data.json())
      .then((data) => {
        this.commonFormat();
      });
  }

  // the extract method extracts the important information form the foursquare data
  extract() {
    return this.standardData(name, ratings);
  }
}

module.exports = FoursquareService;
