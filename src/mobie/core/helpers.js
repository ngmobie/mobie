function inherits (ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

var id = 0;
function nextId () {
  id++;
  return id;
}

function digest (scope, fn) {
  if(!scope) {
    return;
  }

  if(angular.isUndefined(fn)) {
    fn = function () {};
  }

  if(scope.$$phase || (scope.$root && scope.$root.$$phase)) {
    fn(scope);
  } else {
    scope.$apply(fn);
  }
}

angular.module('mobie.core.helpers', ['mobie.core.eventemitter']);