var cheerio = require('cheerio');
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var Config = require('../../config');
var config = new Config();
var api = supertest('http://localhost::'+config.port);

describe('Routes Static', function() {

  describe('/docs', function() {

    it('should get the page content', function(done) {
      api.get('/docs')
        .end(function(err, res) {
          var body = cheerio.load(res.text);
          expect(body('header > h1').text()).to.contain('Ruminate API');
          expect(res.status).to.equal(200);
          done();
        });
    });

  });

});
