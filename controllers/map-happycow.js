// imports
const fetch = require('node-fetch');
const Xray = require('x-ray');
const stringSimilarity = require('string-similarity');

const xray = Xray();


const mapHappycow = (googleData) =>
  new Promise((resolve) => {
    const googleLat = googleData.result.geometry.location.lat;
    const googleLng = googleData.result.geometry.location.lng;
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
                const matches = stringSimilarity.findBestMatch(googleData.result.name, titles);
                //console.log(matches)
                if (matches.bestMatch.rating > 0.75) {
                  const match = matches.bestMatch.target;
                  //console.log(match,titles)
                  resolve(links[titles.indexOf(match)])
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

module.exports = mapHappycow;
