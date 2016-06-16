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

  describe('deliveryTimes()', function () {

    it('should return an array of timestamps with the given interval', function (done) {
      moment.tz.setDefault('America/Los_Angeles');
      var params = {
        "device": {
          "model": "Nexus 7",
          "platform": "Android",
          "uuid": "1821a91c-ee54-4bf9-8125-f0e1d0455ef7",
          "version": "4.4"
        },
        "push": {
          "interval": 3600,
          "receive": true,
          "timezone": "America/Los_Angeles",
          "token": "1821a91c-ee54-4bf9-8125-f0e1d0455ef7"
        }
      };
      var expected = [
        moment('Thu Jun 09 2016 16:04:09', 'ddd MMM DD YYYY HH:mm:ss').tz('America/Los_Angeles').format(),
        moment('Thu Jun 09 2016 17:04:09', 'ddd MMM DD YYYY HH:mm:ss').tz('America/Los_Angeles').format(),
        moment('Thu Jun 09 2016 18:04:09', 'ddd MMM DD YYYY HH:mm:ss').tz('America/Los_Angeles').format(),
        moment('Thu Jun 09 2016 19:04:09', 'ddd MMM DD YYYY HH:mm:ss').tz('America/Los_Angeles').format(),
        moment('Thu Jun 09 2016 20:04:09', 'ddd MMM DD YYYY HH:mm:ss').tz('America/Los_Angeles').format()
      ];
      var data = models.Consumer.parseRequest(params);
      models.Consumer.create(data)
      .then(function(result) {
        var actual = result.pushDeliveryTimes(moment('Thu Jun 09 2016 15:04:09', 'ddd MMM DD YYYY HH:mm:ss'), 7);
        expect(actual).to.deep.equal(expected);
        moment.tz.setDefault();
        done();
      });
    });

    it('should not insert a date with a time past 9PM', function (done) {
      moment.tz.setDefault('America/New_York');
      var params = {
        "device": {
          "model": "Nexus 7",
          "platform": "Android",
          "uuid": "1821a91c-ee54-4bf9-8125-f0e1d0455ef7",
          "version": "4.4"
        },
        "push": {
          "interval": 7200,
          "receive": true,
          "timezone": "America/New_York",
          "token": "1821a91c-ee54-4bf9-8125-f0e1d0455ef7"
        }
      };
      var expected = [
        moment('Mon Jun 06 2016 18:04:09', 'ddd MMM DD YYYY HH:mm:ss').tz('America/New_York').format(),
        moment('Mon Jun 06 2016 20:04:09', 'ddd MMM DD YYYY HH:mm:ss').tz('America/New_York').format()
      ];
      var data = models.Consumer.parseRequest(params);
      models.Consumer.create(data)
      .then(function(result) {
        var actual = result.pushDeliveryTimes(moment('Mon Jun 06 2016 16:04:09', 'ddd MMM DD YYYY HH:mm:ss'), 4);
        expect(actual).to.deep.equal(expected);
        moment.tz.setDefault();
        done();
      });
    });
  });

});
