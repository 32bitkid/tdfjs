# tddjs

`ttdjs` is an experimental runner-less [TDD](http://en.wikipedia.org/wiki/Test-driven_development)
tool for JavaScript.

## Goals

* Minimialistic.
* No test-runner, evaluating the code verifies the behavior.
* Suitable for testing front end prototypes, e.g. [codepen.io](http://codepen.io), [jsbin.com](http://jsbin.com), [jsfiddle.net](http://jsfiddle.net).
* Focuses tests the smallest unit of work &ndash; a single function.
* Syntax places emphasis on test-first approach.
* Couples requirements and implemention.

## Example

```js
var add = tdd("A function that adds multiple numbers")
  .when(1,1).returns(1)
  .when(2,2).returns(4)
  .when(5,-1).returns(4)
  .when(1,1,1).returns(3)
  .when(1).returns(1)
  .when(0.5,0.5,1).returns(2)
  .define(function() {
    var sum = 0;
    for(var i = 0; i < arguments.length; i++) {
      sum += arguments[i];
    }
    return sum;
  });
```

## Future thoughts

* Test quality evaluation &ndash; analyze tests cases/arguments and warn if there are cases where behavior is not defined.
* Allow multiple `function` defintions that resolve a particular set of requirements, with the ability to swap between them.
* Production switch that turns off all validation for higher performance at the obvious cost of validation.


