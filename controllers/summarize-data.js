// this function summarizes the data for the front-end
const mingleData = async (googleData) => {
  // create object structure
  const summaryData = { ratings: {}, location: {} };
  // add basic data
  summaryData.name = googleData.result.name;
  summaryData.place_id = googleData.result.place_id;
  summaryData.address = googleData.result.formatted_address;
  summaryData.phone = googleData.result.international_phone_number;
  // add ratings
  summaryData.rating = ((googleData.result.rating * 2) / 1).toFixed(1);
  summaryData.ratings.google = googleData.result.rating;
  // add photos
  summaryData.location = googleData.result.geometry.location;
  // summaryData.photos = buildPhotoArray(googleData.result.photos)

  return summaryData;
};



// const buildPhotoArray(googleData.result.photos) {
//
// }
// export module
module.exports = mingleData;
