var mobie = {};

mobie.isScope = function (scope) {
  return scope && scope.$apply && scope.$applyAsync;
};

mobie.defaults = function (target, defaults) {
  var _defaults = angular.copy(defaults);

  if(angular.isObject(target) && angular.isObject(_defaults)) {
    return angular.extend(target, _defaults);
  }

  return target;
};

mobie.toArray = function(value) {
  return Array.prototype.slice.call(value);
};

function inherits (ctor, superCtor, attrs) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if(attrs) {
    angular.extend(ctor.prototype, attrs);
  }
}

var id = 0;
function nextId () {
  id++;
  return id;
}

function digest (scope, fn, context) {
  if(!scope) {
    return;
  }

  if(angular.isUndefined(fn)) {
    fn = function () {};
  }

  if(scope.$$phase || (scope.$root && scope.$root.$$phase)) {
    scope.$applyAsync(fn.bind(context));
  } else {
    scope.$apply(fn.bind(context));
  }
}

mobie.digest = digest;

angular.module('mobie.core.helpers', ['mobie.core.eventemitter']);