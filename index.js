(function(root) {
  'use strict';

  var __defaultAssert__ = function(a,b, msg) { if (a!==b) throw new Error(msg || a + " !== " + b); };

  var tdf = function(message) {
    var tests = [];

    var chain = function() { throw new Error("Implementation not defined!"); };

    chain.add = function(test) {
      tests.push(test);
      return chain;
    };

    chain.given = function(self) {
      return {
        when: function() {
          var args = arguments;

          return {
            then: function(validator) {
              tests.push(function(impl) {
                var actual = impl.apply(void 0, args);
                validator.apply(self, actual, args);
              });
              return chain;
            },
            returns: function(expected, asserter) {
              tests.push(function(impl) {
                var actual = impl.apply(void 0, args);
                asserter = (asserter || __defaultAssert__);
                asserter(actual, expected);
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
        for(var i=0;i<failures.length;i++) console.error(failures[i]);
        throw new Error(message ? "Fail: " + message : "Fail");
      }

      return fn;
    };

    return chain;
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
