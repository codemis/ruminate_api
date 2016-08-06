/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');

describe('Ruminations:', function () {
  var consumer = '';
  var consumerId = 0;
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
        "interval": 5000,
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
          consumerId = result.id;
          consumer = result;
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
          expect(res.headers.hasOwnProperty('location')).to.be.true;
          expect(res.headers['location']).to.not.equal(null);
          expect(res.body.hasOwnProperty('id')).to.be.true;
          models.Rumination.findOne({
            where: {
              ConsumerId: consumerId,
              passageVersion: version
            }
          }).then(function(rumination) {
            expect(rumination).to.not.equal(null);
            expect(rumination.firstBook).to.equal('Proverbs');
            expect(rumination.firstChapter).to.equal(29);
            expect(rumination.firstVerse).to.equal(2);
            expect(rumination.lastBook).to.equal('Proverbs');
            expect(rumination.lastChapter).to.equal(29);
            expect(rumination.lastVerse).to.equal(3);
            expect(rumination.ConsumerId).to.equal(consumerId);
            done();
          });
        });
    });

    it('should create tasks for the push notification', function (done) {
      var version = randomstring.generate();
      data['passage']['version'] = version;
      var deliveryTimes = consumer.pushDeliveryTimes(moment(), 3);
      api.post('/consumers/ruminations')
        .send(data)
        .set('Accept', 'application/json')
        .set('x-api-key', apiKey)
        .end(function(err, res) {
          expect(res.ok).to.be.true;
          expect(res.status).to.equal(201);
          models.Task.findAll({
            where: {
              RuminationId: res.body.id
            }
          }).then(function(tasks) {
            /**
             * Make sure we have at least 1 delivery date
             */
            expect(deliveryTimes).not.to.equal(0);
            expect(tasks).not.to.equal(null);
            expect(tasks.length).to.equal(deliveryTimes.length);
            for (var i = 0; i < tasks.length; i++) {
              expect(tasks[i].RuminationId).to.equal(res.body.id);
            }
            done();
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
        });
    });

  });

});
