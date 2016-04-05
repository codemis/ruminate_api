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

  describe('PUT /consumers/ruminations', function () {

    it('should update a rumination', function (done) {
      var data = {
        "passage": {
          "snippet": "Blessed is the man who walks not in the counsel of the wicked...",
          "first": {
            "verse": 1
          }
        }
      };
      api.put('/consumers/ruminations/'+ruminationId)
        .send(data)
        .set('Accept', 'application/json')
        .set('x-api-key', apiKey)
        .end(function(err, res) {
          expect(res.ok).to.be.true;
          expect(res.status).to.equal(201);
          expect(res.body.passage.snippet).to.equal('Blessed is the man who walks not in the counsel of the wicked...');
          expect(res.body.passage.first.verse).to.equal(1);
          expect(res.body.hasOwnProperty('updatedAt')).to.be.true;
          models.Rumination.findOne({
            where: { id: ruminationId }
          }).then(function(rumination) {
            expect(rumination).to.not.equal(null);
            expect(rumination.passageSnippet).to.equal('Blessed is the man who walks not in the counsel of the wicked...');
            expect(rumination.firstVerse).to.equal(1);
            expect(rumination.consumerId).to.equal(consumer.id);
            done();
          }, function(error) {
            done(error);
          });
        });
    });

  });

});
