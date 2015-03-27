(function(root) {
  'use strict';

  var defaultAssert,
      __defaultAssert__,

      NotDefinedException,
      DefinitionNotValidException,
      AssertionException,
      NotImplementedException;

  var tdf = function(message) {
    var tests = [];

    var notImplemented = function () {
      throw new NotImplementedException("Implementation not defined" + (message ? " for: '" + message + "'" : "!"));
    };
    var chain = function() { notImplemented(); };

    chain.describe = function(fn) {
      fn.call(chain, chain);
      return chain;
    };

    chain.given = function(self) {
      var givenChain = function() { notImplemented(); };

      givenChain.when = function() {
        var args = Array.prototype.slice.call(arguments);

        var whenChain = function() { notImplemented(); };

        whenChain.then = function(validator) {
          tests.push(function(impl) {
            var actual = impl.apply(self, args);
            validator.call(self, actual, args);
          });
          return chain;
        };

        whenChain.returns = function() {
          var expected = arguments.length > 1 ? arguments[1] : arguments[0];
          var assert = (arguments.length > 1 ? arguments[0] : defaultAssert) || defaultAssert;

          tests.push(function(impl) {
            var actual = impl.apply(self, args);
            assert(actual, expected);
          });
          return chain;
        };

        return whenChain;
      };

      return givenChain;
    };

    chain.when = function() { return chain.given(void 0).when.apply(void 0, arguments); };

    chain.define = function(fn) {
      var test, failures = [];
      for(var i=0;i<tests.length;i++) {
        test = tests[i];
        try {
          test.call(void 0, fn);
        } catch(ex) {
          failures.push(ex);
        }
      }

      if(failures.length > 0) {
        if(tdf.quietDefine) return function() { throw new DefinitionNotValidException(message, failures); };
        throw new DefinitionNotValidException(message, failures);
      }

      return fn;
    };

    return chain;
  };

  NotImplementedException = tdf.NotImplementedException = function NotImplementedException(message) { this.message = message; };
  NotDefinedException = tdf.NotDefinedException = function NotDefinedException(message) { this.message = message; };
  DefinitionNotValidException = tdf.DefinitionNotValidException = function DefinitionNotValidException(message, failures) {
    this.message = "Invalid Implementation: " + message;
    this.failures = failures;
  };
  AssertionException = tdf.AssertionException = function AssertionException(message) { this.message = message; };

  defaultAssert = __defaultAssert__ = function(a,b,msg) {
    if (a!==b) throw new AssertionException(msg || a + " !== " + b);
  };

  tdf.setDefaultAssert = function(assert) {
    defaultAssert = assert || __defaultAssert__;
  };

  tdf.quietDefine = false;

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = tdf;
    }
    exports.tdf = tdf;
  } else {
    root.tdf = tdf;
  }

})(this);
