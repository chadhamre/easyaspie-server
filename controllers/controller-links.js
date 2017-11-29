const LinksController = async (ctx) => {
  const ids = [
    'ChIJuT9kTBKjpBIRNSy1Grt_ge4',
    'ChIJt7oioxejpBIRyRGWOMn0XaE',
    'ChIJO9Q5t1-ipBIR6j1w_MTknys',
    'ChIJVzC6AWrcQUcRallG8lBArlo',
    'ChIJtzkEAGrcQUcRgcggJP56f34',
    'ChIJ602zYGrcQUcRJ-N5Gpjx7kg',
    'ChIJqUdI5mhuQUYR1D4a-2P9sHA',
    'ChIJreEXi4FZwokR_ygs7wh2fTk',
    'ChIJ7TrmonzswTARjVO_WSl79w0',
    'ChIJl0ZZHxujpBIRN2y9xZrUuRI',
    'ChIJ07kaJ_-ipBIRd8UsW96kFFs',
    'ChIJTza15juHhYARz7m5ZLfi_EE',
    'ChIJHavdiqmjpBIR4f23pJlUGEM',
    'ChIJkbbXwxr6BFMRRkalmL_pu68',
    'ChIJk2hgHdf2BFMR7O9z2VrvcI8',
    'ChIJGcCAtTcbdkgRyc_tXY8K928',
    'ChIJD1euajujpBIR5CGwvsklNrE',
    'ChIJceeAXt6AhYARur0rWLmvt1A',
    'ChIJUURg6ISAhYARUlHS_WYfyGk',
    'ChIJJeeXAyn3BFMRgfT7R4OVhf8',
    'ChIJH3SFojx-j4AR-ceZkVNV7PA',
    'ChIJ-QQmzPE0K4gRY8lGmT616x0',
    'ChIJAQAw5GWNGGAReOa91wcFHVE',
    'ChIJEbn-paeOGGARTWVwiDwC9tQ',
    'ChIJIVHOoCF-j4ARnw6y25XWmMA',
    'ChIJ8aZslMeAhYARk2BJNvkVPyc',
  ];
  let html = '';
  const links = ids.forEach(id => (html += `<a href=/api/v1/places/${id}>${id}</a><br/>`));
  ctx.body = html;
};

// export module
module.exports = LinksController;
