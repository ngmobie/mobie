!function(root) {
    function define(moduleName, fn) {
        modules[moduleName] = {
            id: moduleName,
            filename: moduleName,
            loaded: !1,
            exports: fn(root),
            require: require,
            parent: [],
            children: []
        };
    }
    var modules = {}, global = {}, isUndefined = function(variable) {
        return "undefined" == typeof variable;
    };
    Error.hasOwnProperty("captureStackTrace") || (Error.captureStackTrace = function(obj) {
        if (Error.prepareStackTrace) {
            var frame = {
                isEval: function() {
                    return !1;
                },
                getFileName: function() {
                    return "filename";
                },
                getLineNumber: function() {
                    return 1;
                },
                getColumnNumber: function() {
                    return 1;
                },
                getFunctionName: function() {
                    return "functionName";
                }
            };
            obj.stack = Error.prepareStackTrace(obj, [ frame, frame, frame ]);
        } else obj.stack = obj.stack || obj.name || "Error";
    });
    var require = global.require = function(moduleName) {
        var module = modules[moduleName];
        if (isUndefined(module.exports)) throw new Error("module named " + moduleName + " does not exist");
        return module.loaded || (module.exports.apply(module, [ module, module.exports ]), 
        "punycode" === moduleName && (module.exports = module.punycode), isUndefined(root[moduleName]) && (root[moduleName] = module.exports), 
        module.loaded = !0), module.exports;
    }, process = global.process = {
        platform: "linux",
        _setupDomainUse: function() {},
        stderr: {
            write: function() {
                console.log.apply(console, arguments);
            }
        },
        stdout: {
            write: function() {
                console.log.apply(console, arguments);
            }
        },
        noDeprecation: !1,
        throwDeprecation: !1,
        traceDeprecation: !1,
        ENV: {
            NODE_DEBUG: !1
        },
        pid: 12345,
        binding: function() {
            throw new Error("process.binding is not supported");
        },
        cwd: function() {
            return window.location.href;
        }
    }, init = function() {
        Object.keys(modules).forEach(function(moduleName) {
            require(moduleName);
        }, this);
    };
    define("assert", function(root) {
        return function(module, exports) {
            "use strict";
            function truncate(s, n) {
                return "string" == typeof s ? s.length < n ? s : s.slice(0, n) : s;
            }
            function getMessage(self) {
                return truncate(util.inspect(self.actual), 128) + " " + self.operator + " " + truncate(util.inspect(self.expected), 128);
            }
            function fail(actual, expected, message, operator, stackStartFunction) {
                throw new assert.AssertionError({
                    message: message,
                    actual: actual,
                    expected: expected,
                    operator: operator,
                    stackStartFunction: stackStartFunction
                });
            }
            function ok(value, message) {
                value || fail(value, !0, message, "==", assert.ok);
            }
            function _deepEqual(actual, expected, strict) {
                return actual === expected ? !0 : util.isDate(actual) && util.isDate(expected) ? actual.getTime() === expected.getTime() : util.isRegExp(actual) && util.isRegExp(expected) ? actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase : null !== actual && "object" == typeof actual || null !== expected && "object" == typeof expected ? objEquiv(actual, expected, strict) : strict ? actual === expected : actual == expected;
            }
            function isArguments(object) {
                return "[object Arguments]" == Object.prototype.toString.call(object);
            }
            function objEquiv(a, b, strict) {
                if (null === a || void 0 === a || null === b || void 0 === b) return !1;
                if (util.isPrimitive(a) || util.isPrimitive(b)) return a === b;
                if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return !1;
                var aIsArgs = isArguments(a), bIsArgs = isArguments(b);
                if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs) return !1;
                if (aIsArgs) return a = pSlice.call(a), b = pSlice.call(b), _deepEqual(a, b, strict);
                var key, i, ka = Object.keys(a), kb = Object.keys(b);
                if (ka.length !== kb.length) return !1;
                for (ka.sort(), kb.sort(), i = ka.length - 1; i >= 0; i--) if (ka[i] !== kb[i]) return !1;
                for (i = ka.length - 1; i >= 0; i--) if (key = ka[i], !_deepEqual(a[key], b[key], strict)) return !1;
                return !0;
            }
            function notDeepStrictEqual(actual, expected, message) {
                _deepEqual(actual, expected, !0) && fail(actual, expected, message, "notDeepStrictEqual", notDeepStrictEqual);
            }
            function expectedException(actual, expected) {
                return actual && expected ? "[object RegExp]" == Object.prototype.toString.call(expected) ? expected.test(actual) : actual instanceof expected ? !0 : expected.call({}, actual) === !0 ? !0 : !1 : !1;
            }
            function _throws(shouldThrow, block, expected, message) {
                var actual;
                if ("function" != typeof block) throw new TypeError("block must be a function");
                "string" == typeof expected && (message = expected, expected = null);
                try {
                    block();
                } catch (e) {
                    actual = e;
                }
                if (message = (expected && expected.name ? " (" + expected.name + ")." : ".") + (message ? " " + message : "."), 
                shouldThrow && !actual && fail(actual, expected, "Missing expected exception" + message), 
                !shouldThrow && expectedException(actual, expected) && fail(actual, expected, "Got unwanted exception" + message), 
                shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) throw actual;
            }
            var util = require("util"), pSlice = Array.prototype.slice, assert = module.exports = ok;
            assert.AssertionError = function(options) {
                this.name = "AssertionError", this.actual = options.actual, this.expected = options.expected, 
                this.operator = options.operator, options.message ? (this.message = options.message, 
                this.generatedMessage = !1) : (this.message = getMessage(this), this.generatedMessage = !0);
                var stackStartFunction = options.stackStartFunction || fail;
                Error.captureStackTrace(this, stackStartFunction);
            }, util.inherits(assert.AssertionError, Error), assert.fail = fail, assert.ok = ok, 
            assert.equal = function(actual, expected, message) {
                actual != expected && fail(actual, expected, message, "==", assert.equal);
            }, assert.notEqual = function(actual, expected, message) {
                actual == expected && fail(actual, expected, message, "!=", assert.notEqual);
            }, assert.deepEqual = function(actual, expected, message) {
                _deepEqual(actual, expected, !1) || fail(actual, expected, message, "deepEqual", assert.deepEqual);
            }, assert.deepStrictEqual = function(actual, expected, message) {
                _deepEqual(actual, expected, !0) || fail(actual, expected, message, "deepStrictEqual", assert.deepStrictEqual);
            }, assert.notDeepEqual = function(actual, expected, message) {
                _deepEqual(actual, expected, !1) && fail(actual, expected, message, "notDeepEqual", assert.notDeepEqual);
            }, assert.notDeepStrictEqual = notDeepStrictEqual, assert.strictEqual = function(actual, expected, message) {
                actual !== expected && fail(actual, expected, message, "===", assert.strictEqual);
            }, assert.notStrictEqual = function(actual, expected, message) {
                actual === expected && fail(actual, expected, message, "!==", assert.notStrictEqual);
            }, assert["throws"] = function(block, error, message) {
                _throws.apply(this, [ !0 ].concat(pSlice.call(arguments)));
            }, assert.doesNotThrow = function(block, message) {
                _throws.apply(this, [ !1 ].concat(pSlice.call(arguments)));
            }, assert.ifError = function(err) {
                if (err) throw err;
            };
        };
    }), define("domain", function(root) {
        return function(module, exports) {
            "use strict";
            function Domain() {
                EventEmitter.call(this), this.members = [];
            }
            function intercepted(_this, self, cb, fnargs) {
                if (!self._disposed) {
                    if (fnargs[0] && fnargs[0] instanceof Error) {
                        var er = fnargs[0];
                        return util._extend(er, {
                            domainBound: cb,
                            domainThrown: !1,
                            domain: self
                        }), void self.emit("error", er);
                    }
                    var i, ret, args = [];
                    if (self.enter(), fnargs.length > 1) {
                        for (i = 1; i < fnargs.length; i++) args.push(fnargs[i]);
                        ret = cb.apply(_this, args);
                    } else ret = cb.call(_this);
                    return self.exit(), ret;
                }
            }
            function bound(_this, self, cb, fnargs) {
                if (!self._disposed) {
                    var ret;
                    return self.enter(), ret = fnargs.length > 0 ? cb.apply(_this, fnargs) : cb.call(_this), 
                    self.exit(), ret;
                }
            }
            var util = require("util"), EventEmitter = require("events"), inherits = util.inherits;
            EventEmitter.usingDomains = !0;
            var _domain = [ null ];
            Object.defineProperty(process, "domain", {
                enumerable: !0,
                get: function() {
                    return _domain[0];
                },
                set: function(arg) {
                    return _domain[0] = arg;
                }
            });
            var _domain_flag = {};
            process._setupDomainUse(_domain, _domain_flag), exports.Domain = Domain, exports.create = exports.createDomain = function() {
                return new Domain();
            };
            var stack = [];
            exports._stack = stack, exports.active = null, inherits(Domain, EventEmitter), Domain.prototype.members = void 0, 
            Domain.prototype._disposed = void 0, Domain.prototype._errorHandler = function(er) {
                var caught = !1;
                if (this._disposed) return !0;
                util.isPrimitive(er) || (er.domain = this, er.domainThrown = !0);
                try {
                    caught = this.emit("error", er), stack.length = 0, exports.active = process.domain = null;
                } catch (er2) {
                    return this === exports.active && stack.pop(), stack.length ? (exports.active = process.domain = stack[stack.length - 1], 
                    caught = process._fatalException(er2)) : caught = !1, caught;
                }
                return caught;
            }, Domain.prototype.enter = function() {
                this._disposed || (exports.active = process.domain = this, stack.push(this), _domain_flag[0] = stack.length);
            }, Domain.prototype.exit = function() {
                var index = stack.lastIndexOf(this);
                this._disposed || -1 === index || (stack.splice(index), _domain_flag[0] = stack.length, 
                exports.active = stack[stack.length - 1], process.domain = exports.active);
            }, Domain.prototype.add = function(ee) {
                if (!this._disposed && ee.domain !== this) {
                    if (ee.domain && ee.domain.remove(ee), this.domain && ee instanceof Domain) for (var d = this.domain; d; d = d.domain) if (ee === d) return;
                    ee.domain = this, this.members.push(ee);
                }
            }, Domain.prototype.remove = function(ee) {
                ee.domain = null;
                var index = this.members.indexOf(ee);
                -1 !== index && this.members.splice(index, 1);
            }, Domain.prototype.run = function(fn) {
                if (!this._disposed) {
                    this.enter();
                    var ret = fn.call(this);
                    return this.exit(), ret;
                }
            }, Domain.prototype.intercept = function(cb) {
                function runIntercepted() {
                    return intercepted(this, self, cb, arguments);
                }
                var self = this;
                return runIntercepted;
            }, Domain.prototype.bind = function(cb) {
                function runBound() {
                    return bound(this, self, cb, arguments);
                }
                var self = this;
                return runBound.domain = this, runBound;
            }, Domain.prototype.dispose = util.deprecate(function() {
                this._disposed || (this.exit(), this.domain && this.domain.remove(this), this.members.length = 0, 
                this._disposed = !0);
            });
        };
    }), define("events", function(root) {
        return function(module, exports) {
            "use strict";
            function EventEmitter() {
                EventEmitter.init.call(this);
            }
            var domain, util = require("util");
            module.exports = EventEmitter, EventEmitter.EventEmitter = EventEmitter, EventEmitter.usingDomains = !1, 
            EventEmitter.prototype.domain = void 0, EventEmitter.prototype._events = void 0, 
            EventEmitter.prototype._maxListeners = void 0, EventEmitter.defaultMaxListeners = 10, 
            EventEmitter.init = function() {
                this.domain = null, EventEmitter.usingDomains && (domain = domain || require("domain"), 
                !domain.active || this instanceof domain.Domain || (this.domain = domain.active)), 
                this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = {}), 
                this._maxListeners = this._maxListeners || void 0;
            }, EventEmitter.prototype.setMaxListeners = function(n) {
                if (!util.isNumber(n) || 0 > n || isNaN(n)) throw TypeError("n must be a positive number");
                return this._maxListeners = n, this;
            }, EventEmitter.prototype.emit = function(type) {
                var er, handler, len, args, i, listeners;
                if (this._events || (this._events = {}), "error" === type && !this._events.error) {
                    if (er = arguments[1], !this.domain) throw er instanceof Error ? er : Error('Uncaught, unspecified "error" event.');
                    return er || (er = new Error('Uncaught, unspecified "error" event.')), er.domainEmitter = this, 
                    er.domain = this.domain, er.domainThrown = !1, this.domain.emit("error", er), !1;
                }
                if (handler = this._events[type], util.isUndefined(handler)) return !1;
                if (this.domain && this !== process && this.domain.enter(), util.isFunction(handler)) switch (arguments.length) {
                  case 1:
                    handler.call(this);
                    break;

                  case 2:
                    handler.call(this, arguments[1]);
                    break;

                  case 3:
                    handler.call(this, arguments[1], arguments[2]);
                    break;

                  default:
                    for (len = arguments.length, args = new Array(len - 1), i = 1; len > i; i++) args[i - 1] = arguments[i];
                    handler.apply(this, args);
                } else if (util.isObject(handler)) {
                    for (len = arguments.length, args = new Array(len - 1), i = 1; len > i; i++) args[i - 1] = arguments[i];
                    for (listeners = handler.slice(), len = listeners.length, i = 0; len > i; i++) listeners[i].apply(this, args);
                }
                return this.domain && this !== process && this.domain.exit(), !0;
            }, EventEmitter.prototype.addListener = function(type, listener) {
                var m;
                if (!util.isFunction(listener)) throw TypeError("listener must be a function");
                if (this._events || (this._events = {}), this._events.newListener && this.emit("newListener", type, util.isFunction(listener.listener) ? listener.listener : listener), 
                this._events[type] ? util.isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener, 
                util.isObject(this._events[type]) && !this._events[type].warned) {
                    var m;
                    m = util.isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners, 
                    m && m > 0 && this._events[type].length > m && (this._events[type].warned = !0, 
                    console.error("(node) warning: possible EventEmitter memory leak detected. %d %s listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length, type), 
                    console.trace());
                }
                return this;
            }, EventEmitter.prototype.on = EventEmitter.prototype.addListener, EventEmitter.prototype.once = function(type, listener) {
                function g() {
                    this.removeListener(type, g), fired || (fired = !0, listener.apply(this, arguments));
                }
                if (!util.isFunction(listener)) throw TypeError("listener must be a function");
                var fired = !1;
                return g.listener = listener, this.on(type, g), this;
            }, EventEmitter.prototype.removeListener = function(type, listener) {
                var list, position, length, i;
                if (!util.isFunction(listener)) throw TypeError("listener must be a function");
                if (!this._events || !this._events[type]) return this;
                if (list = this._events[type], length = list.length, position = -1, list === listener || util.isFunction(list.listener) && list.listener === listener) delete this._events[type], 
                this._events.removeListener && this.emit("removeListener", type, listener); else if (util.isObject(list)) {
                    for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
                        position = i;
                        break;
                    }
                    if (0 > position) return this;
                    1 === list.length ? (list.length = 0, delete this._events[type]) : list.splice(position, 1), 
                    this._events.removeListener && this.emit("removeListener", type, listener);
                }
                return this;
            }, EventEmitter.prototype.removeAllListeners = function(type) {
                var key, listeners;
                if (!this._events) return this;
                if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type], 
                this;
                if (0 === arguments.length) {
                    for (key in this._events) "removeListener" !== key && this.removeAllListeners(key);
                    return this.removeAllListeners("removeListener"), this._events = {}, this;
                }
                if (listeners = this._events[type], util.isFunction(listeners)) this.removeListener(type, listeners); else if (Array.isArray(listeners)) for (;listeners.length; ) this.removeListener(type, listeners[listeners.length - 1]);
                return delete this._events[type], this;
            }, EventEmitter.prototype.listeners = function(type) {
                var ret;
                return ret = this._events && this._events[type] ? util.isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
            }, EventEmitter.listenerCount = function(emitter, type) {
                var ret;
                return ret = emitter._events && emitter._events[type] ? util.isFunction(emitter._events[type]) ? 1 : emitter._events[type].length : 0;
            };
        };
    }), define("path", function(root) {
        return function(module, exports) {
            "use strict";
            function normalizeArray(parts, allowAboveRoot) {
                for (var res = [], i = 0; i < parts.length; i++) {
                    var p = parts[i];
                    p && "." !== p && (".." === p ? res.length && ".." !== res[res.length - 1] ? res.pop() : allowAboveRoot && res.push("..") : res.push(p));
                }
                return res;
            }
            function trimArray(arr) {
                for (var lastIndex = arr.length - 1, start = 0; lastIndex >= start && !arr[start]; start++) ;
                for (var end = lastIndex; end >= 0 && !arr[end]; end--) ;
                return 0 === start && end === lastIndex ? arr : start > end ? [] : arr.slice(start, end + 1);
            }
            function win32SplitPath(filename) {
                var result = splitDeviceRe.exec(filename), device = (result[1] || "") + (result[2] || ""), tail = result[3] || "", result2 = splitTailRe.exec(tail), dir = result2[1], basename = result2[2], ext = result2[3];
                return [ device, dir, basename, ext ];
            }
            function win32StatPath(path) {
                var result = splitDeviceRe.exec(path), device = result[1] || "", isUnc = !!device && ":" !== device[1];
                return {
                    device: device,
                    isUnc: isUnc,
                    isAbsolute: isUnc || !!result[2],
                    tail: result[3]
                };
            }
            function normalizeUNCRoot(device) {
                return "\\\\" + device.replace(/^[\\\/]+/, "").replace(/[\\\/]+/g, "\\");
            }
            function posixSplitPath(filename) {
                return splitPathRe.exec(filename).slice(1);
            }
            var isWindows = "win32" === process.platform, util = require("util"), splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/, splitTailRe = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/, win32 = {};
            win32.resolve = function() {
                for (var resolvedDevice = "", resolvedTail = "", resolvedAbsolute = !1, i = arguments.length - 1; i >= -1; i--) {
                    var path;
                    if (i >= 0 ? path = arguments[i] : resolvedDevice ? (path = process.env["=" + resolvedDevice], 
                    path && path.substr(0, 3).toLowerCase() === resolvedDevice.toLowerCase() + "\\" || (path = resolvedDevice + "\\")) : path = process.cwd(), 
                    !util.isString(path)) throw new TypeError("Arguments to path.resolve must be strings");
                    if (path) {
                        var result = win32StatPath(path), device = result.device, isUnc = result.isUnc, isAbsolute = result.isAbsolute, tail = result.tail;
                        if ((!device || !resolvedDevice || device.toLowerCase() === resolvedDevice.toLowerCase()) && (resolvedDevice || (resolvedDevice = device), 
                        resolvedAbsolute || (resolvedTail = tail + "\\" + resolvedTail, resolvedAbsolute = isAbsolute), 
                        resolvedDevice && resolvedAbsolute)) break;
                    }
                }
                return isUnc && (resolvedDevice = normalizeUNCRoot(resolvedDevice)), resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/), !resolvedAbsolute).join("\\"), 
                resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
            }, win32.normalize = function(path) {
                var result = win32StatPath(path), device = result.device, isUnc = result.isUnc, isAbsolute = result.isAbsolute, tail = result.tail, trailingSlash = /[\\\/]$/.test(tail);
                return tail = normalizeArray(tail.split(/[\\\/]+/), !isAbsolute).join("\\"), tail || isAbsolute || (tail = "."), 
                tail && trailingSlash && (tail += "\\"), isUnc && (device = normalizeUNCRoot(device)), 
                device + (isAbsolute ? "\\" : "") + tail;
            }, win32.isAbsolute = function(path) {
                return win32StatPath(path).isAbsolute;
            }, win32.join = function() {
                for (var paths = [], i = 0; i < arguments.length; i++) {
                    var arg = arguments[i];
                    if (!util.isString(arg)) throw new TypeError("Arguments to path.join must be strings");
                    arg && paths.push(arg);
                }
                var joined = paths.join("\\");
                return /^[\\\/]{2}[^\\\/]/.test(paths[0]) || (joined = joined.replace(/^[\\\/]{2,}/, "\\")), 
                win32.normalize(joined);
            }, win32.relative = function(from, to) {
                from = win32.resolve(from), to = win32.resolve(to);
                for (var lowerFrom = from.toLowerCase(), lowerTo = to.toLowerCase(), toParts = trimArray(to.split("\\")), lowerFromParts = trimArray(lowerFrom.split("\\")), lowerToParts = trimArray(lowerTo.split("\\")), length = Math.min(lowerFromParts.length, lowerToParts.length), samePartsLength = length, i = 0; length > i; i++) if (lowerFromParts[i] !== lowerToParts[i]) {
                    samePartsLength = i;
                    break;
                }
                if (0 == samePartsLength) return to;
                for (var outputParts = [], i = samePartsLength; i < lowerFromParts.length; i++) outputParts.push("..");
                return outputParts = outputParts.concat(toParts.slice(samePartsLength)), outputParts.join("\\");
            }, win32._makeLong = function(path) {
                if (!util.isString(path)) return path;
                if (!path) return "";
                var resolvedPath = win32.resolve(path);
                return /^[a-zA-Z]\:\\/.test(resolvedPath) ? "\\\\?\\" + resolvedPath : /^\\\\[^?.]/.test(resolvedPath) ? "\\\\?\\UNC\\" + resolvedPath.substring(2) : path;
            }, win32.dirname = function(path) {
                var result = win32SplitPath(path), root = result[0], dir = result[1];
                return root || dir ? (dir && (dir = dir.substr(0, dir.length - 1)), root + dir) : ".";
            }, win32.basename = function(path, ext) {
                var f = win32SplitPath(path)[2];
                return ext && f.substr(-1 * ext.length) === ext && (f = f.substr(0, f.length - ext.length)), 
                f;
            }, win32.extname = function(path) {
                return win32SplitPath(path)[3];
            }, win32.format = function(pathObject) {
                if (!util.isObject(pathObject)) throw new TypeError("Parameter 'pathObject' must be an object, not " + typeof pathObject);
                var root = pathObject.root || "";
                if (!util.isString(root)) throw new TypeError("'pathObject.root' must be a string or undefined, not " + typeof pathObject.root);
                var dir = pathObject.dir, base = pathObject.base || "";
                return dir ? dir[dir.length - 1] === win32.sep ? dir + base : dir + win32.sep + base : base;
            }, win32.parse = function(pathString) {
                if (!util.isString(pathString)) throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString);
                var allParts = win32SplitPath(pathString);
                if (!allParts || 4 !== allParts.length) throw new TypeError("Invalid path '" + pathString + "'");
                return {
                    root: allParts[0],
                    dir: allParts[0] + allParts[1].slice(0, -1),
                    base: allParts[2],
                    ext: allParts[3],
                    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
                };
            }, win32.sep = "\\", win32.delimiter = ";";
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, posix = {};
            posix.resolve = function() {
                for (var resolvedPath = "", resolvedAbsolute = !1, i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                    var path = i >= 0 ? arguments[i] : process.cwd();
                    if (!util.isString(path)) throw new TypeError("Arguments to path.resolve must be strings");
                    path && (resolvedPath = path + "/" + resolvedPath, resolvedAbsolute = "/" === path[0]);
                }
                return resolvedPath = normalizeArray(resolvedPath.split("/"), !resolvedAbsolute).join("/"), 
                (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            }, posix.normalize = function(path) {
                var isAbsolute = posix.isAbsolute(path), trailingSlash = path && "/" === path[path.length - 1];
                return path = normalizeArray(path.split("/"), !isAbsolute).join("/"), path || isAbsolute || (path = "."), 
                path && trailingSlash && (path += "/"), (isAbsolute ? "/" : "") + path;
            }, posix.isAbsolute = function(path) {
                return "/" === path.charAt(0);
            }, posix.join = function() {
                for (var path = "", i = 0; i < arguments.length; i++) {
                    var segment = arguments[i];
                    if (!util.isString(segment)) throw new TypeError("Arguments to path.join must be strings");
                    segment && (path += path ? "/" + segment : segment);
                }
                return posix.normalize(path);
            }, posix.relative = function(from, to) {
                from = posix.resolve(from).substr(1), to = posix.resolve(to).substr(1);
                for (var fromParts = trimArray(from.split("/")), toParts = trimArray(to.split("/")), length = Math.min(fromParts.length, toParts.length), samePartsLength = length, i = 0; length > i; i++) if (fromParts[i] !== toParts[i]) {
                    samePartsLength = i;
                    break;
                }
                for (var outputParts = [], i = samePartsLength; i < fromParts.length; i++) outputParts.push("..");
                return outputParts = outputParts.concat(toParts.slice(samePartsLength)), outputParts.join("/");
            }, posix._makeLong = function(path) {
                return path;
            }, posix.dirname = function(path) {
                var result = posixSplitPath(path), root = result[0], dir = result[1];
                return root || dir ? (dir && (dir = dir.substr(0, dir.length - 1)), root + dir) : ".";
            }, posix.basename = function(path, ext) {
                var f = posixSplitPath(path)[2];
                return ext && f.substr(-1 * ext.length) === ext && (f = f.substr(0, f.length - ext.length)), 
                f;
            }, posix.extname = function(path) {
                return posixSplitPath(path)[3];
            }, posix.format = function(pathObject) {
                if (!util.isObject(pathObject)) throw new TypeError("Parameter 'pathObject' must be an object, not " + typeof pathObject);
                var root = pathObject.root || "";
                if (!util.isString(root)) throw new TypeError("'pathObject.root' must be a string or undefined, not " + typeof pathObject.root);
                var dir = pathObject.dir ? pathObject.dir + posix.sep : "", base = pathObject.base || "";
                return dir + base;
            }, posix.parse = function(pathString) {
                if (!util.isString(pathString)) throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString);
                var allParts = posixSplitPath(pathString);
                if (!allParts || 4 !== allParts.length) throw new TypeError("Invalid path '" + pathString + "'");
                return allParts[1] = allParts[1] || "", allParts[2] = allParts[2] || "", allParts[3] = allParts[3] || "", 
                {
                    root: allParts[0],
                    dir: allParts[0] + allParts[1].slice(0, -1),
                    base: allParts[2],
                    ext: allParts[3],
                    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
                };
            }, posix.sep = "/", posix.delimiter = ":", module.exports = isWindows ? win32 : posix, 
            module.exports.posix = posix, module.exports.win32 = win32;
        };
    }), define("punycode", function(root) {
        return function(module, exports) {
            !function(root) {
                function error(type) {
                    throw RangeError(errors[type]);
                }
                function map(array, fn) {
                    for (var length = array.length; length--; ) array[length] = fn(array[length]);
                    return array;
                }
                function mapDomain(string, fn) {
                    return map(string.split(regexSeparators), fn).join(".");
                }
                function ucs2decode(string) {
                    for (var value, extra, output = [], counter = 0, length = string.length; length > counter; ) value = string.charCodeAt(counter++), 
                    value >= 55296 && 56319 >= value && length > counter ? (extra = string.charCodeAt(counter++), 
                    56320 == (64512 & extra) ? output.push(((1023 & value) << 10) + (1023 & extra) + 65536) : (output.push(value), 
                    counter--)) : output.push(value);
                    return output;
                }
                function ucs2encode(array) {
                    return map(array, function(value) {
                        var output = "";
                        return value > 65535 && (value -= 65536, output += stringFromCharCode(value >>> 10 & 1023 | 55296), 
                        value = 56320 | 1023 & value), output += stringFromCharCode(value);
                    }).join("");
                }
                function basicToDigit(codePoint) {
                    return 10 > codePoint - 48 ? codePoint - 22 : 26 > codePoint - 65 ? codePoint - 65 : 26 > codePoint - 97 ? codePoint - 97 : base;
                }
                function digitToBasic(digit, flag) {
                    return digit + 22 + 75 * (26 > digit) - ((0 != flag) << 5);
                }
                function adapt(delta, numPoints, firstTime) {
                    var k = 0;
                    for (delta = firstTime ? floor(delta / damp) : delta >> 1, delta += floor(delta / numPoints); delta > baseMinusTMin * tMax >> 1; k += base) delta = floor(delta / baseMinusTMin);
                    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
                }
                function decode(input) {
                    var out, basic, j, index, oldi, w, k, digit, t, baseMinusT, output = [], inputLength = input.length, i = 0, n = initialN, bias = initialBias;
                    for (basic = input.lastIndexOf(delimiter), 0 > basic && (basic = 0), j = 0; basic > j; ++j) input.charCodeAt(j) >= 128 && error("not-basic"), 
                    output.push(input.charCodeAt(j));
                    for (index = basic > 0 ? basic + 1 : 0; inputLength > index; ) {
                        for (oldi = i, w = 1, k = base; index >= inputLength && error("invalid-input"), 
                        digit = basicToDigit(input.charCodeAt(index++)), (digit >= base || digit > floor((maxInt - i) / w)) && error("overflow"), 
                        i += digit * w, t = bias >= k ? tMin : k >= bias + tMax ? tMax : k - bias, !(t > digit); k += base) baseMinusT = base - t, 
                        w > floor(maxInt / baseMinusT) && error("overflow"), w *= baseMinusT;
                        out = output.length + 1, bias = adapt(i - oldi, out, 0 == oldi), floor(i / out) > maxInt - n && error("overflow"), 
                        n += floor(i / out), i %= out, output.splice(i++, 0, n);
                    }
                    return ucs2encode(output);
                }
                function encode(input) {
                    var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, inputLength, handledCPCountPlusOne, baseMinusT, qMinusT, output = [];
                    for (input = ucs2decode(input), inputLength = input.length, n = initialN, delta = 0, 
                    bias = initialBias, j = 0; inputLength > j; ++j) currentValue = input[j], 128 > currentValue && output.push(stringFromCharCode(currentValue));
                    for (handledCPCount = basicLength = output.length, basicLength && output.push(delimiter); inputLength > handledCPCount; ) {
                        for (m = maxInt, j = 0; inputLength > j; ++j) currentValue = input[j], currentValue >= n && m > currentValue && (m = currentValue);
                        for (handledCPCountPlusOne = handledCPCount + 1, m - n > floor((maxInt - delta) / handledCPCountPlusOne) && error("overflow"), 
                        delta += (m - n) * handledCPCountPlusOne, n = m, j = 0; inputLength > j; ++j) if (currentValue = input[j], 
                        n > currentValue && ++delta > maxInt && error("overflow"), currentValue == n) {
                            for (q = delta, k = base; t = bias >= k ? tMin : k >= bias + tMax ? tMax : k - bias, 
                            !(t > q); k += base) qMinusT = q - t, baseMinusT = base - t, output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))), 
                            q = floor(qMinusT / baseMinusT);
                            output.push(stringFromCharCode(digitToBasic(q, 0))), bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength), 
                            delta = 0, ++handledCPCount;
                        }
                        ++delta, ++n;
                    }
                    return output.join("");
                }
                function toUnicode(domain) {
                    return mapDomain(domain, function(string) {
                        return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
                    });
                }
                function toASCII(domain) {
                    return mapDomain(domain, function(string) {
                        return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
                    });
                }
                var freeExports = "object" == typeof exports && exports, freeModule = "object" == typeof module && module && module.exports == freeExports && module, freeGlobal = "object" == typeof global && global;
                (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) && (root = freeGlobal);
                var punycode, key, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^ -~]/, regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, errors = {
                    overflow: "Overflow: input needs wider integers to process",
                    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                    "invalid-input": "Invalid input"
                }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode;
                if (punycode = {
                    version: "1.2.3",
                    ucs2: {
                        decode: ucs2decode,
                        encode: ucs2encode
                    },
                    decode: decode,
                    encode: encode,
                    toASCII: toASCII,
                    toUnicode: toUnicode
                }, "function" == typeof define && "object" == typeof define.amd && define.amd) define(function() {
                    return punycode;
                }); else if (freeExports && !freeExports.nodeType) if (freeModule) freeModule.exports = punycode; else for (key in punycode) punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]); else root.punycode = punycode;
            }(this);
        };
    }), define("querystring", function(root) {
        return function(module, exports) {
            "use strict";
            function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }
            function charCode(c) {
                return c.charCodeAt(0);
            }
            var QueryString = exports, util = require("util");
            QueryString.unescapeBuffer = function(s, decodeSpaces) {
                for (var n, m, hexchar, out = new Buffer(s.length), state = "CHAR", inIndex = 0, outIndex = 0; inIndex <= s.length; inIndex++) {
                    var c = s.charCodeAt(inIndex);
                    switch (state) {
                      case "CHAR":
                        switch (c) {
                          case charCode("%"):
                            n = 0, m = 0, state = "HEX0";
                            break;

                          case charCode("+"):
                            decodeSpaces && (c = charCode(" "));

                          default:
                            out[outIndex++] = c;
                        }
                        break;

                      case "HEX0":
                        if (state = "HEX1", hexchar = c, charCode("0") <= c && c <= charCode("9")) n = c - charCode("0"); else if (charCode("a") <= c && c <= charCode("f")) n = c - charCode("a") + 10; else {
                            if (!(charCode("A") <= c && c <= charCode("F"))) {
                                out[outIndex++] = charCode("%"), out[outIndex++] = c, state = "CHAR";
                                break;
                            }
                            n = c - charCode("A") + 10;
                        }
                        break;

                      case "HEX1":
                        if (state = "CHAR", charCode("0") <= c && c <= charCode("9")) m = c - charCode("0"); else if (charCode("a") <= c && c <= charCode("f")) m = c - charCode("a") + 10; else {
                            if (!(charCode("A") <= c && c <= charCode("F"))) {
                                out[outIndex++] = charCode("%"), out[outIndex++] = hexchar, out[outIndex++] = c;
                                break;
                            }
                            m = c - charCode("A") + 10;
                        }
                        out[outIndex++] = 16 * n + m;
                    }
                }
                return out.slice(0, outIndex - 1);
            }, QueryString.unescape = function(s, decodeSpaces) {
                try {
                    return decodeURIComponent(s);
                } catch (e) {
                    return QueryString.unescapeBuffer(s, decodeSpaces).toString();
                }
            }, QueryString.escape = function(str) {
                return encodeURIComponent(str);
            };
            var stringifyPrimitive = function(v) {
                return util.isString(v) ? v : util.isBoolean(v) ? v ? "true" : "false" : util.isNumber(v) && isFinite(v) ? v : "";
            };
            QueryString.stringify = QueryString.encode = function(obj, sep, eq, options) {
                sep = sep || "&", eq = eq || "=";
                var encode = QueryString.escape;
                if (options && "function" == typeof options.encodeURIComponent && (encode = options.encodeURIComponent), 
                util.isObject(obj)) {
                    for (var keys = Object.keys(obj), fields = [], i = 0; i < keys.length; i++) {
                        var k = keys[i], v = obj[k], ks = encode(stringifyPrimitive(k)) + eq;
                        if (util.isArray(v)) for (var j = 0; j < v.length; j++) fields.push(ks + encode(stringifyPrimitive(v[j]))); else fields.push(ks + encode(stringifyPrimitive(v)));
                    }
                    return fields.join(sep);
                }
                return "";
            }, QueryString.parse = QueryString.decode = function(qs, sep, eq, options) {
                sep = sep || "&", eq = eq || "=";
                var obj = {};
                if (!util.isString(qs) || 0 === qs.length) return obj;
                var regexp = /\+/g;
                qs = qs.split(sep);
                var maxKeys = 1e3;
                options && util.isNumber(options.maxKeys) && (maxKeys = options.maxKeys);
                var len = qs.length;
                maxKeys > 0 && len > maxKeys && (len = maxKeys);
                var decode = QueryString.unescape;
                options && "function" == typeof options.decodeURIComponent && (decode = options.decodeURIComponent);
                for (var i = 0; len > i; ++i) {
                    var kstr, vstr, k, v, x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq);
                    idx >= 0 ? (kstr = x.substr(0, idx), vstr = x.substr(idx + 1)) : (kstr = x, vstr = "");
                    try {
                        k = decode(kstr), v = decode(vstr);
                    } catch (e) {
                        k = QueryString.unescape(kstr, !0), v = QueryString.unescape(vstr, !0);
                    }
                    hasOwnProperty(obj, k) ? util.isArray(obj[k]) ? obj[k].push(v) : obj[k] = [ obj[k], v ] : obj[k] = v;
                }
                return obj;
            };
        };
    }), define("url", function(root) {
        return function(module, exports) {
            "use strict";
            function Url() {
                this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, 
                this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, 
                this.path = null, this.href = null;
            }
            function urlParse(url, parseQueryString, slashesDenoteHost) {
                if (url && util.isObject(url) && url instanceof Url) return url;
                var u = new Url();
                return u.parse(url, parseQueryString, slashesDenoteHost), u;
            }
            function urlFormat(obj) {
                return util.isString(obj) && (obj = urlParse(obj)), obj instanceof Url ? obj.format() : Url.prototype.format.call(obj);
            }
            function urlResolve(source, relative) {
                return urlParse(source, !1, !0).resolve(relative);
            }
            function urlResolveObject(source, relative) {
                return source ? urlParse(source, !1, !0).resolveObject(relative) : relative;
            }
            var punycode = require("punycode"), util = require("util");
            exports.parse = urlParse, exports.resolve = urlResolve, exports.resolveObject = urlResolveObject, 
            exports.format = urlFormat, exports.Url = Url;
            var protocolPattern = /^([a-z0-9.+-]+:)/i, portPattern = /:[0-9]*$/, simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, delims = [ "<", ">", '"', "`", " ", "\r", "\n", "	" ], unwise = [ "{", "}", "|", "\\", "^", "`" ].concat(delims), autoEscape = [ "'" ].concat(unwise), nonHostChars = [ "%", "/", "?", ";", "#" ].concat(autoEscape), hostEndingChars = [ "/", "?", "#" ], hostnameMaxLen = 255, hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/, hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, unsafeProtocol = {
                javascript: !0,
                "javascript:": !0
            }, hostlessProtocol = {
                javascript: !0,
                "javascript:": !0
            }, slashedProtocol = {
                http: !0,
                https: !0,
                ftp: !0,
                gopher: !0,
                file: !0,
                "http:": !0,
                "https:": !0,
                "ftp:": !0,
                "gopher:": !0,
                "file:": !0
            }, querystring = require("querystring");
            Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
                if (!util.isString(url)) throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
                var queryIndex = url.indexOf("?"), splitter = -1 !== queryIndex && queryIndex < url.indexOf("#") ? "?" : "#", uSplit = url.split(splitter), slashRegex = /\\/g;
                uSplit[0] = uSplit[0].replace(slashRegex, "/"), url = uSplit.join(splitter);
                var rest = url;
                if (rest = rest.trim(), !slashesDenoteHost && 1 === url.split("#").length) {
                    var simplePath = simplePathPattern.exec(rest);
                    if (simplePath) return this.path = rest, this.href = rest, this.pathname = simplePath[1], 
                    simplePath[2] ? (this.search = simplePath[2], this.query = parseQueryString ? querystring.parse(this.search.substr(1)) : this.search.substr(1)) : parseQueryString && (this.search = "", 
                    this.query = {}), this;
                }
                var proto = protocolPattern.exec(rest);
                if (proto) {
                    proto = proto[0];
                    var lowerProto = proto.toLowerCase();
                    this.protocol = lowerProto, rest = rest.substr(proto.length);
                }
                if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    var slashes = "//" === rest.substr(0, 2);
                    !slashes || proto && hostlessProtocol[proto] || (rest = rest.substr(2), this.slashes = !0);
                }
                if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
                    for (var hostEnd = -1, i = 0; i < hostEndingChars.length; i++) {
                        var hec = rest.indexOf(hostEndingChars[i]);
                        -1 !== hec && (-1 === hostEnd || hostEnd > hec) && (hostEnd = hec);
                    }
                    var auth, atSign;
                    atSign = -1 === hostEnd ? rest.lastIndexOf("@") : rest.lastIndexOf("@", hostEnd), 
                    -1 !== atSign && (auth = rest.slice(0, atSign), rest = rest.slice(atSign + 1), this.auth = decodeURIComponent(auth)), 
                    hostEnd = -1;
                    for (var i = 0; i < nonHostChars.length; i++) {
                        var hec = rest.indexOf(nonHostChars[i]);
                        -1 !== hec && (-1 === hostEnd || hostEnd > hec) && (hostEnd = hec);
                    }
                    -1 === hostEnd && (hostEnd = rest.length), this.host = rest.slice(0, hostEnd), rest = rest.slice(hostEnd), 
                    this.parseHost(), this.hostname = this.hostname || "";
                    var ipv6Hostname = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                    if (!ipv6Hostname) for (var hostparts = this.hostname.split(/\./), i = 0, l = hostparts.length; l > i; i++) {
                        var part = hostparts[i];
                        if (part && !part.match(hostnamePartPattern)) {
                            for (var newpart = "", j = 0, k = part.length; k > j; j++) newpart += part.charCodeAt(j) > 127 ? "x" : part[j];
                            if (!newpart.match(hostnamePartPattern)) {
                                var validParts = hostparts.slice(0, i), notHost = hostparts.slice(i + 1), bit = part.match(hostnamePartStart);
                                bit && (validParts.push(bit[1]), notHost.unshift(bit[2])), notHost.length && (rest = "/" + notHost.join(".") + rest), 
                                this.hostname = validParts.join(".");
                                break;
                            }
                        }
                    }
                    this.hostname = this.hostname.length > hostnameMaxLen ? "" : this.hostname.toLowerCase(), 
                    ipv6Hostname || (this.hostname = punycode.toASCII(this.hostname));
                    var p = this.port ? ":" + this.port : "", h = this.hostname || "";
                    this.host = h + p, this.href += this.host, ipv6Hostname && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), 
                    "/" !== rest[0] && (rest = "/" + rest));
                }
                if (!unsafeProtocol[lowerProto]) for (var i = 0, l = autoEscape.length; l > i; i++) {
                    var ae = autoEscape[i];
                    if (-1 !== rest.indexOf(ae)) {
                        var esc = encodeURIComponent(ae);
                        esc === ae && (esc = escape(ae)), rest = rest.split(ae).join(esc);
                    }
                }
                var hash = rest.indexOf("#");
                -1 !== hash && (this.hash = rest.substr(hash), rest = rest.slice(0, hash));
                var qm = rest.indexOf("?");
                if (-1 !== qm ? (this.search = rest.substr(qm), this.query = rest.substr(qm + 1), 
                parseQueryString && (this.query = querystring.parse(this.query)), rest = rest.slice(0, qm)) : parseQueryString && (this.search = "", 
                this.query = {}), rest && (this.pathname = rest), slashedProtocol[lowerProto] && this.hostname && !this.pathname && (this.pathname = "/"), 
                this.pathname || this.search) {
                    var p = this.pathname || "", s = this.search || "";
                    this.path = p + s;
                }
                return this.href = this.format(), this;
            }, Url.prototype.format = function() {
                var auth = this.auth || "";
                auth && (auth = encodeURIComponent(auth), auth = auth.replace(/%3A/i, ":"), auth += "@");
                var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = !1, query = "";
                this.host ? host = auth + this.host : this.hostname && (host = auth + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), 
                this.port && (host += ":" + this.port)), this.query && util.isObject(this.query) && Object.keys(this.query).length && (query = querystring.stringify(this.query));
                var search = this.search || query && "?" + query || "";
                return protocol && ":" !== protocol.substr(-1) && (protocol += ":"), this.slashes || (!protocol || slashedProtocol[protocol]) && host !== !1 ? (host = "//" + (host || ""), 
                pathname && "/" !== pathname.charAt(0) && (pathname = "/" + pathname)) : host || (host = ""), 
                hash && "#" !== hash.charAt(0) && (hash = "#" + hash), search && "?" !== search.charAt(0) && (search = "?" + search), 
                pathname = pathname.replace(/[?#]/g, function(match) {
                    return encodeURIComponent(match);
                }), search = search.replace("#", "%23"), protocol + host + pathname + search + hash;
            }, Url.prototype.resolve = function(relative) {
                return this.resolveObject(urlParse(relative, !1, !0)).format();
            }, Url.prototype.resolveObject = function(relative) {
                if (util.isString(relative)) {
                    var rel = new Url();
                    rel.parse(relative, !1, !0), relative = rel;
                }
                for (var result = new Url(), tkeys = Object.keys(this), tk = 0; tk < tkeys.length; tk++) {
                    var tkey = tkeys[tk];
                    result[tkey] = this[tkey];
                }
                if (result.hash = relative.hash, "" === relative.href) return result.href = result.format(), 
                result;
                if (relative.slashes && !relative.protocol) {
                    for (var rkeys = Object.keys(relative), rk = 0; rk < rkeys.length; rk++) {
                        var rkey = rkeys[rk];
                        "protocol" !== rkey && (result[rkey] = relative[rkey]);
                    }
                    return slashedProtocol[result.protocol] && result.hostname && !result.pathname && (result.path = result.pathname = "/"), 
                    result.href = result.format(), result;
                }
                if (relative.protocol && relative.protocol !== result.protocol) {
                    if (!slashedProtocol[relative.protocol]) {
                        for (var keys = Object.keys(relative), v = 0; v < keys.length; v++) {
                            var k = keys[v];
                            result[k] = relative[k];
                        }
                        return result.href = result.format(), result;
                    }
                    if (result.protocol = relative.protocol, relative.host || hostlessProtocol[relative.protocol]) result.pathname = relative.pathname; else {
                        for (var relPath = (relative.pathname || "").split("/"); relPath.length && !(relative.host = relPath.shift()); ) ;
                        relative.host || (relative.host = ""), relative.hostname || (relative.hostname = ""), 
                        "" !== relPath[0] && relPath.unshift(""), relPath.length < 2 && relPath.unshift(""), 
                        result.pathname = relPath.join("/");
                    }
                    if (result.search = relative.search, result.query = relative.query, result.host = relative.host || "", 
                    result.auth = relative.auth, result.hostname = relative.hostname || relative.host, 
                    result.port = relative.port, result.pathname || result.search) {
                        var p = result.pathname || "", s = result.search || "";
                        result.path = p + s;
                    }
                    return result.slashes = result.slashes || relative.slashes, result.href = result.format(), 
                    result;
                }
                var isSourceAbs = result.pathname && "/" === result.pathname.charAt(0), isRelAbs = relative.host || relative.pathname && "/" === relative.pathname.charAt(0), mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
                if (psychotic && (result.hostname = "", result.port = null, result.host && ("" === srcPath[0] ? srcPath[0] = result.host : srcPath.unshift(result.host)), 
                result.host = "", relative.protocol && (relative.hostname = null, relative.port = null, 
                relative.host && ("" === relPath[0] ? relPath[0] = relative.host : relPath.unshift(relative.host)), 
                relative.host = null), mustEndAbs = mustEndAbs && ("" === relPath[0] || "" === srcPath[0])), 
                isRelAbs) result.host = relative.host || "" === relative.host ? relative.host : result.host, 
                result.hostname = relative.hostname || "" === relative.hostname ? relative.hostname : result.hostname, 
                result.search = relative.search, result.query = relative.query, srcPath = relPath; else if (relPath.length) srcPath || (srcPath = []), 
                srcPath.pop(), srcPath = srcPath.concat(relPath), result.search = relative.search, 
                result.query = relative.query; else if (!util.isNullOrUndefined(relative.search)) {
                    if (psychotic) {
                        result.hostname = result.host = srcPath.shift();
                        var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : !1;
                        authInHost && (result.auth = authInHost.shift(), result.host = result.hostname = authInHost.shift());
                    }
                    return result.search = relative.search, result.query = relative.query, util.isNull(result.pathname) && util.isNull(result.search) || (result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "")), 
                    result.href = result.format(), result;
                }
                if (!srcPath.length) return result.pathname = null, result.path = result.search ? "/" + result.search : null, 
                result.href = result.format(), result;
                for (var last = srcPath.slice(-1)[0], hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && ("." === last || ".." === last) || "" === last, up = 0, i = srcPath.length; i >= 0; i--) last = srcPath[i], 
                "." === last ? srcPath.splice(i, 1) : ".." === last ? (srcPath.splice(i, 1), up++) : up && (srcPath.splice(i, 1), 
                up--);
                if (!mustEndAbs && !removeAllDots) for (;up--; up) srcPath.unshift("..");
                !mustEndAbs || "" === srcPath[0] || srcPath[0] && "/" === srcPath[0].charAt(0) || srcPath.unshift(""), 
                hasTrailingSlash && "/" !== srcPath.join("/").substr(-1) && srcPath.push("");
                var isAbsolute = "" === srcPath[0] || srcPath[0] && "/" === srcPath[0].charAt(0);
                if (psychotic) {
                    result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
                    var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : !1;
                    authInHost && (result.auth = authInHost.shift(), result.host = result.hostname = authInHost.shift());
                }
                return mustEndAbs = mustEndAbs || result.host && srcPath.length, mustEndAbs && !isAbsolute && srcPath.unshift(""), 
                srcPath.length ? result.pathname = srcPath.join("/") : (result.pathname = null, 
                result.path = null), util.isNull(result.pathname) && util.isNull(result.search) || (result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "")), 
                result.auth = relative.auth || result.auth, result.slashes = result.slashes || relative.slashes, 
                result.href = result.format(), result;
            }, Url.prototype.parseHost = function() {
                var host = this.host, port = portPattern.exec(host);
                port && (port = port[0], ":" !== port && (this.port = port.substr(1)), host = host.substr(0, host.length - port.length)), 
                host && (this.hostname = host);
            };
        };
    }), define("util", function(root) {
        return function(module, exports) {
            "use strict";
            function inspect(obj, opts) {
                var ctx = {
                    seen: [],
                    stylize: stylizeNoColor
                };
                return arguments.length >= 3 && (ctx.depth = arguments[2]), arguments.length >= 4 && (ctx.colors = arguments[3]), 
                isBoolean(opts) ? ctx.showHidden = opts : opts && exports._extend(ctx, opts), isUndefined(ctx.showHidden) && (ctx.showHidden = !1), 
                isUndefined(ctx.depth) && (ctx.depth = 2), isUndefined(ctx.colors) && (ctx.colors = !1), 
                isUndefined(ctx.customInspect) && (ctx.customInspect = !0), ctx.colors && (ctx.stylize = stylizeWithColor), 
                formatValue(ctx, obj, ctx.depth);
            }
            function stylizeWithColor(str, styleType) {
                var style = inspect.styles[styleType];
                return style ? "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m" : str;
            }
            function stylizeNoColor(str, styleType) {
                return str;
            }
            function arrayToHash(array) {
                var hash = {};
                return array.forEach(function(val, idx) {
                    hash[val] = !0;
                }), hash;
            }
            function formatValue(ctx, value, recurseTimes) {
                if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && (!value.constructor || value.constructor.prototype !== value)) {
                    var ret = value.inspect(recurseTimes, ctx);
                    return isString(ret) || (ret = formatValue(ctx, ret, recurseTimes)), ret;
                }
                var primitive = formatPrimitive(ctx, value);
                if (primitive) return primitive;
                var keys = Object.keys(value), visibleKeys = arrayToHash(keys);
                ctx.showHidden && (keys = Object.getOwnPropertyNames(value));
                var formatted, raw = value;
                try {
                    isDate(value) || (raw = value.valueOf());
                } catch (e) {}
                if (isString(raw) && (keys = keys.filter(function(key) {
                    return !(key >= 0 && key < raw.length);
                })), 0 === keys.length) {
                    if (isFunction(value)) {
                        var name = value.name ? ": " + value.name : "";
                        return ctx.stylize("[Function" + name + "]", "special");
                    }
                    if (isRegExp(value)) return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
                    if (isDate(value)) return ctx.stylize(Date.prototype.toString.call(value), "date");
                    if (isError(value)) return formatError(value);
                    if (isString(raw)) return formatted = formatPrimitiveNoColor(ctx, raw), ctx.stylize("[String: " + formatted + "]", "string");
                    if (isNumber(raw)) return formatted = formatPrimitiveNoColor(ctx, raw), ctx.stylize("[Number: " + formatted + "]", "number");
                    if (isBoolean(raw)) return formatted = formatPrimitiveNoColor(ctx, raw), ctx.stylize("[Boolean: " + formatted + "]", "boolean");
                }
                var base = "", array = !1, braces = [ "{", "}" ];
                if (isArray(value) && (array = !0, braces = [ "[", "]" ]), isFunction(value)) {
                    var n = value.name ? ": " + value.name : "";
                    base = " [Function" + n + "]";
                }
                if (isRegExp(value) && (base = " " + RegExp.prototype.toString.call(value)), isDate(value) && (base = " " + Date.prototype.toUTCString.call(value)), 
                isError(value) && (base = " " + formatError(value)), isString(raw) && (formatted = formatPrimitiveNoColor(ctx, raw), 
                base = " [String: " + formatted + "]"), isNumber(raw) && (formatted = formatPrimitiveNoColor(ctx, raw), 
                base = " [Number: " + formatted + "]"), isBoolean(raw) && (formatted = formatPrimitiveNoColor(ctx, raw), 
                base = " [Boolean: " + formatted + "]"), 0 === keys.length && (!array || 0 === value.length)) return braces[0] + base + braces[1];
                if (0 > recurseTimes) return isRegExp(value) ? ctx.stylize(RegExp.prototype.toString.call(value), "regexp") : ctx.stylize("[Object]", "special");
                ctx.seen.push(value);
                var output;
                return output = array ? formatArray(ctx, value, recurseTimes, visibleKeys, keys) : keys.map(function(key) {
                    return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                }), ctx.seen.pop(), reduceToSingleString(output, base, braces);
            }
            function formatPrimitive(ctx, value) {
                if (isUndefined(value)) return ctx.stylize("undefined", "undefined");
                if (isString(value)) {
                    var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                    return ctx.stylize(simple, "string");
                }
                return isNumber(value) ? 0 === value && 0 > 1 / value ? ctx.stylize("-0", "number") : ctx.stylize("" + value, "number") : isBoolean(value) ? ctx.stylize("" + value, "boolean") : isNull(value) ? ctx.stylize("null", "null") : isSymbol(value) ? ctx.stylize(value.toString(), "symbol") : void 0;
            }
            function formatPrimitiveNoColor(ctx, value) {
                var stylize = ctx.stylize;
                ctx.stylize = stylizeNoColor;
                var str = formatPrimitive(ctx, value);
                return ctx.stylize = stylize, str;
            }
            function formatError(value) {
                return "[" + Error.prototype.toString.call(value) + "]";
            }
            function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                for (var output = [], i = 0, l = value.length; l > i; ++i) output.push(hasOwnProperty(value, String(i)) ? formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), !0) : "");
                return keys.forEach(function(key) {
                    key.match(/^\d+$/) || output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, !0));
                }), output;
            }
            function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                var name, str, desc;
                if (desc = Object.getOwnPropertyDescriptor(value, key) || {
                    value: value[key]
                }, desc.get ? str = desc.set ? ctx.stylize("[Getter/Setter]", "special") : ctx.stylize("[Getter]", "special") : desc.set && (str = ctx.stylize("[Setter]", "special")), 
                hasOwnProperty(visibleKeys, key) || (name = "[" + key + "]"), str || (ctx.seen.indexOf(desc.value) < 0 ? (str = isNull(recurseTimes) ? formatValue(ctx, desc.value, null) : formatValue(ctx, desc.value, recurseTimes - 1), 
                str.indexOf("\n") > -1 && (str = array ? str.split("\n").map(function(line) {
                    return "  " + line;
                }).join("\n").substr(2) : "\n" + str.split("\n").map(function(line) {
                    return "   " + line;
                }).join("\n"))) : str = ctx.stylize("[Circular]", "special")), isUndefined(name)) {
                    if (array && key.match(/^\d+$/)) return str;
                    name = JSON.stringify("" + key), name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (name = name.substr(1, name.length - 2), 
                    name = ctx.stylize(name, "name")) : (name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'").replace(/\\\\/g, "\\"), 
                    name = ctx.stylize(name, "string"));
                }
                return name + ": " + str;
            }
            function reduceToSingleString(output, base, braces) {
                var length = output.reduce(function(prev, cur) {
                    return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
                }, 0);
                return length > 60 ? braces[0] + ("" === base ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1] : braces[0] + base + " " + output.join(", ") + " " + braces[1];
            }
            function isBoolean(arg) {
                return "boolean" == typeof arg;
            }
            function isNull(arg) {
                return null === arg;
            }
            function isNullOrUndefined(arg) {
                return null == arg;
            }
            function isNumber(arg) {
                return "number" == typeof arg;
            }
            function isString(arg) {
                return "string" == typeof arg;
            }
            function isSymbol(arg) {
                return "symbol" == typeof arg;
            }
            function isUndefined(arg) {
                return void 0 === arg;
            }
            function isRegExp(re) {
                return isObject(re) && "[object RegExp]" === objectToString(re);
            }
            function isObject(arg) {
                return "object" == typeof arg && null !== arg;
            }
            function isDate(d) {
                return isObject(d) && "[object Date]" === objectToString(d);
            }
            function isError(e) {
                return isObject(e) && ("[object Error]" === objectToString(e) || e instanceof Error);
            }
            function isFunction(arg) {
                return "function" == typeof arg;
            }
            function isPrimitive(arg) {
                return null === arg || "boolean" == typeof arg || "number" == typeof arg || "string" == typeof arg || "symbol" == typeof arg || "undefined" == typeof arg;
            }
            function isBuffer(arg) {
                return arg instanceof Buffer;
            }
            function objectToString(o) {
                return Object.prototype.toString.call(o);
            }
            function pad(n) {
                return 10 > n ? "0" + n.toString(10) : n.toString(10);
            }
            function timestamp() {
                var d = new Date(), time = [ pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds()) ].join(":");
                return [ d.getDate(), months[d.getMonth()], time ].join(" ");
            }
            function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }
            var formatRegExp = /%[sdj%]/g;
            exports.format = function(f) {
                if (!isString(f)) {
                    for (var objects = [], i = 0; i < arguments.length; i++) objects.push(inspect(arguments[i]));
                    return objects.join(" ");
                }
                for (var i = 1, args = arguments, len = args.length, str = String(f).replace(formatRegExp, function(x) {
                    if ("%%" === x) return "%";
                    if (i >= len) return x;
                    switch (x) {
                      case "%s":
                        return String(args[i++]);

                      case "%d":
                        return Number(args[i++]);

                      case "%j":
                        try {
                            return JSON.stringify(args[i++]);
                        } catch (_) {
                            return "[Circular]";
                        }

                      default:
                        return x;
                    }
                }), x = args[i]; len > i; x = args[++i]) str += isNull(x) || !isObject(x) ? " " + x : " " + inspect(x);
                return str;
            }, exports.deprecate = function(fn, msg) {
                function deprecated() {
                    if (!warned) {
                        if (process.throwDeprecation) throw new Error(msg);
                        process.traceDeprecation ? console.trace(msg) : console.error(msg), warned = !0;
                    }
                    return fn.apply(this, arguments);
                }
                if (isUndefined(global.process)) return function() {
                    return exports.deprecate(fn, msg).apply(this, arguments);
                };
                if (process.noDeprecation === !0) return fn;
                var warned = !1;
                return deprecated;
            };
            var debugEnviron, debugs = {};
            exports.debuglog = function(set) {
                if (isUndefined(debugEnviron) && (debugEnviron = process.env.NODE_DEBUG || ""), 
                set = set.toUpperCase(), !debugs[set]) if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
                    var pid = process.pid;
                    debugs[set] = function() {
                        var msg = exports.format.apply(exports, arguments);
                        console.error("%s %d: %s", set, pid, msg);
                    };
                } else debugs[set] = function() {};
                return debugs[set];
            }, exports.inspect = inspect, inspect.colors = {
                bold: [ 1, 22 ],
                italic: [ 3, 23 ],
                underline: [ 4, 24 ],
                inverse: [ 7, 27 ],
                white: [ 37, 39 ],
                grey: [ 90, 39 ],
                black: [ 30, 39 ],
                blue: [ 34, 39 ],
                cyan: [ 36, 39 ],
                green: [ 32, 39 ],
                magenta: [ 35, 39 ],
                red: [ 31, 39 ],
                yellow: [ 33, 39 ]
            }, inspect.styles = {
                special: "cyan",
                number: "yellow",
                "boolean": "yellow",
                undefined: "grey",
                "null": "bold",
                string: "green",
                symbol: "green",
                date: "magenta",
                regexp: "red"
            };
            var isArray = exports.isArray = Array.isArray;
            exports.isBoolean = isBoolean, exports.isNull = isNull, exports.isNullOrUndefined = isNullOrUndefined, 
            exports.isNumber = isNumber, exports.isString = isString, exports.isSymbol = isSymbol, 
            exports.isUndefined = isUndefined, exports.isRegExp = isRegExp, exports.isObject = isObject, 
            exports.isDate = isDate, exports.isError = isError, exports.isFunction = isFunction, 
            exports.isPrimitive = isPrimitive, exports.isBuffer = isBuffer;
            var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
            exports.log = function() {
                console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
            }, exports.inherits = function(ctor, superCtor) {
                ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
                    constructor: {
                        value: ctor,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                });
            }, exports._extend = function(origin, add) {
                if (!add || !isObject(add)) return origin;
                for (var keys = Object.keys(add), i = keys.length; i--; ) origin[keys[i]] = add[keys[i]];
                return origin;
            }, exports.p = exports.deprecate(function() {
                for (var i = 0, len = arguments.length; len > i; ++i) console.error(exports.inspect(arguments[i]));
            }, "util.p: Use console.error() instead"), exports.print = exports.deprecate(function() {
                for (var i = 0, len = arguments.length; len > i; ++i) process.stdout.write(String(arguments[i]));
            }, "util.print: Use console.log instead"), exports.puts = exports.deprecate(function() {
                for (var i = 0, len = arguments.length; len > i; ++i) process.stdout.write(arguments[i] + "\n");
            }, "util.puts: Use console.log instead"), exports.debug = exports.deprecate(function(x) {
                process.stderr.write("DEBUG: " + x + "\n");
            }, "util.debug: Use console.error instead"), exports.error = exports.deprecate(function(x) {
                for (var i = 0, len = arguments.length; len > i; ++i) process.stderr.write(arguments[i] + "\n");
            }, "util.error: Use console.error instead"), exports.pump = exports.deprecate(function(readStream, writeStream, callback) {
                function call(a, b, c) {
                    callback && !callbackCalled && (callback(a, b, c), callbackCalled = !0);
                }
                var callbackCalled = !1;
                readStream.addListener("data", function(chunk) {
                    writeStream.write(chunk) === !1 && readStream.pause();
                }), writeStream.addListener("drain", function() {
                    readStream.resume();
                }), readStream.addListener("end", function() {
                    writeStream.end();
                }), readStream.addListener("close", function() {
                    call();
                }), readStream.addListener("error", function(err) {
                    writeStream.end(), call(err);
                }), writeStream.addListener("error", function(err) {
                    readStream.destroy(), call(err);
                });
            }, "util.pump(): Use readableStream.pipe() instead");
            var uv;
            exports._errnoException = function(err, syscall, original) {
                isUndefined(uv) && (uv = process.binding("uv"));
                var errname = uv.errname(err), message = syscall + " " + errname;
                original && (message += " " + original);
                var e = new Error(message);
                return e.code = errname, e.errno = errname, e.syscall = syscall, e;
            };
        };
    }), init();
}(this);