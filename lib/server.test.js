import request from 'supertest';
import { serve } from './server.js';

describe('The TCP server', () => {
  let server = null;

  beforeEach(() => {
    // Deliberately omit the port so we get an available one.
    server = serve('localhost', undefined);
  });

  afterEach(() => {
    server.close();
  });

  // This test will fail initially since the project doesn't start with a
  // working HTTP server.
  it('connects on the default port', async () => {
    await request(server)
      .get('/')
      .expect(200);
  });

  it('receives a 404 when requesting an unknown resource/method', async () => {
    await request(server)
      .put('/fictitious')
      .expect(404);
  });

  it('receives a 204 when post request is made to /mail path', async () => {
    await request(server)
    .post('/mail')
    .expect(204)
    .expect('Content-Length', '0')
  });

  it('receives a 200 when getting json from /posts path', async () => {
    await request(server)
    .get('/posts')
    .expect(200)
    .expect('Content-Type', 'application/json')
  });
});
