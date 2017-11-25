// this function summarizes the data for the front-end
const mingleData = async (googleData) => {
  // create object structure
  const summaryData = { ratings: {}, photos: {} };
  // add basic data
  summaryData.name = googleData.result.name;
  summaryData.place_id = googleData.result.place_id;
  summaryData.address = googleData.result.formatted_address;
  summaryData.phone = googleData.result.international_phone_number;
  // add ratings
  summaryData.rating = ((googleData.result.rating * 2) / 1).toFixed(1);
  summaryData.ratings.google = googleData.result.rating;
  // add photos

  return summaryData;
};

// export module
module.exports = mingleData;
