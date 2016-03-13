describe('Routes Consumers', function () {
  var clientAppId = 'AcmeInc123';
  beforeEach(function(done) {
    models.Client.create({name: 'Acme Inc.', applicationId: clientAppId})
      .then(function() {
        done();
      });
  });

  describe('/consumers/register', function () {

    it('should register a new consumer', function (done) {
      data = {
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
      api.post('/consumers/register')
        .send(data)
        .set('Accept', 'application/json')
        .set('X-Client-Id', clientAppId)
        .end(function(err, res) {
          expect(res.ok).to.be.true;
          expect(res.status).to.equal(201);
          expect(res.headers.hasOwnProperty('x-api-key')).to.be.true;
          expect(res.headers['x-api-key']).not.to.equal('null');
          expect(res.body.hasOwnProperty('createdAt')).to.be.true;
          done();
        });
      });

  });

});
