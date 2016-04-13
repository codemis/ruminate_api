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

});
