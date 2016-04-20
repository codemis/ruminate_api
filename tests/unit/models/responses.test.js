describe('Models: Response', function () {

  describe('parseRequest()', function() {

    it('should parse the request', function () {
      var data = {
        "answer": "The verse focuses on introducing the book to the reader, and explain the current state of Isreal."
      };
      var expected = {
        answer: 'The verse focuses on introducing the book to the reader, and explain the current state of Isreal.'
      };
      var actual = models.Response.parseRequest(data);
      expect(actual).to.shallowDeepEqual(expected);
    });

  });

  describe('parseSortOrder()', function () {

    it('should set the default if no params are passed in', function () {
      var actual = models.Response.parseSortOrder({});
      expect(actual[1]).to.equal('createdAt');
      expect(actual[2]).to.equal('ASC');
    });

    it('should set the given params that are passed in', function () {
      var data = {
        sort_responses: "updatedAt|desc"
      };
      var actual = models.Response.parseSortOrder(data);
      expect(actual[1]).to.equal('updatedAt');
      expect(actual[2]).to.equal('DESC');
    });

    it('should throw an error if you pass a bad field', function () {
      var data = {
        sort_responses: "ConsumerId|desc"
      };
      var fn = function() {
        models.Response.parseSortOrder(data);
      };
      expect(fn).to.throw('The field you provided is not allowed.');
    });

    it('should throw an error if you pass a bad direction', function () {
      var data = {
        sort_responses: "updatedAt|backwards"
      };
      var fn = function() {
        models.Response.parseSortOrder(data);
      };
      expect(fn).to.throw('The direction you provided is not allowed.');
    });
  });

});
