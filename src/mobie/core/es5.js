var Empty = function Empty() {};
var array_push = Array.prototype.push;
var max = Math.max;
var array_slice = Array.prototype.slice;
var fnClass = '[object Function]';
var to_string = Object.prototype.toString;
var array_concat = Array.prototype.concat;

function tryFunctionObject(value) {
	try {
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
}

var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

function isCallable(value) {
	if (typeof value !== 'function') {
		return false;
	}
	if (hasToStringTag) {
		return tryFunctionObject(value);
	}
	var strClass = to_string.call(value);
	return strClass === fnClass || strClass === genClass;
}

angular.extend(Function.prototype, {
	bind: function bind(that) { // .length is 1
		// 1. Let Target be the this value.
		var target = this;
		// 2. If IsCallable(Target) is false, throw a TypeError exception.
		if (!isCallable(target)) {
			throw new TypeError('Function.prototype.bind called on incompatible ' + target);
		}
		// 3. Let A be a new (possibly empty) internal list of all of the
		//   argument values provided after thisArg (arg1, arg2 etc), in order.
		// XXX slicedArgs will stand in for "A" if used
		var args = array_slice.call(arguments, 1); // for normal call
		// 4. Let F be a new native ECMAScript object.
		// 11. Set the [[Prototype]] internal property of F to the standard
		//   built-in Function prototype object as specified in 15.3.3.1.
		// 12. Set the [[Call]] internal property of F as described in
		//   15.3.4.5.1.
		// 13. Set the [[Construct]] internal property of F as described in
		//   15.3.4.5.2.
		// 14. Set the [[HasInstance]] internal property of F as described in
		//   15.3.4.5.3.
		var bound;
		var binder = function () {
			if (this instanceof bound) {
				// 15.3.4.5.2 [[Construct]]
				// When the [[Construct]] internal method of a function object,
				// F that was created using the bind function is called with a
				// list of arguments ExtraArgs, the following steps are taken:
				// 1. Let target be the value of F's [[TargetFunction]]
				//   internal property.
				// 2. If target has no [[Construct]] internal method, a
				//   TypeError exception is thrown.
				// 3. Let boundArgs be the value of F's [[BoundArgs]] internal
				//   property.
				// 4. Let args be a new list containing the same values as the
				//   list boundArgs in the same order followed by the same
				//   values as the list ExtraArgs in the same order.
				// 5. Return the result of calling the [[Construct]] internal
				//   method of target providing args as the arguments.

				var result = target.apply(
					this,
					array_concat.call(args, array_slice.call(arguments))
				);
				if ($Object(result) === result) {
					return result;
				}
				return this;
			} else {
				// 15.3.4.5.1 [[Call]]
				// When the [[Call]] internal method of a function object, F,
				// which was created using the bind function is called with a
				// this value and a list of arguments ExtraArgs, the following
				// steps are taken:
				// 1. Let boundArgs be the value of F's [[BoundArgs]] internal
				//   property.
				// 2. Let boundThis be the value of F's [[BoundThis]] internal
				//   property.
				// 3. Let target be the value of F's [[TargetFunction]] internal
				//   property.
				// 4. Let args be a new list containing the same values as the
				//   list boundArgs in the same order followed by the same
				//   values as the list ExtraArgs in the same order.
				// 5. Return the result of calling the [[Call]] internal method
				//   of target providing boundThis as the this value and
				//   providing args as the arguments.

				// equiv: target.call(this, ...boundArgs, ...args)
				return target.apply(
					that,
					array_concat.call(args, array_slice.call(arguments))
				);

			}
		};

		// 15. If the [[Class]] internal property of Target is "Function", then
		//     a. Let L be the length property of Target minus the length of A.
		//     b. Set the length own property of F to either 0 or L, whichever is
		//       larger.
		// 16. Else set the length own property of F to 0.

		var boundLength = max(0, target.length - args.length);

		// 17. Set the attributes of the length own property of F to the values
		//   specified in 15.3.5.1.
		var boundArgs = [];
		for (var i = 0; i < boundLength; i++) {
			array_push.call(boundArgs, '$' + i);
		}

		// XXX Build a dynamic function with desired amount of arguments is the only
		// way to set the length property of a function.
		// In environments where Content Security Policies enabled (Chrome extensions,
		// for ex.) all use of eval or Function costructor throws an exception.
		// However in all of these environments Function.prototype.bind exists
		// and so this code will never be executed.
		bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

		if (target.prototype) {
			Empty.prototype = target.prototype;
			bound.prototype = new Empty();
			// Clean up dangling references.
			Empty.prototype = null;
		}

		// TODO
		// 18. Set the [[Extensible]] internal property of F to true.

		// TODO
		// 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
		// 20. Call the [[DefineOwnProperty]] internal method of F with
		//   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
		//   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
		//   false.
		// 21. Call the [[DefineOwnProperty]] internal method of F with
		//   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
		//   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
		//   and false.

		// TODO
		// NOTE Function objects created using Function.prototype.bind do not
		// have a prototype property or the [[Code]], [[FormalParameters]], and
		// [[Scope]] internal properties.
		// XXX can't delete prototype in pure-js.

		// 22. Return F.
		return bound;
	}
});