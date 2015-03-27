(function(root) {
  'use strict';

  var defaultAssert,
      __defaultAssert__,

      NotDefinedException,
      DefinitionNotValidException,
      AssertionException;

  var tdf = function(message) {
    var tests = [];

    var notImplemented = function NotImplementedException() {
      throw new Error("Implementation not defined" + (message ? " for: '" + message + "'" : "!"));
    };
    var chain = function() { notImplemented(); };

    chain.describe = function(fn) {
      fn.call(chain, chain);
      return chain;
    };

    chain.given = function(self) {
      return {
        when: function() {
          var args = Array.prototype.slice.call(arguments);

          return {
            then: function(validator) {
              tests.push(function(impl) {
                var actual = impl.apply(self, args);
                validator.call(self, actual, args);
              });
              return chain;
            },
            returns: function() {
              var expected = arguments.length > 1 ? arguments[1] : arguments[0];
              var assert = (arguments.length > 1 ? arguments[0] : defaultAssert) || defaultAssert;

              tests.push(function(impl) {
                var actual = impl.apply(self, args);
                assert(actual, expected);
              });
              return chain;
            }
          };
        }
      };
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
        throw new DefinitionNotValidException(message, failures[i]);
      }

      return fn;
    };

    return chain;
  };

  NotDefinedException = tdf.NotDefinedException = function NotDefinedException(message) { this.message = message; };
  DefinitionNotValidException = tdf.DefinitionNotValidException = function DefinitionNotValidException(message, failues) {
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

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = tdf;
    }
    exports.tdf = tdf;
  } else {
    root.tdf = tdf;
  }

})(this);
