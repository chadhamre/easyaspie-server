class GeneralService {
  // return an average of the inputs
  static averages(object, name) {
    const keys = Object.keys(object);
    const total = keys.reduce((accum, key) => accum + summaryData[`${name}s`][key], 0);
    return (summaryData[name] = (total / keys.length).toFixed(1));
  }

  // commonFormat() {
  //   // does some common magic
  // }

  summaryStructure(service, name, rating, price, count) {
    const summary = {
      names: {},
      ratings: {},
      prices: {},
      counts: {},
    };
    if (name) summary.names[service] = name;
    if (rating) summary.ratings[service] = rating;
    if (price) summary.prices[service] = price;
    if (count) summary.counts[service] = count;
    return summary;
  }
}

module.exports = GeneralService;
