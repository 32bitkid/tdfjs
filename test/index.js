var tdf = require('./../index.js');
var expect = require('chai').expect;

describe("describing a function with no definition", function() {
  it("should throw if you try to use it", function() {
    var fn = tdf("a noop function");
    expect(function() { fn(); }).to.throw();
  });
});

describe("valid definitions resolve the chain", function() {

  it("should allow any implementation when there are no tests", function() {
    expect(function() {
      tdf("a noop function")
        .define(function() { });
    }).not.to.throw();
  });

  it("should the implementation function if valid", function() {
    var fn, impl = function() { };
    expect(function() {
      fn = tdf("a noop function")
            .define(impl);
    }).not.to.throw();
    expect(impl).to.equal(fn);
  });

  it("should resolve to a good implementation", function() {
    expect(function() {
      tdf("an adder")
        .when(2,2).returns(4)
        .define(function(a,b) { return a + b ; });
    }).not.to.throw();
  });

  it("should allow multiple cases", function() {
    expect(function() {
      tdf("an adder")
        .when(2,2).returns(4)
        .when(5,5).returns(10)
        .define(function(a,b) { return a + b ; });
    }).not.to.throw();
  });

});


describe("invalid definitions", function() {

  describe("by default", function() {
    it("should throw", function() {
      expect(function() {
        tdf("an adder")
          .when(2,2).returns(5)
          .define(function(a,b) { return a + b ; });
      }).to.throw();
    });
  });

});

describe("functions that have multiple validations", function() {
  it("should support `then()`", function() {
    var obj = {};

    expect(function() {
    tdf("a singleton")
      .when()
      .then(function(actual) {
        expect(actual).not.be.null;
        expect(actual).not.be.undefined;
        expect(actual).to.equal(obj);
      })
      .define(function() { return obj; });
    }).not.to.throw();
  });
});

describe("functions that use `this`", function() {

  it("should support `given()`", function() {
    expect(function() {
      tdf("get the `foo` property of the caller")
        .given({foo: "hello"})
        .when().returns("hello")
        .define(function() { return this.foo; });
    }).not.to.throw();
  });

  it("should call `then()` with the `given()` context", function() {
    expect(function() {
      tdf("increment a property on this")
        .given({foo: 10})
        .when()
        .then(function() {
          expect(this.foo).to.equal(11);
        })
        .define(function() { this.foo++; });
    }).not.to.throw();
  });

});
