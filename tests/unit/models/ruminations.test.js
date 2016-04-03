describe('Models: Rumination', function () {

  describe('parseRequest()', function () {

    it('should parse a complete data request', function () {
      var data = {
        "passage": {
          "version": "ESV",
          "snippet": "When the righteous thrive, the people rejoice...",
          "first": {
            "book": "Proverbs",
            "abbreviation": "Prov",
            "chapter": 29,
            "verse": 2
          },
          "last": {
            "book": "Proverbs",
            "abbreviation": "Prov",
            "chapter": 30,
            "verse": 3
          }
        }
      };
      var expected = {
        passageVersion:     'ESV',
        passageSnippet:     'When the righteous thrive, the people rejoice...',
        firstBook:          'Proverbs',
        firstAbbreviation:  'Prov',
        firstChapter:       29,
        firstVerse:         2,
        lastBook:           'Proverbs',
        lastAbbreviation:   'Prov',
        lastChapter:        30,
        lastVerse:          3
      };
      var actual = models.Rumination.parseRequest(data);
      expect(actual).to.shallowDeepEqual(expected);
    });

    it('should parse a partial object', function () {
      var data = {
        "passage": {
          "version": "ESV",
          "first": {
            "book": "Proverbs",
            "abbreviation": "Prov",
            "verse": 2
          }
        }
      };
      var expected = {
        passageVersion:     'ESV',
        firstBook:          'Proverbs',
        firstAbbreviation:  'Prov',
        firstVerse:         2
      };
      var actual = models.Rumination.parseRequest(data);
      expect(actual).to.shallowDeepEqual(expected);
    });

  });

});
