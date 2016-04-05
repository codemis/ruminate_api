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

  beforeEach(function(done) {
    var clientAppId = randomstring.generate();
    var params = {
      "device": {
        "model": "iPad Pro",
        "platform": "iOS",
        "uuid": "4f221b05-95ff-4a44-bd27-fcfaa524417e",
        "version": "9.3.1"
      },
      "push": {
        "interval": 20000,
        "receive": true,
        "timezone": "America/Los_Angeles",
        "token": "4ec8f8b3-ed57-42bc-85cd-368ae8901219"
      }
    };
    var ruminationData = {
      "passage": {
        "version": "AKJV",
        "snippet": "in whom we have redemption through his blood...",
        "first": {
          "book": "Ephesians",
          "abbreviation": "Eph",
          "chapter": 1,
          "verse": 7
        },
        "last": {
          "book": "Ephesians",
          "abbreviation": "Eph",
          "chapter": 1,
          "verse": 7
        }
      }
    };
    models.Client.create({name: 'Batman Batarangs Inc.', applicationId: clientAppId})
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
            done();
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

  describe('DELETE /consumers/ruminations', function () {

    it('should delete the rumination', function (done) {
      api.delete('/consumers/ruminations/'+ruminationId)
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.true;
        expect(res.status).to.equal(204);
        models.Rumination.count({
          where: { id: ruminationId }
        }).then(function(total) {
          expect(total).to.equal(0);
          done();
        }, function(error) {
          done(error);
        })
      });
    });

    it('should require an api key', function (done) {
      api.delete('/consumers/ruminations/'+ruminationId)
      .send({})
      .set('Accept', 'application/json')
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require avalid api key', function (done) {
      api.delete('/consumers/ruminations/'+ruminationId)
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', 'IAMREALLYFAKEMAN')
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/consumer could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require a ruminationId in the URL', function (done) {
      api.delete('/consumers/ruminations/')
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.false;
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/rumination could not be found/g)).to.not.equal(null);
        done();
      });
    });

    it('should require a valid ruminationId in the URL', function () {
      api.delete('/consumers/ruminations/99999919')
      .send({})
      .set('Accept', 'application/json')
      .set('x-api-key', apiKey)
      .end(function(err, res) {
        expect(res.ok).to.be.false;
        expect(res.status).to.equal(404);
        expect(res.body.hasOwnProperty('error')).to.be.true;
        expect(res.body.error.match(/rumination could not be found/g)).to.not.equal(null);
        done();
      });
    });

  });

});
