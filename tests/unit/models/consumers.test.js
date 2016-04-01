describe('Models: Consumer', function () {

  describe('hooks', function () {

    it('should generate an API Key on creation', function (done) {
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
      var data = models.Consumer.parseRequest(params);
      models.Consumer.create(data)
      .then(function(result) {
        expect(result.apiKey).to.not.equal('');
        done();
      }, function(error) {
        done(error);
      });
    });

    it('should not regenerate the API key on update', function (done) {
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
      var data = models.Consumer.parseRequest(params);
      models.Consumer.create(data)
      .then(function(result) {
        models.Consumer.update({pushReceive: false}, {
          where: { apiKey: result.apiKey }
        }).then(function() {
          models.Consumer.findOne({
            where: { apiKey: result.apiKey }
          }).then(function(consumer) {
            expect(consumer.apiKey).to.equal(result.apiKey);
            done();
          }, function(error) {
            done(error);
          });
        }, function(error) {
          done(error);
        });
      }, function(error) {
        done(error);
      });
    });

  });

  describe('parseRequest()', function () {

    it('should parse a complete data request', function () {
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
      var expected = {
        deviceModel:      "Nexus 7",
        devicePlatform:   "Android",
        deviceVersion:    "4.4",
        deviceUUID:       "1821a91c-ee54-4bf9-8125-f0e1d0455ef7",
        pushInterval:     20000,
        pushToken:        "1821a91c-ee54-4bf9-8125-f0e1d0455ef7",
        pushReceive:      true,
        pushTimezone:     "America/Los_Angeles"
      };
      var actual = models.Consumer.parseRequest(params);
      expect(actual).to.shallowDeepEqual(expected);
    });

    it('should parse a partial object', function () {
      var params = {
        "device": {
          "model": "Nexus 7",
          "platform": "Android"
        }
      };
      var expected = {
        deviceModel:      "Nexus 7",
        devicePlatform:   "Android"
      };
      var actual = models.Consumer.parseRequest(params);
      expect(actual).to.shallowDeepEqual(expected);
    });

  });

});
