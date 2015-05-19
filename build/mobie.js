angular.module('mobie.components', [
	'mobie.components.sidenav',
	'mobie.components.backdrop',
	'mobie.components.icon'
]);

angular.module('mobie', [
	'mobie.core',
	'mobie.components'
]);

angular.module('mobie.core', [
	'mobie.core.helpers',
	'mobie.core.registry',
	'mobie.core.eventemitter',
	'mobie.core.component'
]);
function MbComponentFactory (MbComponentInterface, $animate) {
	var MbComponent = MbComponentInterface.extend({
		initialize: function (componentEl, id) {
			this.setElement(componentEl);
			this.isVisible = false;

			if(angular.isDefined(id)) {
				this.setId(id);
			}

			this.on('visibleStateChangeSuccess', function () {
				if(this.getVisibleState()) {
					this.emit('visible');
				} else {
					this.emit('notVisible');
				}
			});

			this.on('visibleStateChangeStart', function (visibleState) {
				if(visibleState) {
					this.emit('visibleChangeStart');
				} else {
					this.emit('notVisibleChangeStart');
				}
			});
		},
		show: function () {
			return this.setVisibleState(true);
		},
		hide: function () {
			return this.setVisibleState(false);
		},
		toggle: function () {
			return this.setVisibleState(!this.getVisibleState());
		},
		getVisibleState: function () {
			return !!this.isVisible;
		},
		setVisibleState: function (visibleState) {
			var self = this;

			self.emit('visibleStateChangeStart', visibleState);

			var promise = $animate[visibleState ? 'addClass' : 'removeClass'](this.componentEl, 'mb-visible').then(function () {
				self.isVisible = visibleState;
				self.emit('visibleStateChangeSuccess');
			}, function (err) {
				self.emit('visibleStateChangeError', err);
			});
		},
		setId: function (id) {
			this.id = id;
		},
		getId: function () {
			return this.id;
		},
		setElement: function (componentEl) {
			this.componentEl = componentEl;
		},
		getElement: function () {
			return this.componentEl;
		}
	});

	return MbComponent;
}

function MbComponentInterface (Helpers) {
	var MbComponentInterface = Helpers.createClass({
		show: Helpers.notImplemented('show'),
		hide: Helpers.notImplemented('hide'),
		setElement: Helpers.notImplemented('setElement'),
		getElement: Helpers.notImplemented('getElement'),
		setId: Helpers.notImplemented('setId'),
		getId: Helpers.notImplemented('getId'),
		getVisibleState: Helpers.notImplemented('getVisibleState'),
		setVisibleState: Helpers.notImplemented('setVisibleState')
	});

	return MbComponentInterface;
}

