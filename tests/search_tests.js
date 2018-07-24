var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('../server', { bustCache: true });
  });
  afterEach(function () {
    server.close(done);
  });

  //Test Hello World!
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/search')
    .expect(200, done);
  });

});