function extend (protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent constructor.
  if (protoProps && angular.hasOwnProperty(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  angular.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent` constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) angular.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
}

function DefaultClass () {
	if(angular.isFunction(this.initialize)) {
    this.initialize.apply(this, arguments);
  }
}

DefaultClass.extend = extend;

function createClass (protoProps, staticProps) {
	return DefaultClass.extend(protoProps, staticProps);
}

function HelpersFactory ($rootScope, $q) {
	var Helpers = {};

	function notImplemented (methodName) {
	  return $q.reject(new Error('The method ' + methodName + ' is not implemented'));
	}

	Helpers.createClass = createClass;
	Helpers.notImplemented = notImplemented;
	Helpers.safeDigest = function (scope, fn) {
		if(angular.isUndefined(scope)) {
			scope = $rootScope;
		}

		angular.isDefined(scope.$$phase) ||
		angular.isDefined(scope.$root.$$phase) ?
		scope.$$postDigest(fn) :
		scope.$apply(fn);
	};

	return Helpers;
}

angular.module('mobie.core.helpers', []).factory('Helpers', HelpersFactory);