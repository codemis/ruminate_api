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

  describe('GET  /consumers/ruminations/{ruminationId}', function () {

    it('should retrieve all the consumer\'s ruminations', function (done) {
      api.get('/consumers/ruminations')
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
        for (var i = 0; i < res.body.length; i++) {
          var actualData = res.body[i];
          var expectedData = ruminationOne;
          if (actualData.id === ruminationTwo.id) {
            expectedData = ruminationTwo;
          }
          expect(actualData.hasOwnProperty('passage')).to.be.true;
          expect(actualData.passage.version).to.equal(expectedData.passage.version);
          expect(actualData.passage.snippet).to.equal(expectedData.passage.snippet);
          expect(actualData.passage.snippet).to.equal(expectedData.passage.snippet);
          expect(actualData.passage.first).to.shallowDeepEqual(expectedData.passage.first);
          expect(actualData.passage.last).to.shallowDeepEqual(expectedData.passage.last);
        }
        done();
      });
    });

  });

});
