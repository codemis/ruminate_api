/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');

describe('Ruminations:', function () {
  var consumer = null;
  var apiKey = '';
  var ruminationOne = null;
  var ruminationTwo = null;

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
    var ruminationDataOne = {
      "passage": {
        "version": "ESV",
        "snippet": "but his delight is in the law of the Lord...",
        "first": {
          "book": "Psalms",
          "abbreviation": "Psa",
          "chapter": 1,
          "verse": 2
        },
        "last": {
          "book": "Psalms",
          "abbreviation": "Psa",
          "chapter": 1,
          "verse": 3
        }
      }
    };
    var ruminationDataTwo = {
      "passage": {
        "version": "KJV",
        "snippet": "My son, if thou be surety for thy friend...",
        "first": {
          "book": "Proverbs",
          "abbreviation": "Pro",
          "chapter": 6,
          "verse": 1
        },
        "last": {
          "book": "Proverbs",
          "abbreviation": "Pro",
          "chapter": 6,
          "verse": 3
        }
      }
    };
    models.Client.create({name: 'Cow BBQ Inc.', applicationId: clientAppId})
      .then(function(client) {
        var data = models.Consumer.parseRequest(params);
        client.createConsumer(data)
        .then(function(consumerData) {
          apiKey = consumerData.apiKey;
          consumer = consumerData.toResponse();
          var data = models.Rumination.parseRequest(ruminationDataOne);
          var dataTwo = models.Rumination.parseRequest(ruminationDataTwo);
          consumerData.createRumination(data)
          .then(function(ruminationData) {
            ruminationOne = ruminationData.toResponse();
            consumerData.createRumination(dataTwo)
            .then(function(ruminationData) {
              ruminationTwo = ruminationData.toResponse();
              done();
            }, function(error) {
              console.log('Unable to create the rumination 2!');
              done(error);
            });
          }, function(error) {
            console.log('Unable to create the rumination 1!');
            done(error);
          });
        }, function(error) {
          console.log('Unable to create the consumer!');
          done(error);
        });
      });
  });

  describe('GET  /consumers/ruminations', function () {

    it('should retrieve all the consumer\'s ruminations', function (done) {
      api.get('/consumers/ruminations')
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
        expect(res.body[0].hasOwnProperty('passage')).to.be.true;
        expect(res.body[0].passage.version).to.equal(ruminationOne.passage.version);
        expect(res.body[0].passage.snippet).to.equal(ruminationOne.passage.snippet);
        expect(res.body[0].passage.snippet).to.equal(ruminationOne.passage.snippet);
        expect(res.body[0].passage.first).to.shallowDeepEqual(ruminationOne.passage.first);
        expect(res.body[0].passage.last).to.shallowDeepEqual(ruminationOne.passage.last);

        expect(res.body[1].hasOwnProperty('passage')).to.be.true;
        expect(res.body[1].passage.version).to.equal(ruminationTwo.passage.version);
        expect(res.body[1].passage.snippet).to.equal(ruminationTwo.passage.snippet);
        expect(res.body[1].passage.snippet).to.equal(ruminationTwo.passage.snippet);
        expect(res.body[1].passage.first).to.shallowDeepEqual(ruminationTwo.passage.first);
        expect(res.body[1].passage.last).to.shallowDeepEqual(ruminationTwo.passage.last);
        done();
      });
    });

    it('should sort ruminations by firstBook', function (done) {
      var data = {
        "sortOrder": {
          "ruminations": {
            "field": "firstBook",
            "direction": "asc"
          }
        }
      };
      api.get('/consumers/ruminations')
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .send(data)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
        expect(res.body[0].id).to.equal(ruminationTwo.id);
        expect(res.body[1].id).to.equal(ruminationOne.id);
        done();
      });
    });

    it('should require an api key', function (done) {
      api.get('/consumers/ruminations')
      .send({})
      .set('Accept', 'application/json')
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require a valid api key', function (done) {
      api.get('/consumers/ruminations')
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', 'IAMTHEONEWHOISINVALID')
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
        done();
      });
    });

  });

});
