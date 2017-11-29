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
    'ChIJWZjZGj6jpBIRyx-Ib3BptuE',
    'ChIJn82-Depv5kcRbitLK3lP0Bg',
    'ChIJqTQzIehv5kcRaF3hD1SzX5A',
    'ChIJj2U-KCpu5kcRe3Epmv_XaPA',
    'ChIJ2TXzM8IJxkcRltkDfKaYYmU',
    'ChIJmXCDu-oJxkcRGHNsqGzPLeQ',
    'ChIJd75Sd8gJxkcR3jy2XQJJlBo',
    'ChIJNVGbC9UEdkgRNhmLoyLPIfE',
    'ChIJD-dBUDMFdkgRoWq7SJN-WwU',
    'ChIJwzJ0oMsEdkgRevnkOKv6cdw',
    'ChIJU07oP6wcdkgRxecDS1lBdlc',
    'ChIJ66z5QEhRCTERD5UhUVtB8_g',
    'ChIJLdImwuBTCTERmVYVcbuXRqE',
    'ChIJ78xW0DtRCTERIF3md4mXvo8',
    'ChIJ7Rdn5mZnzB0RyOHHPQvv-1Q',
    'ChIJg6qKzSFnzB0RqczGhA4pPVY',
  ];
  let html = '';
  const links = ids.forEach(id => (html += `<a href=/api/v1/places/${id}>${id}</a><br/>`));
  ctx.body = html;
};

// export module
module.exports = LinksController;
