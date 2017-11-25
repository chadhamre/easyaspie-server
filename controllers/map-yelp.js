// imports
const fetch = require('node-fetch');

const mapYelp = (googleData) => {
  return new Promise((resolve, reject)=>{
    const nameQuery = encodeURI(googleData.result.name)
    const googleLat = googleData.result.geometry.location.lat;
    const googleLng = googleData.result.geometry.location.lng;
    const apiSlug = 'https://api.yelp.com/v3/businesses/search'
    const url = `${apiSlug}?latitude=${googleLat}&longitude=${googleLng}&term=${nameQuery}&radius=100&limit=1`;
    try {
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.YELP_TOKEN}`
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.total > 0) {
            resolve(data.businesses[0].id);
          }
          resolve('NA');
        });
    } catch (err) {
      console.error(err);
      resolve('NA');
    }
  })

};

module.exports = mapYelp;
