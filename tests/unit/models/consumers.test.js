describe('Models: Consumer', function () {

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
