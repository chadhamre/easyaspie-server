// require the Koa server
const server = require('../index');
// require supertest
const request = require('supertest');
// close the server after each test
afterEach(() => {
  server.close();
});

describe('routes: index', () => {
  test('should respond with a 200', async () => {
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
  });
});

describe('routes: /api/v1/places/:place_id', () => {
  test('should respond with 200 if the place id is valid', async () => {
    const response = await request(server).get('/api/v1/places/ChIJuT9kTBKjpBIRNSy1Grt_ge4');
    expect(response.status).toEqual(200);
  });
});

describe('routes: /api/v1/places/:place_id', () => {
  test('should respond with a json', async () => {
    const response = await request(server).get('/api/v1/places/ChIJuT9kTBKjpBIRNSy1Grt_ge4');
    expect(response.type).toEqual('application/json');
  });
});
