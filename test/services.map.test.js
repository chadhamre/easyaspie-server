// require the Koa server
const googleData = require('./mocks/googleData.mock');
const FoursquareService = require('../controllers/service-foursquare');
const YelpService = require('../controllers/service-yelp');
const HappyCowService = require('../controllers/service-happycow');
const GeneralService = require('../controllers/service-general');
const FacebookService = require('../controllers/service-facebook');
const TripAdvisorService = require('../controllers/service-tripadvisor');
// require supertest
const request = require('supertest');

describe('services: mapping', () => {
  test('FoursquareService should map the right id', async () => {
    const id = await FoursquareService.map(googleData.result);
    expect(id).toEqual('531c2b9d498edcb6321defdf');
  });
});

describe('services: mapping', () => {
  test('YelpService should map the right id', async () => {
    const id = await YelpService.map(googleData.result);
    expect(id).toEqual('アインソフ-ソア-豊島区');
  });
});

describe('services: mapping', () => {
  test('HappyCowService should map the right id', async () => {
    const id = await HappyCowService.map(googleData.result);
    expect(id).toEqual('/reviews/ain-soph-soar-tokyo-45520');
  });
});

describe('services: mapping', () => {
  test('FacebookService should map the right id', async () => {
    const id = await FacebookService.map(googleData.result);
    expect(id).toEqual('426754264119365');
  });
});

describe('services: mapping', () => {
  test('TripAdvisorService should map the right id', async () => {
    const id = await TripAdvisorService.map(googleData.result);
    expect(id).toEqual('/Restaurant_Review-g1066460-d7803921-Reviews-Ain_Soph_Soar-Toshima_Tokyo_Tokyo_Prefecture_Kanto.html');
  });
});
