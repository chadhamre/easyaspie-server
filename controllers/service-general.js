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

  standardData(name, rating) {
    return {
      name,
      rating,
    };
  }
}

module.exports = GeneralService;