angular.module('mobie.core.component', [
	'mobie.core.helpers'
])
.factory('MbComponentInterface', MbComponentInterface)
.factory('MbComponent', MbComponentFactory)
function EventEmitter() {
  EventEmitter.init.call(this);
}

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    domain = domain || require('domain');
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events)
    this._events = {};

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (!utilangularisNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error' && !this._events.error) {
    er = arguments[1];
    if (this.domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event.');
      er.domainEmitter = this;
      er.domain = this.domain;
      er.domainThrown = false;
      this.domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      throw Error('Uncaught, unspecified "error" event.');
    }
    return false;
  }

  handler = this._events[type];

  if (angular.isUndefined(handler))
    return false;

  if (this.domain && this !== process)
    this.domain.enter();

  if (angular.isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (angular.isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  if (this.domain && this !== process)
    this.domain.exit();

  return true;
};

EventEmitter.prototype.addListener = function addListener(type, listener) {
  var m;

  if (!angular.isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              angular.isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (angular.isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (angular.isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!angular.isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d %s listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length, type);
      console.trace();
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function once(type, listener) {
  if (!angular.isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
  var list, position, length, i;

  if (!angular.isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (angular.isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (angular.isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (angular.isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (Array.isArray(listeners)) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function listeners(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (angular.isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (angular.isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function EventEmitterFactory () {
  return EventEmitter;
}

angular.module('mobie.core.eventemitter', [])
.factory('EventEmitter', EventEmitterFactory);
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

function DefaultClass () {
	if(angular.isFunction(this.initialize)) {
    this.initialize.apply(this, arguments);
  }
}

function createClass (protoProps, staticProps) {
	return DefaultClass.extend(protoProps, staticProps);
}

function HelpersFactory ($rootScope, $q, EventEmitter) {
	var Helpers = {};

	function notImplemented (methodName) {
	  return $q.reject(new Error('The method ' + methodName + ' is not implemented'));
	}

  DefaultClass.extend = extend;
  inherits(DefaultClass, EventEmitter);

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

function UtilFactory () {
  var Util = {};

  Util.inherits = inherits;

  return Util;
}

angular.module('mobie.core.helpers', [
  'mobie.core.eventemitter'
])
.factory('Helpers', HelpersFactory)
.factory('Util', UtilFactory);
angular.module('mobie.core.registry', [
	'mobie.core.helpers'
])
.factory('$mbComponentRegistry', function () {
	var components = [];

	var $mbComponentRegistry = {
		get: function (componentId) {
			var component;
			angular.forEach(components, function (_component_) {
				if(_component_.id === componentId) {
					component = _component_;
				}
			});
			if(angular.isUndefined(component)) {
				throw new Error('component "' + componentId + '" is not defined');
			}
			return component;
		},
		register: function (component, componentId) {
			if(angular.isUndefined(component.id) && angular.isUndefined(componentId)) {
				throw new Error('component must have a id key or you must specify one for this instance');
			}

			if(angular.isUndefined(component.id)) {
				component.id = componentId;
			}

			components.push(component);

			return deregister;

			function deregister () {
				var index = components.indexOf(component);
				if(index !== -1) {
					components.splice(index, 1);
				}
			}
		}
	};

	return $mbComponentRegistry;
});
function BackdropFactory ($animate, MbComponent) {
	var bodyEl = angular.element(document.body);

	var el = angular.element('<div>');
	el.addClass('backdrop mb-backdrop');

	// Insert the backdrop in the body element
	$animate.enter(el, bodyEl);

	var $mbBackdrop = new MbComponent(el, 'default-backdrop');

	return $mbBackdrop;
}

angular.module('mobie.components.backdrop', [
	'mobie.core.component'
])
.factory('$mbBackdrop', BackdropFactory);
angular.module('mobie.components.icon', [])
.directive('mbIcon', function () {
	return {
		restrict: 'EA',
		scope: {
			name: '@'
		},
		template: '<span ng-class="classes" ng-show="hasIconName"></span>',
		controller: function ($scope, $attrs) {
			$scope.classes = {
				fa: true
			};

			$attrs.$observe('name', function (iconName) {
				if(iconName) {
					$scope.hasIconName = $scope.classes['fa-' + iconName] = true;
				} else {
					$scope.hasIconName = false;
				}
			});
		}
	};
});
function $MbSidenavFactory ($mbComponentRegistry) {
	return function (componentId) {
		return $mbComponentRegistry.get(componentId);
	};
}

function SidenavDirective () {
	return {
		restrict: 'EA',
		scope: {},
		controller: '$mbSidenavController',
		controllerAs: 'mbSidenavCtrl'
	};
}

angular.module('mobie.components.sidenav', [
	'mobie.components.backdrop',
	'mobie.core.registry',
	'mobie.core.component'
])
.controller('$mbSidenavController', function ($scope, $element, $attrs, $transclude, MbComponent, $mbComponentRegistry, $mbBackdrop) {
	var component = this.component = new MbComponent($element, $attrs.componentId);
	var backdropEl = $mbBackdrop.getElement();

	$mbComponentRegistry.register(this.component);

	function onClickListener(evt) {
		component.hide();
		$scope.$apply();
	}

	component.on('visibleChangeStart', function () {
		$mbBackdrop.show();
	});

	component.on('visibleStateChangeError', function hideBackdropListener () {
		$scope.$apply(function () {
			$mbBackdrop.hide();
		});
	});

	component.on('visible', function () {
		$scope.$apply(function () {
			backdropEl.on('click', onClickListener);
		});
	});

	component.on('notVisible', function () {
		$scope.$apply(function () {
			backdropEl.off('click', onClickListener);
			$mbBackdrop.hide();
		});
	});
})
.factory('$mbSidenav', $MbSidenavFactory)
.directive('mbSidenav', SidenavDirective)