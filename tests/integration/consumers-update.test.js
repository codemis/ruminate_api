/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');

describe('Consumers:', function () {
  var consumer = '';
  var apiKey = '';

  beforeEach(function(done) {
    var clientAppId = randomstring.generate();
    var params = {
      "device": {
        "model": "Nexus 7",
        "platform": "Android",
        "uuid": "1821a91c-ee54-4bf9-8125-f0e1d0455ef7",
        "version": "4.4"
      },
      "push": {
        "interval": 20000,
        "receive": true,
        "timezone": "America/Los_Angeles",
        "token": "1821a91c-ee54-4bf9-8125-f0e1d0455ef7"
      }
    };
    models.Client.create({name: 'Acme Inc.', applicationId: clientAppId})
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

  describe('PUT /consumers', function () {

    it('should update a consumer', function (done) {
      var updatedData = {
        "device": {
          "model": "iPhone SE",
          "platform": "iOS",
          "version": "9.3.1"
        }
      };
      api.put('/consumers')
      .send(updatedData)
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(200);
        expect(res.body.hasOwnProperty('updatedAt')).to.be.true;
        expect(res.body.hasOwnProperty('updatedAt')).to.not.equal('');
        models.Consumer.findOne({
          where: { apiKey: apiKey }
        })
        .then(function(consumer) {
          expect(consumer.deviceModel).to.equal("iPhone SE");
          expect(consumer.devicePlatform).to.equal("iOS");
          expect(consumer.deviceVersion).to.equal("9.3.1");
          done();
        }).catch(function(error) {
          done(error);
        });
      });
    });

    it('should throw an error if you do not provide an API key', function (done) {
      var updatedData = {
        "device": {
          "model": "iPhone 6S",
          "platform": "iOS",
          "version": "8.5.1"
        }
      };
      api.put('/consumers')
      .send(updatedData)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require consumer data to be passed', function (done) {
      api.put('/consumers')
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/malformed or missing/g)).to.not.equal(null);
        done();
      });
    });

    it('should require device.uuid if you pass it in', function (done) {
      var updatedData = {
        "device": {
          "model": "iPhone 6S",
          "platform": "iOS",
          "version": "8.5.1",
          "uuid": ""
        }
      };
      api.put('/consumers')
      .send(updatedData)
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/device\.uuid is missing/g)).to.not.equal(null);
        done();
      });
    });

    it('should require push.interval if you pass it in', function (done) {
      var updatedData = {
        "device": {
          "model": "Nexus 7"
        },
        "push": {
          "interval": 0,
          "receive": true
        }
      };
      api.put('/consumers')
      .send(updatedData)
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/push\.interval is missing/g)).to.not.equal(null);
        done();
      });
    });

    it('should require push.timezone if you pass it in', function (done) {
      var updatedData = {
        "device": {
          "model": "Nexus 7"
        },
        "push": {
          "interval": 0,
          "receive": true,
          "timezone": ""
        }
      };
      api.put('/consumers')
      .send(updatedData)
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/push\.timezone is missing/g)).to.not.equal(null);
        done();
      });
    });

    it('should require push.token if you pass it in', function (done) {
      var updatedData = {
        "device": {
          "model": "Nexus 7"
        },
        "push": {
          "interval": 0,
          "receive": true,
          "timezone": "America/Los_Angeles",
          "token": ""
        }
      };
      api.put('/consumers')
      .send(updatedData)
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/push\.token is missing/g)).to.not.equal(null);
        done();
      });
    });

  });

});
