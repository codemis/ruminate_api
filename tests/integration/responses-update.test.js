/**
 * The random string library
 *
 * @return {Object}
 */
var randomstring = require('randomstring');

describe('Responses:', function () {
  var consumer = null;
  var apiKey = '';
  var rumination = null;
  var ruminationId = 0;
  var response = null;
  var responseId = 0;

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
    var responseData = {
      "questionTheme": "silly",
      "questionContent": "What is the meaning of life?",
      "answer": "42"
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
          .then(function(result) {
            ruminationId = result.id;
            rumination = result.toResponse();
            var data = models.Response.parseRequest(responseData);
            result.createResponse(data)
            .then(function(result) {
              responseId = result.id;
              response = result.toResponse();
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
          console.log('Unable to create the consumer!');
          done(error);
        });
      });
  });

  describe('PUT /consumers/ruminations/{rumination_id}/responses/{response_id}', function () {

    it('should update the answer', function (done) {
      api.put('/consumers/ruminations/'+ruminationId+'/responses/'+responseId)
        .send({
          "answer": "To love God with your whole heart, soul and mind."
        })
        .set('Accept', 'application/json')
        .set('x-api-key', apiKey)
        .end(function(err, res) {
          expect(res.ok).to.be.true;
          expect(res.status).to.equal(200);
          expect(res.body.answer).to.equal('To love God with your whole heart, soul and mind.');
          expect(res.body.hasOwnProperty('updatedAt')).to.be.true;
          expect(res.body.hasOwnProperty('id')).to.be.true;
          expect(res.body.id).to.equal(responseId);
          models.Response.findOne({
            where: { id: responseId }
          }).then(function(response) {
            expect(response).to.not.equal(null);
            expect(response.answer).to.equal('To love God with your whole heart, soul and mind.');
            expect(response.RuminationId).to.equal(rumination.id);
            done();
          }, function(error) {
            done(error);
          });
        });
    });

    it('should require an api key', function (done) {
      api.put('/consumers/ruminations/'+ruminationId+'/responses/'+responseId)
        .send({
          "answer": "To love God with your whole heart, soul and mind."
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          expect(res.body.hasOwnProperty('error')).to.be.true;
          expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
          done();
        });
    });

    it('should require a valid api key', function (done) {
      api.put('/consumers/ruminations/'+ruminationId+'/responses/'+responseId)
        .send({
          "answer": "To love God with your whole heart, soul and mind."
        })
        .set('Accept', 'application/json')
        .set('x-api-key', 'INVALIDKEY')
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          expect(res.body.hasOwnProperty('error')).to.be.true;
          expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
          done();
        });
    });

    it('should require a valid ruminationId in the URL', function (done) {
      api.put('/consumers/ruminations//responses/'+responseId)
      .send({
        "answer": "To love God with your whole heart, soul and mind."
      })
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/rumination could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require a valid responseId in the URL', function (done) {
      api.put('/consumers/ruminations/'+ruminationId+'/responses/')
      .send({
        "answer": "To love God with your whole heart, soul and mind."
      })
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/response could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require a valid response data', function (done) {
      api.put('/consumers/ruminations/'+ruminationId+'/responses/'+responseId)
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

  });
});
