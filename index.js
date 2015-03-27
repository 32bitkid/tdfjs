(function(root) {
  'use strict';

  var defaultAssert,
      __defaultAssert__,

      DefinitionNotValidException,
      AssertionException,
      NotImplementedException;

  var getStack = function() {
    return tdf.tryStack ? ((new Error()).stack || []).split("\n").slice(3).join("\n") : undefined;
  };

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
          var stack = getStack();
          tests.push(function(impl) {
            try {
              var actual = impl.apply(self, args);
              validator.call(self, actual, args);
            } catch (ex) {
              throw new (function TDFValidationException() {
                this.innerException = ex;
                this.toString = function() { return ex.toString() + (stack ? "\n" + stack : ''); }
              })();
            }
          });
          return chain;
        };

        whenChain.returns = function() {
          var stack = getStack();
          var expected = arguments.length > 1 ? arguments[1] : arguments[0];
          var assert = (arguments.length > 1 ? arguments[0] : defaultAssert) || defaultAssert;

          tests.push(function(impl) {
            try {
              var actual = impl.apply(self, args);
              assert(actual, expected);
            } catch (ex) {
              throw new (function TDFValidationException() {
                this.innerException = ex;
                this.toString = function() { return ex.toString() + (stack ? "\n" + stack : ''); }
              })();
            }
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
        trigger("fail", [message, failures]);
        if(tdf.quietDefine) return function() { throw new DefinitionNotValidException(message, failures); };
        throw new DefinitionNotValidException(message, failures);
      }

      trigger("pass", [message]);
      return fn;
    };

    return chain;
  };

  var getMessage = function() { return this.message; };

  NotImplementedException = tdf.NotImplementedException = function NotImplementedException(message) { this.message = message; };
  NotImplementedException.prototype.toString = getMessage;
  DefinitionNotValidException = tdf.DefinitionNotValidException = function DefinitionNotValidException(message, failures) {
    this.message = "Invalid implementation: '" + message + "'";
    this.failures = failures || [];
  };
  DefinitionNotValidException.prototype.toString = function() {
    var failText = this.failures.map(function(e) {
      return "\t\u2717 " + e.toString();
    }).join("\n\n");
    return this.message + "\n\n" + failText;
  };
  AssertionException = tdf.AssertionException = function AssertionException(message) { this.message = message; };
  AssertionException.prototype.toString = getMessage;

  defaultAssert = __defaultAssert__ = function(a,b,msg) {
    if (a!==b) throw new AssertionException(msg || a + " !== " + b);
  };

  tdf.setDefaultAssert = function(assert) {
    defaultAssert = assert || __defaultAssert__;
  };

  // If true then defer `define()` errors until invoke rather than at definition.
  tdf.quietDefine = false;

  // Try to get stack traces
  tdf.tryStack = false;

  // Events
  var trigger = (function() {
    var eventsCache = {};

    tdf.on = function(name, callback, ctx) {
      var events = eventsCache[name] || (eventsCache[name] = []);
      events.push({cb: callback, ctx: ctx });
    };

    tdf.off = function(name, callback) {
      var events = eventsCache[name];

      // Return if no events
      if(!events) return;

      // If no callback, then clean all events
      if(!callback) return eventCache[name] = [], void 0;

      // find and remove the matching callback
      for(var idx = events.length - 1; idx >= 0; idx--) {
        if(events[idx].cb === callback) break;
      }
      if(idx !== -1) events.splice(idx, 1);
    }

    return function trigger(name, args) {
      var events = eventsCache[name];
      if (!events) return;
      for(var i=0;i<events.length;i++) {
        var e = events[i];
        e.cb.apply(e.ctx, args);
      }
    };
  })();

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = tdf;
    }
    exports.tdf = tdf;
  } else {
    root.tdf = tdf;
  }

})(this);
