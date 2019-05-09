describe('clinical:hl7-resources-explanation-of-benefits', function () {
  var server = meteor();
  var client = browser(server);

  it('ExplanationOfBenefit should exist on the client', function () {
    return client.execute(function () {
      expect(ExplanationOfBenefit).to.exist;
    });
  });

  it('ExplanationOfBenefit should exist on the server', function () {
    return server.execute(function () {
      expect(ExplanationOfBenefit).to.exist;
    });
  });

});
