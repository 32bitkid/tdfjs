var tdf = require('./../index.js');
var expect = require('chai').expect;


describe("events", function() {

  before(function() {
    tdf.quietDefine = true;
  });

  after(function() {
    tdf.quietDefine = false;
  });

  var calls, isCalled;
  beforeEach(function() {
    calls = 0;
    isCalled = function() { calls++; };
    tdf.on("fail", isCalled);
  })

  afterEach(function() {
    tdf.off("fail", isCalled);
    isCalled = undefined;
    calls = undefined;
  });

  it("should emit events when a `define` fails", function() {
    var fn = tdf()
      .when()
      .returns({})
      .define(function() {});

    expect(calls).to.equal(1);
  });
});
