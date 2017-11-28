const pluralize = require('pluralize');

class GeneralService {
  // return an average of the inputs
  static getAverage(object) {
    console.log(object);
    const keys = Object.keys(object);
    const cleanKeys = keys.filter(key => object[key] !== undefined);
    const total = cleanKeys.reduce((accum, key) => accum + object[key], 0);
    return Number((total / cleanKeys.length).toFixed(1));
  }

  static dedupCategories(obj) {
    const splitArr = [];
    Object.keys(obj).forEach(key =>
      obj[key].forEach(item => item.split(/ or | \/ /).forEach(word => splitArr.push(word))));
    const singularArr = splitArr.map(item => pluralize.singular(item.toLowerCase()));
    const strippedArr = singularArr.map(item => item.replace(' restaurant', '').replace('_', ' '));
    const newArray = [];
    strippedArr.forEach((item) => {
      if (newArray.indexOf(item) === -1) newArray.push(item);
    });
    return newArray;
  }

  summaryStructure(service, name, rating, price, count, bestPhoto, categories) {
    const summary = {
      names: {},
      ratings: {},
      prices: {},
      counts: {},
      bestPhoto: null,
      categories: {},
    };
    if (name) summary.names[service] = name;
    if (rating) summary.ratings[service] = rating;
    if (price) summary.prices[service] = price;
    if (count) summary.counts[service] = count;
    if (bestPhoto) summary.bestPhoto = bestPhoto;
    if (categories) summary.categories[service] = categories;
    return summary;
  }
}

module.exports = GeneralService;
