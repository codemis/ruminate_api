/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');
describe('Routes Consumers', function () {
  var clientAppId = null;
  var clientId = null;
  beforeEach(function(done) {
    clientAppId = randomstring.generate();
    models.Client.create({name: 'Acme Inc.', applicationId: clientAppId})
      .then(function(client) {
        clientId = client.id;
        done();
      });
  });

  describe('/consumers/register', function () {
    var data = {
      "device": {
        "model": "Nexus 7",
        "platform": "Android",
        "uuid": "03bb8569-7fb9-4883-9779-56c6651d694c",
        "version": "4.4"
      },
      "push": {
        "interval": 20000,
        "receive": true,
        "timezone": "America/Los_Angeles",
        "token": "5e7a72d6-d076-11e5-ab30-625662870761"
      }
    };

    it('should register a new consumer', function (done) {
      api.post('/consumers/register')
      .send(data)
      .set('Accept', 'application/json')
      .set('x-client-id', clientAppId)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(201);
        expect(res.headers.hasOwnProperty('x-api-key')).to.be.true;
        expect(res.headers['x-api-key']).not.to.equal('null');
        expect(res.body.hasOwnProperty('createdAt')).to.be.true;
        models.Consumer.findOne({
          where: { apiKey: res.headers['x-api-key'] }
        })
        .then(function(consumer) {
          expect(consumer.ClientId).to.equal(clientId);
          done();
        }).catch(function(error) {
          done(error);
        });
      });
    });

    it('should require the client id', function (done) {
      api.post('/consumers/register')
      .send(data)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/client could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require a valid client id', function (done) {
      api.post('/consumers/register')
      .send(data)
      .set('Accept', 'application/json')
      .set('x-client-id', 'MADEUP#ID231')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/client could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require the consumer data', function (done) {
      api.post('/consumers/register')
      .send({})
      .set('Accept', 'application/json')
      .set('x-client-id', clientAppId)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/malformed or missing/g)).to.not.equal(null);
        done();
      });
    });

    it('should require the device.uuid', function () {
      var consumer = {
        "device": {
          "model": "Nexus 7",
          "platform": "Android",
          "uuid": "",
          "version": "4.4"
        },
        "push": {
          "interval": 20000,
          "receive": true,
          "timezone": "America/Los_Angeles",
          "token": "5e7a72d6-d076-11e5-ab30-625662870761"
        }
      };
      api.post('/consumers/register')
      .send(consumer)
      .set('Accept', 'application/json')
      .set('x-client-id', clientAppId)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/device\.uuid is missing/g)).to.not.equal(null);
        done();
      });
    });

    it('should require the push.receive', function () {
      var consumer = {
        "device": {
          "model": "Nexus 7",
          "platform": "Android",
          "uuid": "07a9454e-b81b-4157-bb94-4c407796a043",
          "version": "4.4"
        },
        "push": {
          "interval": 120,
          "timezone": "America/Los_Angeles",
          "token": "5e7a72d6-d076-11e5-ab30-625662870761"
        }
      };
      api.post('/consumers/register')
      .send(consumer)
      .set('Accept', 'application/json')
      .set('x-client-id', clientAppId)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/push\.receive cannot be null/g)).to.not.equal(null);
        done();
      });
    });

    it('should require the push.interval', function () {
      var consumer = {
        "device": {
          "model": "Nexus 7",
          "platform": "Android",
          "uuid": "07a9454e-b81b-4157-bb94-4c407796a043",
          "version": "4.4"
        },
        "push": {
          "interval": 0,
          "receive": true,
          "timezone": "America/Los_Angeles",
          "token": "5e7a72d6-d076-11e5-ab30-625662870761"
        }
      };
      api.post('/consumers/register')
      .send(consumer)
      .set('Accept', 'application/json')
      .set('x-client-id', clientAppId)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/push\.interval is missing or set to zero/g)).to.not.equal(null);
        done();
      });
    });

    it('should require the push.timezone', function () {
      var consumer = {
        "device": {
          "model": "Nexus 7",
          "platform": "Android",
          "uuid": "07a9454e-b81b-4157-bb94-4c407796a043",
          "version": "4.4"
        },
        "push": {
          "interval": 200,
          "receive": true,
          "timezone": "",
          "token": "5e7a72d6-d076-11e5-ab30-625662870761"
        }
      };
      api.post('/consumers/register')
      .send(consumer)
      .set('Accept', 'application/json')
      .set('x-client-id', clientAppId)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/push\.timezone is missing/g)).to.not.equal(null);
        done();
      });
    });

    it('should require the push.token', function () {
      var consumer = {
        "device": {
          "model": "Nexus 7",
          "platform": "Android",
          "uuid": "07a9454e-b81b-4157-bb94-4c407796a043",
          "version": "4.4"
        },
        "push": {
          "interval": 200,
          "receive": true,
          "timezone": "America/Los_Angeles",
          "token": ""
        }
      };
      api.post('/consumers/register')
      .send(consumer)
      .set('Accept', 'application/json')
      .set('x-client-id', clientAppId)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/push\.token is missing/g)).to.not.equal(null);
        done();
      });
    });

  });

});
