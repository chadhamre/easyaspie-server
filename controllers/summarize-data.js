// this function summarizes the data for the front-end
const mingleData = async (googleData, foursquareData, foursquarePhotos, yelpData) => {
  // create object structure

  const photosFoursquare = (items) => {
    items.forEach((el) => {
      summaryData.photos.push({ uri: `${el.prefix}${el.width}x${el.height}${el.suffix}` });
    });
  };

  // yelp helper functions
  const addYelpPhotos = (photos) => {
    photos.forEach(photo => summaryData.photos.push(photo));
  };

  // add foursquare data
  if (foursquareData) {
    // add foursquare photos
    if (foursquarePhotos) {
      photosFoursquare(foursquarePhotos.items);
    }
  }

  // add Yelp data
  if (yelpData) {
    addYelpPhotos(yelpData.photos);
  }

  // summarizing functions
  getAverage(summaryData.prices, 'price');
  getAverage(summaryData.ratings, 'rating');
};

module.exports = mingleData;
