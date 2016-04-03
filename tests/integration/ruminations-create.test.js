/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');

describe('Ruminations:', function () {
  var consumer = '';
  var apiKey = '';

  beforeEach(function(done) {
    var clientAppId = randomstring.generate();
    var params = {
      "device": {
        "model": "iPad Mini",
        "platform": "iOS",
        "uuid": "69450c8e-3d58-4393-a0c1-98b1fc452576",
        "version": "9.3.1"
      },
      "push": {
        "interval": 20000,
        "receive": true,
        "timezone": "America/Los_Angeles",
        "token": "5e1c5e82-fae4-4620-82d3-5e6344198c28"
      }
    };
    models.Client.create({name: 'Cow Hide Inc.', applicationId: clientAppId})
      .then(function(client) {
        var data = models.Consumer.parseRequest(params);
        client.createConsumer(data)
        .then(function(result) {
          apiKey = result.apiKey;
          consumer = result.toResponse();
          done();
        }, function(error) {
          console.log('Unable to create the consumer!');
          done(error);
        });
      });
  });

  describe('POST /consumers/ruminations', function () {
    var data = {
      "passage": {
        "version": "",
        "snippet": "When the righteous thrive, the people rejoice...",
        "first": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 2
        },
        "last": {
          "book": "Proverbs",
          "abbreviation": "Prov",
          "chapter": 29,
          "verse": 3
        }
      }
    };

    it('should create a new rumination on a given consumer', function (done) {
      var version = randomstring.generate();
      data['passage']['version'] = version;
      api.post('/consumers/ruminations')
        .send(data)
        .set('Accept', 'application/json')
        .set('x-api-key', apiKey)
        .end(function(err, res) {
          expect(res.ok).to.be.true;
          expect(res.status).to.equal(201);
          expect(res.body.hasOwnProperty('createdAt')).to.be.true;
          models.Rumination.findOne({
            passageVersion: version
          }).then(function(rumination) {
            expect(rumination).to.not.equal(null);
            expect(rumination.firstBook).to.equal('Proverbs');
            expect(rumination.firstChapter).to.equal(29);
            expect(rumination.firstVerse).to.equal(2);
            expect(rumination.lastBook).to.equal('Proverbs');
            expect(rumination.lastChapter).to.equal(29);
            expect(rumination.lastVerse).to.equal(3);
            expect(rumination.consumerId).to.equal(consumer.id);
            done();
          }, function(error) {
            done(error);
          });
        });
    });

    it('should require an api key', function (done) {
      api.post('/consumers/ruminations')
        .send(data)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          expect(res.body.hasOwnProperty('error')).to.be.true;
          expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
          done();
        }, function(error) {
          done(error);
        });
    });

    it('should require a valid api key', function (done) {
      api.post('/consumers/ruminations')
        .send(data)
        .set('Accept', 'application/json')
        .set('x-api-key', 'IAMFAKE#321')
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          expect(res.body.hasOwnProperty('error')).to.be.true;
          expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
          done();
        }, function(error) {
          done(error);
        });
    });

    it('should require rumination data', function (done) {
      api.post('/consumers/ruminations')
        .send({passage: {}})
        .set('Accept', 'application/json')
        .set('x-api-key', apiKey)
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.hasOwnProperty('error')).to.be.true;
          expect(res.body.error.match(/malformed or missing/g)).to.not.equal(null);
          done();
        }, function(error) {
          done(error);
        });
    });

  });

});
