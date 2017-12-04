// require supertest
const request = require('supertest');
const placesController = require('../controllers/controller-places');
const summaryData = require('./mocks/summaryData.mocks');


describe('services: mapping', () => {
  test('The Place Controller Should Return a Summary JSON', async () => {
    const ctx = { params: { place_id: 'ChIJAQAw5GWNGGAReOa91wcFHVE' } };
    const summary = await placesController(ctx);
    expect(summary.name).toEqual(summaryData.name);
    expect(summary.phone).toEqual(summaryData.phone);
    expect(summary.address).toEqual(summaryData.address);
    expect(summary.website).toEqual(summaryData.website);
    expect(summary.names.length).toEqual(summaryData.names.length);
    expect(summary.ratings.length).toEqual(summaryData.ratings.length);
    expect(summary.counts.length).toEqual(summaryData.counts.length);
    expect(summary.prices.length).toEqual(summaryData.prices.length);
    expect(summary.photos.length + 10).toBeGreaterThanOrEqual(summaryData.photos.length - 10);
    expect(summary.rating).toBeGreaterThanOrEqual(summaryData.rating - 15);
    expect(summary.rating).toBeLessThanOrEqual(summaryData.rating + 15);
    expect(summary.price).toBeGreaterThanOrEqual(summaryData.price - 1);
    expect(summary.price).toBeLessThanOrEqual(summaryData.price + 1);
  });
});
