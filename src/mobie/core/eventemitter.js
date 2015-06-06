/**
 * @ngdoc service
 * @name EventEmitter
 * @module mobie.core.eventemitter
 *
 * @description
 * The same EventEmitter defined at [https://iojs.org/api/events.html](https://iojs.org/api/events.html).
 *
 * Functions can then be attached to objects, to be executed
 * when an event is emitted. These functions are called listeners.
 * Inside a listener function, this refers to the EventEmitter that
 * the listener was attached to.
 *
 * ## Events Names Standard
 * Typically, event names are represented by a camel-cased string,
 * however, there aren't any strict restrictions on that, as any
 * string will be accepted.
 */

/**
 * @ngdoc method
 * @name EventEmitter#addListener
 *
 * @description
 * Adds a listener to the end of the listeners array for the specified event.
 * No checks are made to see if the listener has already been added. Multiple
 * calls passing the same combination of event and listener will result in the
 * listener being added multiple times.
 *
 * ```js
 *   server.on('connection', function (stream) {
 *   	console.log('someone connected!');
 *   });
 * ```
 *
 * @param {string} event Event name
 * @param {function} listener Function that will be called when this event fires
 *
 * @returns {object} Returns the emitter itself
 */

/**
 * @ngdoc method
 * @name EventEmitter#once
 *
 * @description
 * Adds a one time listener for the event. This listener is invoked only
 * the next time the event is fired, after which it is removed.
 *
 * ```js
 *   server.once('connection', function (stream) {
 *	   console.log('Ah, we have our first user!');
 *	 });
 * ```
 *
 * @param {string} event Event name
 * @param {function} listener Function that will be called when this event fires
 *
 * @returns {object} Returns the emitter itself
 */

/**
 * @ngdoc method
 * @name EventEmitter#removeListener
 *
 * @description
 * Remove a listener from the listener array for the specified event. **Caution:**
 * changes array indices in the listener array behind the listener.
 *
 * ```js
 *   var callback = function(stream) {
 *     console.log('someone connected!');
 *   };
 *   server.on('connection', callback);
 *   // ...
 *   server.removeListener('connection', callback);
 * ```
 *
 * `removeListener` will remove, at most, one instance of a listener from the listener
 * array. If any single listener has been added multiple times to the listener array
 * for the specified event, then `removeListener` must be called multiple times to
 * remove each instance.
 *
 * @param {string} event Event name
 * @param {function} listener Function that will be called when this event fires
 *
 * @returns {object} Returns the emitter itself
 */
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
		throw new TypeError('n must be a positive number');
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
		throw new TypeError('listener must be a function');

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
	/* jshint ignore:start */
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
	/* jshint ignore:end */

	return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function once(type, listener) {
	if (!angular.isFunction(listener)) {
		throw new TypeError('listener must be a function');
	}

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

	if (!angular.isFunction(listener)) {
		throw new TypeError('listener must be a function');
	}

	if (!this._events || !this._events[type]) {
		return this;
	}

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