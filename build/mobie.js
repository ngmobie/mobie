(function (document, window, angular, undefined) { 'use strict';angular.module("mobie.components", [ "mobie.components.animation", "mobie.components.sidenav", "mobie.components.backdrop", "mobie.components.popup", "mobie.components.modal", "mobie.components.bar", "mobie.components.icon" ]), 
angular.module("mobie", [ "mobie.core", "mobie.components" ]), angular.module("mobie.core", [ "mobie.core.helpers", "mobie.core.registry", "mobie.core.eventemitter", "mobie.core.scroll", "mobie.core.component" ]);
function AnimationDirective() {
    return function(scope, element, attrs) {
        function resolveClassName(newClassName) {
            previousClass = "";
            var classes = newClassName.split(/\ /), classesLength = classes.length;
            angular.forEach(classes, function(className, i) {
                previousClass += "mb-" + className, classesLength > i && (previousClass += " ");
            });
        }
        function removeClass(className) {
            element.hasClass(className) && element.removeClass(className);
        }
        function addClass(className) {
            element.addClass(className);
        }
        var previousClass;
        attrs.$observe("mbAnimation", function(mbAnimation) {
            angular.isString(previousClass) && removeClass(previousClass), resolveClassName(mbAnimation), 
            addClass(previousClass);
        });
    };
}

angular.module("mobie.components.animation", []).directive("mbAnimationDuration", function() {
    return function(scope, element, attrs) {
        function setAnimationDuration(ms) {
            angular.isUndefined(ms) || "" === ms || (ms += "ms"), element.css("-webkit-animation-duration", ms), 
            element.css("-moz-animation-duration", ms), element.css("animation-duration", ms);
        }
        attrs.$observe("mbAnimationDuration", function(ms) {
            return angular.isUndefined(ms) ? setAnimationDuration(void 0) : void setAnimationDuration(ms);
        });
    };
}).directive("mbAnimation", AnimationDirective);
function BackdropFactory($animate, MbComponent) {
    var bodyEl = angular.element(document.body), el = angular.element("<div>");
    el.addClass("backdrop mb-backdrop"), $animate.enter(el, bodyEl);
    var $mbBackdrop = new MbComponent(el, "default-backdrop");
    return $mbBackdrop;
}

BackdropFactory.$inject = [ "$animate", "MbComponent" ], angular.module("mobie.components.backdrop", [ "mobie.core.component" ]).factory("$mbBackdrop", BackdropFactory);
function BarFixedTopDirective($mbScroll, $animate, $timeout, MbComponent, Helpers) {
    function postLink(scope, element, attrs) {
        function cancelTimeout() {
            return $timeout.cancel(animationPromise);
        }
        function setVisibleState(visibleState) {
            return Helpers.safeDigest(scope, function() {
                cancelTimeout(), animationPromise = $timeout(ms).then(function() {
                    return component[visibleState ? "show" : "hide"]();
                });
            });
        }
        var animationPromise, ms = 60, component = new MbComponent(element), visibleState = !0;
        $mbScroll.on("scrollTop", function() {
            setVisibleState(!0);
        }), $mbScroll.on("scrollDown", function(evt) {
            setVisibleState(!1);
        }), $mbScroll.on("scrollUp", function(evt) {
            setVisibleState(!0);
        }), setVisibleState(visibleState);
    }
    return {
        restrict: "A",
        compile: function(element, attrs) {
            return element.addClass("mb-fixed-top"), postLink;
        }
    };
}

BarFixedTopDirective.$inject = [ "$mbScroll", "$animate", "$timeout", "MbComponent", "Helpers" ], 
angular.module("mobie.components.bar", [ "mobie.core.scroll" ]).directive("mbBarFixedTop", BarFixedTopDirective);
angular.module("mobie.components.icon", []).directive("mbIcon", function() {
    return {
        restrict: "EA",
        scope: {
            name: "@"
        },
        template: '<span ng-class="classes" ng-show="hasIconName"></span>',
        controller: [ "$scope", "$attrs", function($scope, $attrs) {
            $scope.classes = {
                fa: !0
            }, $attrs.$observe("name", function(iconName) {
                $scope.hasIconName = iconName ? $scope.classes["fa-" + iconName] = !0 : !1;
            });
        } ]
    };
});
function $MbModalProvider() {
    function $MbModalFactory($mbComponent, $animate, $mbBackdrop, Helpers, $timeout) {
        var bodyEl = angular.element(document.body);
        return function(options) {
            options = angular.extend({}, defaults, options);
            var $mbModal = $mbComponent(options), scope = options.scope, component = $mbModal.component;
            return component.on("visibleChangeStart", function() {
                $mbBackdrop.show(), $animate.addClass(bodyEl, options.activeBodyClass);
            }), component.on("notVisible", function() {
                Helpers.safeDigest(scope, function() {
                    $timeout(function() {
                        $mbBackdrop.hide();
                    }, 250), $animate.removeClass(bodyEl, options.activeBodyClass);
                });
            }), $mbModal;
        };
    }
    var defaults = this.defaults = {
        templateUrl: "components/modal/modal.html",
        activeBodyClass: "mb-modal-visible"
    };
    $MbModalFactory.$inject = [ "$mbComponent", "$animate", "$mbBackdrop", "Helpers", "$timeout" ], 
    this.$get = $MbModalFactory;
}

angular.module("mobie.components.modal", [ "mobie.core.component", "mobie.core.helpers", "mobie.components.backdrop" ]).provider("$mbModal", $MbModalProvider);
function $MbPopupProvider() {
    function $MbPopupFactory($mbComponent, Helpers, $rootScope, $mbBackdrop, $animate, $q, $timeout) {
        function defaultOnTapFn() {
            return asyncDigest().then(function() {
                return $mbPopup.hide();
            });
        }
        function safeDigest(fn) {
            Helpers.safeDigest(scope, fn);
        }
        function asyncDigest() {
            return $q(function(resolve) {
                safeDigest(function(scope) {
                    resolve(scope);
                });
            });
        }
        function unbindEvents() {
            return asyncDigest().then(function() {
                el.off("click", defaultOnTapFn);
            });
        }
        function bindEvents() {
            return asyncDigest().then(function() {
                el.on("click", defaultOnTapFn);
            });
        }
        function setActiveBodyClass(isActive) {
            return asyncDigest().then(function() {
                return $animate[isActive ? "addClass" : "removeClass"](bodyEl, options.activeBodyClass);
            });
        }
        function setBackdrop(isActive) {
            return asyncDigest().then(function() {
                return $mbBackdrop[isActive ? "show" : "hide"]();
            });
        }
        function getVisibleState() {
            return component.getVisibleState();
        }
        function setComponent(isActive) {
            return asyncDigest().then(function() {
                return component[isActive ? "show" : "hide"]();
            });
        }
        function hide(notTouchBackdrop) {
            return $q.all([ setComponent(!1), setBackdrop(notTouchBackdrop), setActiveBodyClass(!1) ]).then(function() {
                return unbindEvents();
            });
        }
        function scopeReset() {
            scopeExtend({
                text: "",
                title: "",
                template: "",
                buttons: []
            });
        }
        function scopeExtend(options) {
            safeDigest(function(scope) {
                angular.extend(scope, options);
            });
        }
        function show(options) {
            return getVisibleState() ? hide(!0).then(function() {
                return show(options);
            }) : (scopeReset(), scopeExtend(options), angular.forEach(scope.buttons, function(btn, i) {
                angular.isFunction(btn.onTap) || (scope.buttons[i].onTap = defaultOnTapFn);
            }), $q.all([ setComponent(!0), setBackdrop(!0), setActiveBodyClass(!0) ]).then(function() {
                return bindEvents();
            }));
        }
        var $mbPopup = {}, options = {
            scope: $rootScope.$new()
        };
        options = angular.extend({}, defaults, options);
        var mbComponent = $mbPopup.component = $mbComponent(options), component = mbComponent.component, el = component.getElement(), scope = options.scope;
        return $mbPopup.show = show, $mbPopup.hide = hide, $mbPopup;
    }
    this.$get = $MbPopupFactory;
    var defaults = this.defaults = {
        templateUrl: "components/popup/popup.html",
        activeBodyClass: "mb-popup-visible"
    };
    $MbPopupFactory.$inject = [ "$mbComponent", "Helpers", "$rootScope", "$mbBackdrop", "$animate", "$q", "$timeout" ];
}

var bodyEl = angular.element(document.body);

angular.module("mobie.components.popup", [ "mobie.core.helpers", "mobie.core.component", "mobie.components.backdrop" ]).provider("$mbPopup", $MbPopupProvider);
function $MbSidenavController($scope, $element, $attrs, $transclude, $animate, Helpers, MbComponent, $mbComponentRegistry, $mbBackdrop, $mbSidenav, $window) {
    function digest(fn) {
        return Helpers.safeDigest($scope, fn);
    }
    function setVisibleState(visibleState) {
        digest(function() {
            $mbBackdrop[visibleState ? "show" : "hide"](), angular.isString(activeBodyClass) && $animate[visibleState ? "addClass" : "removeClass"](bodyEl, activeBodyClass);
        });
    }
    function onClickListener(evt) {
        digest(function() {
            component.hide();
        });
    }
    var bodyEl = angular.element($window.document.body), backdropEl = $mbBackdrop.getElement(), sidenavOptions = $mbSidenav.getOptions(), activeBodyClass = sidenavOptions.activeBodyClass, component = this.component = new MbComponent($element, {
        id: $attrs.componentId
    });
    $mbComponentRegistry.register(this.component), component.on("visibleChangeStart", function() {
        setVisibleState(!0);
    }), component.on("visible", function() {
        backdropEl.on("click", onClickListener);
    }), component.on("notVisible", function() {
        backdropEl.off("click", onClickListener), setVisibleState(!1);
    });
}

function CloseDirective() {
    return {
        require: "?^mbSidenav",
        link: function(scope, element, attrs, mbSidenav) {
            angular.isUndefined(mbSidenav) || element.on("click", function() {
                scope.$apply(function() {
                    mbSidenav.component.hide();
                });
            });
        }
    };
}

function $MbSidenavProvider() {
    function $MbSidenavFactory($mbComponentRegistry) {
        return angular.extend(function(componentId) {
            return $mbComponentRegistry.get(componentId);
        }, {
            getOptions: function() {
                return defaults;
            }
        });
    }
    var defaults = this.defaults = {
        activeBodyClass: "mb-sidenav-visible"
    };
    $MbSidenavFactory.$inject = [ "$mbComponentRegistry" ], this.$get = $MbSidenavFactory;
}

function SidenavDirective() {
    return {
        restrict: "EA",
        scope: {},
        controller: "$mbSidenavController",
        controllerAs: "mbSidenavCtrl"
    };
}

$MbSidenavController.$inject = [ "$scope", "$element", "$attrs", "$transclude", "$animate", "Helpers", "MbComponent", "$mbComponentRegistry", "$mbBackdrop", "$mbSidenav", "$window" ], 
angular.module("mobie.components.sidenav", [ "mobie.components.animation", "mobie.components.backdrop", "mobie.core.registry", "mobie.core.component", "mobie.core.helpers" ]).directive("mbClose", CloseDirective).controller("$mbSidenavController", $MbSidenavController).provider("$mbSidenav", $MbSidenavProvider).directive("mbSidenav", SidenavDirective);
function MbComponentFactory(MbComponentInterface, $animate) {
    var MbComponent = MbComponentInterface.extend({
        initialize: function(componentEl, id, options) {
            this.isVisible = !1, angular.isObject(id) && (options = id, id = void 0, angular.extend(this, options)), 
            angular.isDefined(componentEl) && this.setElement(componentEl), angular.isDefined(id) && this.setId(id), 
            this.on("visibleStateChangeSuccess", function() {
                this.emit(this.getVisibleState() ? "visible" : "notVisible");
            }), this.on("visibleStateChangeStart", function(visibleState) {
                this.emit(visibleState ? "visibleChangeStart" : "notVisibleChangeStart");
            });
        },
        show: function() {
            return this.setVisibleState(!0);
        },
        hide: function() {
            return this.setVisibleState(!1);
        },
        toggle: function() {
            return this.setVisibleState(!this.getVisibleState());
        },
        getHiddenClass: function() {
            return "mb-hidden";
        },
        getVisibleClass: function() {
            return "mb-visible";
        },
        getVisibleState: function() {
            return !!this.isVisible;
        },
        setVisibleState: function(visibleState) {
            var addClass, removeClass, self = this, el = this.getElement(), hiddenClass = this.getHiddenClass(), visibleClass = this.getVisibleClass();
            return this.emit("visibleStateChangeStart", visibleState), addClass = visibleState ? visibleClass : hiddenClass, 
            removeClass = visibleState ? hiddenClass : visibleClass, $animate.setClass(el, addClass, removeClass).then(function() {
                self.isVisible = visibleState, self.emit("visibleStateChangeSuccess");
            }, function(err) {
                self.emit("visibleStateChangeError", err);
            });
        },
        setId: function(id) {
            if (angular.isDefined(this.getId())) throw new Error("You cannot change a component.id more than once");
            return Object.defineProperty(this, "id", {
                value: id,
                writable: !1
            }), this;
        },
        getId: function() {
            return this.id;
        },
        setElement: function(componentEl) {
            var el = this.componentEl = componentEl, isVisible = this.getVisibleState(), hiddenClass = this.getHiddenClass();
            return el.hasClass(hiddenClass) || isVisible || el.addClass(hiddenClass), this;
        },
        getElement: function() {
            return this.componentEl;
        },
        enterElement: function(parent, after) {
            var self = this;
            return angular.isUndefined(parent) && (parent = angular.element(document.body)), 
            this.emit("enterElementStart"), $animate.enter(this.getElement(), parent, after).then(function() {
                self.emit("enterElementSuccess");
            });
        },
        removeElement: function() {
            return this.getElement().remove(), this.componentEl = void 0, this;
        },
        leaveElement: function() {
            var self = this;
            return this.emit("leaveElementStart"), $animate.leave(this.getElement()).then(function() {
                self.emit("leaveElementSuccess");
            });
        },
        destroy: function() {
            this.removeElement();
        }
    });
    return MbComponent;
}

function MbComponentInterface(Helpers) {
    return Helpers.createClass({
        show: Helpers.notImplemented("show"),
        hide: Helpers.notImplemented("hide"),
        toggle: Helpers.notImplemented("toggle"),
        setElement: Helpers.notImplemented("setElement"),
        getElement: Helpers.notImplemented("getElement"),
        setId: Helpers.notImplemented("setId"),
        getId: Helpers.notImplemented("getId"),
        destroy: Helpers.notImplemented("destroy"),
        getVisibleState: Helpers.notImplemented("getVisibleState"),
        setVisibleState: Helpers.notImplemented("setVisibleState")
    });
}

function $MbComponentProvider() {
    function $MbComponentFactory(MbComponent, $compile, $templateCache, $animate, $rootScope) {
        var bodyEl = angular.element(document.body);
        return function(options) {
            var el, template, $mbComponent = {};
            angular.isString(options) && (template = options, options = {}, options.template = template), 
            $mbComponent.options = options = angular.extend({}, defaults, options), angular.isUndefined(options.scope) && (options.scope = $rootScope.$new());
            var scope = options.scope = $mbComponent.scope = options.scope.$new(), component = options.component = $mbComponent.component = new MbComponent();
            if (scope.$on("$destroy", function() {
                component.destroy(), el = void 0;
            }), angular.forEach([ "show", "hide", "toggle" ], function(key) {
                $mbComponent[key] = function() {
                    return component[key]();
                };
            }), angular.isUndefined(options.template) && angular.isDefined(options.templateUrl) && (template = options.template = $templateCache.get(options.templateUrl)), 
            angular.isUndefined(options.template)) throw new Error("template must have something");
            el = options.el = $mbComponent.element = angular.element(options.template);
            var componentLink = $mbComponent.componentLink = $compile(el);
            return component.once("visibleChangeStart", function() {
                componentLink(scope);
            }), $animate.enter(el, bodyEl).then(function() {
                component.emit("enter");
            }), component.setElement(el), $mbComponent;
        };
    }
    var defaults = this.defaults = {};
    $MbComponentFactory.$inject = [ "MbComponent", "$compile", "$templateCache", "$animate", "$rootScope" ], 
    this.$get = $MbComponentFactory;
}

MbComponentFactory.$inject = [ "MbComponentInterface", "$animate" ], MbComponentInterface.$inject = [ "Helpers" ], 
angular.module("mobie.core.component", [ "mobie.core.helpers", "mobie.components.animation" ]).factory("MbComponentInterface", MbComponentInterface).factory("MbComponent", MbComponentFactory).provider("$mbComponent", $MbComponentProvider);
function EventEmitter() {
    EventEmitter.init.call(this);
}

function EventEmitterFactory() {
    return EventEmitter;
}

EventEmitter.EventEmitter = EventEmitter, EventEmitter.usingDomains = !1, EventEmitter.prototype.domain = void 0, 
EventEmitter.prototype._events = void 0, EventEmitter.prototype._maxListeners = void 0, 
EventEmitter.defaultMaxListeners = 10, EventEmitter.init = function() {
    this.domain = null, EventEmitter.usingDomains && (domain = domain || require("domain"), 
    !domain.active || this instanceof domain.Domain || (this.domain = domain.active)), 
    this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = {}), 
    this._maxListeners = this._maxListeners || void 0;
}, EventEmitter.prototype.setMaxListeners = function(n) {
    if (!utilangularisNumber(n) || 0 > n || isNaN(n)) throw new TypeError("n must be a positive number");
    return this._maxListeners = n, this;
}, EventEmitter.prototype.emit = function(type) {
    var er, handler, len, args, i, listeners;
    if (this._events || (this._events = {}), "error" === type && !this._events.error) {
        if (er = arguments[1], !this.domain) throw er instanceof Error ? er : Error('Uncaught, unspecified "error" event.');
        return er || (er = new Error('Uncaught, unspecified "error" event.')), er.domainEmitter = this, 
        er.domain = this.domain, er.domainThrown = !1, this.domain.emit("error", er), !1;
    }
    if (handler = this._events[type], angular.isUndefined(handler)) return !1;
    if (this.domain && this !== process && this.domain.enter(), angular.isFunction(handler)) switch (arguments.length) {
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
    } else if (angular.isObject(handler)) {
        for (len = arguments.length, args = new Array(len - 1), i = 1; len > i; i++) args[i - 1] = arguments[i];
        for (listeners = handler.slice(), len = listeners.length, i = 0; len > i; i++) listeners[i].apply(this, args);
    }
    return this.domain && this !== process && this.domain.exit(), !0;
}, EventEmitter.prototype.addListener = function(type, listener) {
    var m;
    if (!angular.isFunction(listener)) throw new TypeError("listener must be a function");
    if (this._events || (this._events = {}), this._events.newListener && this.emit("newListener", type, angular.isFunction(listener.listener) ? listener.listener : listener), 
    this._events[type] ? angular.isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener, 
    angular.isObject(this._events[type]) && !this._events[type].warned) {
        var m;
        m = angular.isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners, 
        m && m > 0 && this._events[type].length > m && (this._events[type].warned = !0, 
        console.error("(node) warning: possible EventEmitter memory leak detected. %d %s listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length, type), 
        console.trace());
    }
    return this;
}, EventEmitter.prototype.on = EventEmitter.prototype.addListener, EventEmitter.prototype.once = function(type, listener) {
    function g() {
        this.removeListener(type, g), fired || (fired = !0, listener.apply(this, arguments));
    }
    if (!angular.isFunction(listener)) throw new TypeError("listener must be a function");
    var fired = !1;
    return g.listener = listener, this.on(type, g), this;
}, EventEmitter.prototype.removeListener = function(type, listener) {
    var list, position, length, i;
    if (!angular.isFunction(listener)) throw new TypeError("listener must be a function");
    if (!this._events || !this._events[type]) return this;
    if (list = this._events[type], length = list.length, position = -1, list === listener || angular.isFunction(list.listener) && list.listener === listener) delete this._events[type], 
    this._events.removeListener && this.emit("removeListener", type, listener); else if (angular.isObject(list)) {
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
    if (listeners = this._events[type], angular.isFunction(listeners)) this.removeListener(type, listeners); else if (Array.isArray(listeners)) for (;listeners.length; ) this.removeListener(type, listeners[listeners.length - 1]);
    return delete this._events[type], this;
}, EventEmitter.prototype.listeners = function(type) {
    var ret;
    return ret = this._events && this._events[type] ? angular.isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
}, EventEmitter.listenerCount = function(emitter, type) {
    var ret;
    return ret = emitter._events && emitter._events[type] ? angular.isFunction(emitter._events[type]) ? 1 : emitter._events[type].length : 0;
}, angular.module("mobie.core.eventemitter", []).factory("EventEmitter", EventEmitterFactory);
function extend(protoProps, staticProps) {
    var child, parent = this;
    child = protoProps && angular.hasOwnProperty(protoProps, "constructor") ? protoProps.constructor : function() {
        return parent.apply(this, arguments);
    }, angular.extend(child, parent, staticProps);
    var Surrogate = function() {
        this.constructor = child;
    };
    return Surrogate.prototype = parent.prototype, child.prototype = new Surrogate(), 
    protoProps && angular.extend(child.prototype, protoProps), child.__super__ = parent.prototype, 
    child;
}

function inherits(ctor, superCtor) {
    ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    });
}

function DefaultClass() {
    angular.isFunction(this.initialize) && this.initialize.apply(this, arguments);
}

function createClass(protoProps, staticProps) {
    return DefaultClass.extend(protoProps, staticProps);
}

function HelpersFactory($rootScope, $q, EventEmitter) {
    function notImplemented(methodName) {
        return $q.reject(new Error("The method " + methodName + " is not implemented"));
    }
    function safeDigest(scope, fn) {
        angular.isFunction(scope) && (fn = scope, scope = $rootScope), angular.isUndefined(fn) && (fn = function() {}), 
        scope.$$phase || scope.$root && scope.$root.$$phase ? fn(scope) : scope.$apply(fn);
    }
    function nextId() {
        return id++, id;
    }
    var Helpers = {};
    DefaultClass.extend = extend, inherits(DefaultClass, EventEmitter), Helpers.createClass = createClass, 
    Helpers.notImplemented = notImplemented, Helpers.safeDigest = safeDigest;
    var id = 0;
    return Helpers.nextId = nextId, Helpers;
}

function UtilFactory() {
    var Util = {};
    return Util.inherits = inherits, Util;
}

HelpersFactory.$inject = [ "$rootScope", "$q", "EventEmitter" ], angular.module("mobie.core.helpers", [ "mobie.core.eventemitter" ]).factory("Helpers", HelpersFactory).factory("Util", UtilFactory);
angular.module("mobie.core.registry", [ "mobie.core.helpers" ]).factory("$mbComponentRegistry", function() {
    var components = [], $mbComponentRegistry = {
        get: function(componentId) {
            var component;
            if (angular.forEach(components, function(_component_) {
                _component_.id === componentId && (component = _component_);
            }), angular.isUndefined(component)) throw new Error('component "' + componentId + '" is not defined');
            return component;
        },
        register: function(component, componentId) {
            function deregister() {
                var index = components.indexOf(component);
                -1 !== index && components.splice(index, 1);
            }
            if (angular.isUndefined(component.id) && angular.isUndefined(componentId)) throw new Error("component must have a id key or you must specify one for this instance");
            return angular.isUndefined(component.id) && (component.id = componentId), components.push(component), 
            deregister;
        }
    };
    return $mbComponentRegistry;
});
function $MbScrollProvider() {
    function $MbScrollFactory($window, $timeout, Helpers) {
        var windowEl = angular.element($window), MbScroll = (windowEl[0].document.body, 
        Helpers.createClass({
            scrollStoppedFn: function(evt) {
                this.emit("scrollStop", evt);
            },
            initialize: function() {
                var self = this;
                windowEl.on("scroll", function(evt) {
                    self.emit("scroll", evt);
                }), this.on("scroll", this.onScroll), this.on("scrollStop", this.onScrollStop), 
                Object.defineProperty(this, "scrollY", {
                    get: function() {
                        return this.getScrollY();
                    }
                });
            },
            getLastScrollY: function() {
                return this.lastScrollY;
            },
            setLastScrollY: function(lastScrollY) {
                this.lastScrollY = lastScrollY;
            },
            getScrollY: function() {
                return windowEl.prop("scrollY");
            },
            onScrollStop: function() {
                this.setLastScrollY(this.getScrollY());
            },
            onScroll: function(evt) {
                var currentScrollY = window.scrollY, self = this;
                $timeout.cancel(this.scrollStoppedPromise), 0 === currentScrollY && this.emit("scrollTop", evt), 
                currentScrollY > this.lastScrollY ? this.emit("scrollDown", evt) : this.emit("scrollUp", evt), 
                this.scrollStoppedPromise = $timeout(defaults.scrollStoppedMs).then(function() {
                    self.scrollStoppedFn(evt);
                });
            }
        }));
        return new MbScroll();
    }
    this.$get = $MbScrollFactory;
    var defaults = this.defaults = {
        scrollStoppedMs: 100
    };
    $MbScrollFactory.$inject = [ "$window", "$timeout", "Helpers" ];
}

angular.module("mobie.core.scroll", [ "mobie.core.helpers" ]).provider("$mbScroll", $MbScrollProvider);}(document, window, angular, undefined))