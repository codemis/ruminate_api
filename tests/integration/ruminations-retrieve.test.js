/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');

describe('Ruminations:', function () {
  var consumer = null;
  var apiKey = '';
  var rumination = null;
  var ruminationId = 0;
  var responseOne = null;
  var responseTwo = null;

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
    var ruminationData = {
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
    var responseDataOne = {
      "questionTheme": "humor",
      "questionContent": "What is a cow with no legs?",
      "answer": "Ground Beef"
    };
    var responseDataTwo = {
      "questionTheme": "politics",
      "questionContent": "Who will win the election?",
      "answer": "Al 'Internet' Gore"
    };
    models.Client.create({name: 'Cow BBQ Inc.', applicationId: clientAppId})
      .then(function(client) {
        var data = models.Consumer.parseRequest(params);
        client.createConsumer(data)
        .then(function(result) {
          apiKey = result.apiKey;
          consumer = result.toResponse();
          var data = models.Rumination.parseRequest(ruminationData);
          result.createRumination(data)
          .then(function(rumResult) {
            ruminationId = rumResult.id;
            rumination = rumResult.toResponse();
            rumResult.createResponse(responseDataOne)
            .then(function(result) {
              responseOne = result.toResponse();
              rumResult.createResponse(responseDataTwo)
              .then(function(result) {
                responseTwo = result.toResponse();
                done();
              }, function(error) {
                console.log('Unable to create the rumination!');
                done(error);
              });
            }, function(error) {
              console.log('Unable to create the rumination!');
              done(error);
            });
          }, function(error) {
            console.log('Unable to create the rumination!');
            done(error);
          });
        }, function(error) {
          console.log('Unable to create the consumer!');
          done(error);
        });
      });
  });

  describe('GET  /consumers/ruminations/{ruminationId}', function () {

    it('should retrieve the rumination', function (done) {
      api.get('/consumers/ruminations/'+ruminationId)
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(200);
        expect(res.headers.hasOwnProperty('location')).to.be.true;
        expect(res.headers['location']).to.equal('/consumers/ruminations/'+ruminationId);
        expect(res.body.id).to.equal(ruminationId);
        expect(res.body.hasOwnProperty('passage')).to.be.true;
        expect(res.body.passage.version).to.equal(rumination.passage.version);
        expect(res.body.passage.snippet).to.equal(rumination.passage.snippet);
        expect(res.body.passage.snippet).to.equal(rumination.passage.snippet);
        expect(res.body.passage.first).to.shallowDeepEqual(rumination.passage.first);
        expect(res.body.passage.last).to.shallowDeepEqual(rumination.passage.last);
        expect(res.body.responses.length).to.equal(2);
        expect(res.body.responses[0].answer).to.equal(responseOne.answer);
        expect(res.body.responses[1].answer).to.equal(responseTwo.answer);
        expect(res.body.responses[0].question).to.shallowDeepEqual(responseOne.question);
        expect(res.body.responses[1].question).to.shallowDeepEqual(responseTwo.question);
        done();
      });
    });

    it('should sort responses by questionTheme', function (done) {
      api.get('/consumers/ruminations/'+ruminationId)
      .set('Accept', 'application/json')
      .query({sort_responses: 'questionTheme|desc'})
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(200);
        expect(res.body.responses.length).to.equal(2);
        expect(res.body.responses[0].question.theme).to.equal(responseTwo.question.theme);
        expect(res.body.responses[1].question.theme).to.equal(responseOne.question.theme);
        done();
      });
    });

    it('should sort responses by answer', function (done) {
      api.get('/consumers/ruminations/'+ruminationId)
      .set('Accept', 'application/json')
      .query({sort_responses: 'answer|asc'})
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(200);
        expect(res.body.responses.length).to.equal(2);
        expect(res.body.responses[0].answer).to.equal(responseTwo.answer);
        expect(res.body.responses[1].answer).to.equal(responseOne.answer);
        done();
      });
    });

    it('should return an error if you pass an unacceptable sort field', function (done) {
      api.get('/consumers/ruminations/'+ruminationId)
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .query({sort_responses: 'id|asc'})
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/field you provided is not allowed/g)).to.not.equal(null);
        done();
      });
    });

    it('should return an error if you pass an unacceptable sort direction', function (done) {
      api.get('/consumers/ruminations/'+ruminationId)
      .set('Accept', 'application/json')
      .query({sort_responses: 'answer|upAndBeyond'})
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/direction you provided is not allowed/g)).to.not.equal(null);
        done();
      });
    });

    it('should require an api key', function (done) {
      api.get('/consumers/ruminations/'+ruminationId)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require a valid api key', function (done) {
      api.get('/consumers/ruminations/'+ruminationId)
      .set('Accept', 'application/json')
      .set('x-api-key', 'DRHASNOKEY!')
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require a ruminationId in the URL', function (done) {
      api.get('/consumers/ruminations/')
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/rumination could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require a valid ruminationId in the URL', function (done) {
      api.get('/consumers/ruminations/999998998')
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/rumination could not be found/g)).to.not.equal(null);
        done();
      });
    });

  });

});
