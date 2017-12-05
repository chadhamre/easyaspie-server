const pluralize = require('pluralize');
const stringSimilarity = require('string-similarity');

class GeneralService {
  // return an average of the inputs
  static getAverage(object) {
    const keys = Object.keys(object);
    const cleanKeys = keys.filter(key => object[key] !== undefined);
    const total = cleanKeys.reduce((accum, key) => accum + object[key], 0);
    return Number((total / cleanKeys.length).toFixed(1));
  }

  static dedupCategories(object) {
    const splitArr = [];
    const keys = Object.keys(object);
    const cleanKeys = keys.filter(key => object[key] !== undefined);
    cleanKeys.forEach(key =>
      object[key].forEach(item => item.split(/ or | \/ /).forEach(word => splitArr.push(word))));
    const singularArr = splitArr.map(item => pluralize.singular(item.toLowerCase()));
    const strippedArr = singularArr.map(item => item.replace(' restaurant', '').replace('_', ' '));
    const newArray = [];
    strippedArr.forEach((item) => {
      if (newArray.indexOf(item) === -1) newArray.push(item);
    });
    return newArray;
  }

  static summaryStructure(
    service,
    name,
    rating,
    price,
    count,
    bestPhoto,
    categories,
    photos,
    cover,
    link,
  ) {
    const summary = {
      names: {},
      ratings: {},
      prices: {},
      counts: {},
      bestPhoto: null,
      categories: {},
      photos: null,
      cover: null,
      links: {},
    };
    if (name) summary.names[service] = name;
    if (rating) summary.ratings[service] = rating;
    if (price) summary.prices[service] = price;
    if (count) summary.counts[service] = count;
    if (bestPhoto) summary.bestPhoto = bestPhoto;
    if (categories) summary.categories[service] = categories;
    if (photos) summary.photos = photos;
    if (cover) summary.cover = cover;
    if (link) summary.links[service] = link;
    return summary;
  }

  static matchingAlgo(serviceResponse, name) {
    const titles = [];
    const ids = [];
    serviceResponse.forEach((item) => {
      ids.push(item.id);
      titles.push(item.name);
    });
    if (titles.length === 0) return 'NA';
    const nameQueryClean = name.toLowerCase().replace(/restaurant|the\srestaurant/g, '');
    const titlesClean = titles.map(title =>
      title.toLowerCase().replace(/restaurant|the\srestaurant/g, ''));
    const matches = stringSimilarity.findBestMatch(nameQueryClean, titlesClean);
    if (matches.bestMatch.rating >= 0.6) {
      const match = matches.bestMatch.target;
      const id = ids[titlesClean.indexOf(match)];
      return id;
    }
    return 'NA';
  }
}

module.exports = GeneralService;
