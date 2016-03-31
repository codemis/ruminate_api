/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');

describe('Routes Consumers', function () {
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

  describe('/consumers', function () {

    it('should retrieve the consumer data', function (done) {
      api.get('/consumers')
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(200);
        expect(res.headers.hasOwnProperty('location')).to.be.true;
        expect(res.headers['location']).to.equal('/consumers');
        expect(res.body.device.model).to.equal(consumer.device.model);
        expect(res.body.device.uuid).to.equal(consumer.device.uuid);
        expect(res.body.push.token).to.equal(consumer.push.token);
        done();
      });
    });

    it('should throw an error if the consumer does not exist', function (done) {
      api.get('/consumers')
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', randomstring.generate())
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should throw an error if you do not provide an API key', function () {
      api.get('/consumers')
      .send({})
      .set('Accept', 'application/json')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
        done();
      });
    });

  });

});
