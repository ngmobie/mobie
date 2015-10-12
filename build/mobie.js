(function (document, window, angular, undefined) { 'use strict';angular.module("mobie.components", [ "mobie.components.animation", "mobie.components.sidenav", "mobie.components.backdrop", "mobie.components.popup", "mobie.components.modal", "mobie.components.bar", "mobie.components.icon", "mobie.components.action-sheet", "mobie.components.spinner" ]), 
angular.module("mobie", [ "mobie.core", "mobie.components" ]), angular.module("mobie.core", [ "mobie.core.helpers", "mobie.core.registry", "mobie.core.eventemitter", "mobie.core.scroll", "mobie.core.component" ]);
function $MbActionSheetProvider() {
    function $MbActionSheetFactory(MbActionSheet) {
        function _MbActionSheet() {
            MbActionSheet.call(this);
            var scope = this.scope;
            scope.cancelTextButton = defaults.cancelTextButton, scope.$$close = scope.close = function() {
                return this.hide();
            }.bind(this);
        }
        return inherits(_MbActionSheet, MbActionSheet, {
            defaults: defaults
        }), new _MbActionSheet();
    }
    var defaults = this.defaults = {
        templateUrl: "mobie/components/action-sheet.html",
        activeBodyClass: "mb-action-sheet-visible",
        cancelTextButton: "Cancel"
    };
    this.$get = $MbActionSheetFactory, $MbActionSheetFactory.$inject = [ "MbActionSheet" ];
}

angular.module("mobie.components.action-sheet", [ "mobie.components.backdrop", "mobie.core.component", "mobie.core.helpers" ]).factory("MbActionSheet", [ "$mbBackdrop", "MbPopup", function($mbBackdrop, MbPopup) {
    function MbActionSheet() {
        MbPopup.call(this);
        var node = $mbBackdrop.element[0], ON_CLICK = function(e) {
            e.target == node && this._close();
        }.bind(this), ON_KEYDOWN = function(e) {
            27 === e.keyCode && this._close();
        }.bind(this);
        this.on("notVisibleChangeStart", function() {
            $mbBackdrop.hide();
        }).on("visibleChangeStart", function() {
            $mbBackdrop.show();
        }).on("bindEvents", function() {
            this.scope.backdropEvents && node.addEventListener("click", ON_CLICK), this.scope.escapeKey && node.addEventListener("keydown", ON_KEYDOWN);
        }).on("unbindEvents", function() {
            node.removeEventListener("click", ON_CLICK);
        }), this.defaultScopeAttrs.groups = [], this.defaultScopeAttrs.noCancelButton = !1;
    }
    return inherits(MbActionSheet, MbPopup, {
        _close: function() {
            this.digest(function() {
                this.hide();
            });
        },
        configureScope: function(scope) {
            var groups = scope.groups, buttons = scope.buttons;
            groups.length < 1 && buttons && this.noGroupApproach(scope, buttons), angular.forEach(groups, function(group) {
                this.configureButtons(group.buttons);
            }.bind(this));
        },
        noGroupApproach: function(scope, buttons) {
            var title = scope.title, groups = scope.groups, group = {
                title: title,
                buttons: buttons
            };
            groups.push(group);
        }
    }), MbActionSheet;
} ]).provider("$mbActionSheet", $MbActionSheetProvider);
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
function BackdropFactory($animate, MbSimpleComponent) {
    var bodyEl = angular.element(document.body), el = angular.element("<div>");
    el.addClass("backdrop mb-backdrop"), $animate.enter(el, bodyEl);
    var $mbBackdrop = new MbSimpleComponent(el, "default-backdrop");
    return $mbBackdrop;
}

BackdropFactory.$inject = [ "$animate", "MbSimpleComponent" ], angular.module("mobie.components.backdrop", [ "mobie.core.component" ]).factory("$mbBackdrop", BackdropFactory);
function BarFixedTopDirective($mbScroll, $animate, $timeout, MbSimpleComponent) {
    function postLink(scope, element, attrs) {
        function cancelTimeout() {
            return $timeout.cancel(animationPromise);
        }
        function setVisibleState(visibleState) {
            return digest(scope, function() {
                cancelTimeout(), animationPromise = $timeout(function() {
                    return component[visibleState ? "show" : "hide"]();
                }, ms);
            });
        }
        var animationPromise, ms = 60, component = new MbSimpleComponent(element), visibleState = !0;
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

BarFixedTopDirective.$inject = [ "$mbScroll", "$animate", "$timeout", "MbSimpleComponent" ], 
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
    function $MbModalFactory(MbComponent, $animate, $mbBackdrop, $timeout) {
        function MbModal(options) {
            angular.isUndefined(options) && (options = {});
            var options = angular.defaults(options, defaults);
            MbComponent.call(this, options);
            var _this = this, scope = this.scope;
            this.scope.$hide = function() {
                _this.scope.$$postDigest(function() {
                    return _this.hide();
                });
            }, this.on("visibleChangeStart", function() {
                $mbBackdrop.show(), $animate.addClass(bodyElement, options.activeBodyClass);
            }), this.on("notVisible", function() {
                digest(scope, function() {
                    $timeout(function() {
                        $mbBackdrop.hide();
                    }), $animate.removeClass(bodyElement, options.activeBodyClass);
                });
            });
        }
        var bodyElement = angular.element(document.body);
        return inherits(MbModal, MbComponent), angular.extend(function(options) {
            return new MbModal(options);
        }, {
            MbModal: MbModal
        });
    }
    var defaults = this.defaults = {
        templateUrl: "components/modal/modal.html",
        activeBodyClass: "mb-modal-visible"
    };
    $MbModalFactory.$inject = [ "MbComponent", "$animate", "$mbBackdrop", "$timeout" ], 
    this.$get = $MbModalFactory;
}

angular.module("mobie.components.modal", [ "mobie.core.component", "mobie.core.helpers", "mobie.components.backdrop" ]).provider("$mbModal", $MbModalProvider);
function $MbPopupProvider() {
    function $MbPopupFactory(MbPopup, $mbBackdrop) {
        function _MbPopup() {
            MbPopup.call(this);
            var element = this.component.getElement(), node = element[0], ON_CLICK = function(e) {
                e.target == node && this.digest(function() {
                    this.hide();
                });
            }.bind(this);
            this.on("bindEvents", function() {
                node.addEventListener("click", ON_CLICK);
            }).on("unbindEvents", function() {
                node.removeEventListener("click", ON_CLICK);
            });
        }
        return inherits(_MbPopup, MbPopup, {
            defaults: defaults
        }), new _MbPopup();
    }
    this.$get = $MbPopupFactory;
    var defaults = this.defaults = {
        templateUrl: "mobie/components/popup.html",
        activeBodyClass: "mb-popup-visible"
    };
    $MbPopupFactory.$inject = [ "MbPopup", "$mbBackdrop" ];
}

var bodyEl = angular.element(document.body);

angular.module("mobie.components.popup", [ "mobie.core.helpers", "mobie.core.component", "mobie.components.backdrop" ]).factory("MbPopup", [ "$rootScope", "MbComponent", "$q", "$animate", function($rootScope, MbComponent, $q, $animate) {
    function MbPopup(options) {
        EventEmitter.call(this), this.on("scope", function(scope) {
            scope.close = function() {
                this.scope.$$postDigest(function() {
                    this.hide();
                }.bind(this));
            }.bind(this);
        }), this.options = {}, angular.isObject(options) && angular.extend(this.options, options);
        var scope = this.options.scope = this.scope = $rootScope.$new();
        this.applyDefaults(), this.history = {}, this.component = new MbComponent(this.options), 
        this.el = this.component.getElement(), this.node = this.el[0], this.bodyElement = angular.element(document.body), 
        Object.defineProperty(this, "lastId", {
            get: function() {
                var keys = Object.keys(this.history);
                return keys.length < 1 ? 0 : parseInt(keys[keys.length - 1]);
            }
        }), this.emit("scope", scope), angular.forEach(this.replicateEvents, function(e) {
            this.component.on(e, function() {
                this.emit(e);
            }.bind(this));
        }.bind(this)), this.on("hide", function(options, id) {
            this.history[id] = options;
        });
    }
    return inherits(MbPopup, EventEmitter, {
        replicateEvents: [ "visible", "notVisible", "visibleChangeStart", "notVisibleChangeStart" ],
        getOptions: function() {
            return this.options;
        },
        createScope: function() {
            return this.options.scope = this.scope = $rootScope.$new(), this.scope;
        },
        applyDefaults: function() {
            return angular.defaults(this.options, this.defaults), this;
        },
        digest: function(fn) {
            return digest(this.scope, fn, this);
        },
        asyncDigest: function() {
            return $q(function(resolve) {
                this.digest(function(scope) {
                    resolve(scope);
                });
            }.bind(this));
        },
        unbindEvents: function() {
            return this.asyncDigest().then(function() {
                this.emit("unbindEvents");
            }.bind(this));
        },
        bindEvents: function() {
            return this.asyncDigest().then(function() {
                this.emit("bindEvents");
            }.bind(this));
        },
        setActiveBodyClass: function(isActive) {
            return this.asyncDigest().then(function() {
                return $animate[isActive ? "addClass" : "removeClass"](this.bodyElement, this.options.activeBodyClass);
            }.bind(this));
        },
        setBackdrop: function(isActive) {
            return this.asyncDigest().then(function() {
                return $mbBackdrop[isActive ? "show" : "hide"]();
            });
        },
        getVisibleState: function() {
            return this.component.getVisibleState();
        },
        setComponent: function(isActive) {
            return this.asyncDigest().then(function() {
                return this.component[isActive ? "show" : "hide"]();
            }.bind(this));
        },
        hide: function() {
            return this.setComponent(!1).then(function() {
                return this.unbindEvents();
            }.bind(this)).then(function() {
                this.emit("hide", this.options, this.id);
            }.bind(this));
        },
        defaultScopeAttrs: {
            text: "",
            title: "",
            template: "",
            buttons: [ {
                text: "OK",
                classes: [ "button-stable" ]
            } ],
            backdropEvents: !0
        },
        scopeReset: function() {
            this.scopeExtend(this.defaultScopeAttrs), this.emit("reset");
        },
        scopeExtend: function(options) {
            return this.digest(function(scope) {
                angular.extend(scope, options), this.emit("updated");
            }.bind(this)), this;
        },
        showById: function(id) {
            var item = this.history[id];
            return angular.isUndefined(item) ? $q.reject(new Error("popup id does not exists")) : this.show(item, id);
        },
        show: function(options, id) {
            return angular.isNumber(options) ? this.showById(options) : options ? (this.id = id || nextId(), 
            this.options = options, this.emit("show", options, this.id), this.getVisibleState() ? this.hide(!0).then(function() {
                return this.show(options);
            }.bind(this)) : (this.scopeReset(), this.scopeExtend(options), this.digest(function() {
                this.configureScope(this.scope);
            }), this.setComponent(!0).then(function() {
                return this.bindEvents();
            }.bind(this)))) : this.show(this.lastId);
        },
        configureOnTapEvent: function(onTap) {
            var fn = function(event) {
                return this.emit("onTap", this.id, this.scope, event), onTap.call(this, this.scope, event);
            };
            return fn.bind(this);
        },
        configureButtonClasses: function(btn) {
            var classes = btn.classes;
            btn.classes = {}, angular.forEach(classes, function(value) {
                btn.classes[value] = !0;
            });
        },
        configureButtons: function(buttons) {
            angular.forEach(buttons, function(btn, i) {
                angular.isFunction(btn.onTap) || (btn.onTap = this.defaultOnTapFn), angular.isArray(btn.classes) && this.configureButtonClasses(btn);
                btn.onTap;
                btn.onTap = this.configureOnTapEvent(btn.onTap);
            }.bind(this));
        },
        configureScope: function(scope) {
            this.configureButtons(scope.buttons);
        },
        defaultOnTapFn: function() {
            return this.asyncDigest().then(function() {
                return this.hide();
            }.bind(this));
        }
    }), MbPopup;
} ]).provider("$mbPopup", $MbPopupProvider);
function MbSidenavController($scope, $element, $attrs, $transclude, $animate, MbSimpleComponent, $mbComponentRegistry, $mbBackdrop, $mbSidenav, $window) {
    function apply(fn) {
        return digest($scope, fn);
    }
    function setVisibleState(visibleState) {
        apply(function() {
            $mbBackdrop[visibleState ? "show" : "hide"](), angular.isString(activeBodyClass) && $animate[visibleState ? "addClass" : "removeClass"](bodyEl, activeBodyClass);
        });
    }
    function onClickListener(evt) {
        apply(function() {
            component.hide();
        });
    }
    var bodyEl = angular.element($window.document.body), backdropEl = $mbBackdrop.getElement(), sidenavOptions = $mbSidenav.getOptions(), activeBodyClass = sidenavOptions.activeBodyClass, component = this.component = new MbSimpleComponent($element, {
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
        controller: "MbSidenavController",
        controllerAs: "mbSidenavCtrl"
    };
}

MbSidenavController.$inject = [ "$scope", "$element", "$attrs", "$transclude", "$animate", "MbSimpleComponent", "$mbComponentRegistry", "$mbBackdrop", "$mbSidenav", "$window" ], 
angular.module("mobie.components.sidenav", [ "mobie.components.animation", "mobie.components.backdrop", "mobie.core.registry", "mobie.core.component", "mobie.core.helpers" ]).directive("mbClose", CloseDirective).controller("MbSidenavController", MbSidenavController).provider("$mbSidenav", $MbSidenavProvider).directive("mbSidenav", SidenavDirective);
function $MbSpinnerProvider() {
    function createSvgElement(tagName, data, parent, spinnerName) {
        var k, x, y, ele = document.createElement(SHORTCUTS[tagName] || tagName);
        for (k in data) if (angular.isArray(data[k])) for (x = 0; x < data[k].length; x++) if (data[k][x].fn) for (y = 0; y < data[k][x].t; y++) createSvgElement(k, data[k][x].fn(y, spinnerName), ele, spinnerName); else createSvgElement(k, data[k][x], ele, spinnerName); else setSvgAttribute(ele, k, data[k]);
        parent.appendChild(ele);
    }
    function setSvgAttribute(ele, k, v) {
        ele.setAttribute(SHORTCUTS[k] || k, v);
    }
    function animationValues(strValues, i) {
        var values = strValues.split(";"), back = values.slice(i), front = values.slice(0, values.length - back.length);
        return values = back.concat(front).reverse(), values.join(";") + ";" + values[0];
    }
    function easeInOutCubic(t, c) {
        return t /= c / 2, 1 > t ? .5 * t * t * t : (t -= 2, .5 * (t * t * t + 2));
    }
    function $MbSpinnerFactory() {
        function startAnimation(element, spinnerName) {
            defaults.animations[spinnerName] && defaults.animations[spinnerName](element)();
        }
        function getSpinnerClass(iconName) {
            return iconName = iconName.toLowerCase(), "spinner-" + iconName;
        }
        var $mbSpinner = {};
        return $mbSpinner.create = function(element, iconName) {
            var spinnerName, spinner;
            spinnerName = iconName, spinner = spinners[spinnerName], spinner || (spinnerName = "ios", 
            spinner = spinners.ios);
            var container = document.createElement("div");
            return createSvgElement("svg", {
                viewBox: "0 0 64 64",
                g: [ spinners[spinnerName] ]
            }, container, spinnerName), element.html(container.innerHTML), element.addClass(getSpinnerClass(iconName)), 
            startAnimation(element[0], spinnerName), spinnerName;
        }, $mbSpinner.getSpinners = function() {
            return Object.keys(defaults.spinners);
        }, $mbSpinner;
    }
    var defaults = this.defaults = {}, TRANSLATE32 = "translate(32,32)", STROKE_OPACITY = "stroke-opacity", ROUND = "round", INDEFINITE = "indefinite", DURATION = "750ms", NONE = "none", SHORTCUTS = defaults.SHORTCUTS = {
        a: "animate",
        an: "attributeName",
        at: "animateTransform",
        c: "circle",
        da: "stroke-dasharray",
        os: "stroke-dashoffset",
        f: "fill",
        lc: "stroke-linecap",
        rc: "repeatCount",
        sw: "stroke-width",
        t: "transform",
        v: "values"
    }, SPIN_ANIMATION = defaults.SPIN_ANIMATION = {
        v: "0,32,32;360,32,32",
        an: "transform",
        type: "rotate",
        rc: INDEFINITE,
        dur: DURATION
    }, IOS_SPINNER = {
        sw: 4,
        lc: ROUND,
        line: [ {
            fn: function(i, spinnerName) {
                return {
                    y1: "ios" == spinnerName ? 17 : 12,
                    y2: "ios" == spinnerName ? 29 : 20,
                    t: TRANSLATE32 + " rotate(" + (30 * i + (6 > i ? 180 : -180)) + ")",
                    a: [ {
                        fn: function() {
                            return {
                                an: STROKE_OPACITY,
                                dur: DURATION,
                                v: animationValues("0;.1;.15;.25;.35;.45;.55;.65;.7;.85;1", i),
                                rc: INDEFINITE
                            };
                        },
                        t: 1
                    } ]
                };
            },
            t: 12
        } ]
    }, spinners = {
        android: {
            c: [ {
                sw: 6,
                da: 128,
                os: 82,
                r: 26,
                cx: 32,
                cy: 32,
                f: NONE
            } ]
        },
        ios: IOS_SPINNER,
        "ios-small": IOS_SPINNER,
        bubbles: {
            sw: 0,
            c: [ {
                fn: function(i) {
                    return {
                        cx: 24 * Math.cos(2 * Math.PI * i / 8),
                        cy: 24 * Math.sin(2 * Math.PI * i / 8),
                        t: TRANSLATE32,
                        a: [ {
                            fn: function() {
                                return {
                                    an: "r",
                                    dur: DURATION,
                                    v: animationValues("1;2;3;4;5;6;7;8", i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        } ]
                    };
                },
                t: 8
            } ]
        },
        circles: {
            c: [ {
                fn: function(i) {
                    return {
                        r: 5,
                        cx: 24 * Math.cos(2 * Math.PI * i / 8),
                        cy: 24 * Math.sin(2 * Math.PI * i / 8),
                        t: TRANSLATE32,
                        sw: 0,
                        a: [ {
                            fn: function() {
                                return {
                                    an: "fill-opacity",
                                    dur: DURATION,
                                    v: animationValues(".3;.3;.3;.4;.7;.85;.9;1", i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        } ]
                    };
                },
                t: 8
            } ]
        },
        crescent: {
            c: [ {
                sw: 4,
                da: 128,
                os: 82,
                r: 26,
                cx: 32,
                cy: 32,
                f: NONE,
                at: [ SPIN_ANIMATION ]
            } ]
        },
        dots: {
            c: [ {
                fn: function(i) {
                    return {
                        cx: 16 + 16 * i,
                        cy: 32,
                        sw: 0,
                        a: [ {
                            fn: function() {
                                return {
                                    an: "fill-opacity",
                                    dur: DURATION,
                                    v: animationValues(".5;.6;.8;1;.8;.6;.5", i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }, {
                            fn: function() {
                                return {
                                    an: "r",
                                    dur: DURATION,
                                    v: animationValues("4;5;6;5;4;3;3", i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        } ]
                    };
                },
                t: 3
            } ]
        },
        lines: {
            sw: 7,
            lc: ROUND,
            line: [ {
                fn: function(i) {
                    return {
                        x1: 10 + 14 * i,
                        x2: 10 + 14 * i,
                        a: [ {
                            fn: function() {
                                return {
                                    an: "y1",
                                    dur: DURATION,
                                    v: animationValues("16;18;28;18;16", i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }, {
                            fn: function() {
                                return {
                                    an: "y2",
                                    dur: DURATION,
                                    v: animationValues("48;44;36;46;48", i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }, {
                            fn: function() {
                                return {
                                    an: STROKE_OPACITY,
                                    dur: DURATION,
                                    v: animationValues("1;.8;.5;.4;1", i),
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        } ]
                    };
                },
                t: 4
            } ]
        },
        ripple: {
            f: NONE,
            "fill-rule": "evenodd",
            sw: 3,
            circle: [ {
                fn: function(i) {
                    return {
                        cx: 32,
                        cy: 32,
                        a: [ {
                            fn: function() {
                                return {
                                    an: "r",
                                    begin: -1 * i + "s",
                                    dur: "2s",
                                    v: "0;24",
                                    keyTimes: "0;1",
                                    keySplines: "0.1,0.2,0.3,1",
                                    calcMode: "spline",
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        }, {
                            fn: function() {
                                return {
                                    an: STROKE_OPACITY,
                                    begin: -1 * i + "s",
                                    dur: "2s",
                                    v: ".2;1;.2;0",
                                    rc: INDEFINITE
                                };
                            },
                            t: 1
                        } ]
                    };
                },
                t: 2
            } ]
        },
        spiral: {
            defs: [ {
                linearGradient: [ {
                    id: "sGD",
                    gradientUnits: "userSpaceOnUse",
                    x1: 55,
                    y1: 46,
                    x2: 2,
                    y2: 46,
                    stop: [ {
                        offset: .1,
                        "class": "stop1"
                    }, {
                        offset: 1,
                        "class": "stop2"
                    } ]
                } ]
            } ],
            g: [ {
                sw: 4,
                lc: ROUND,
                f: NONE,
                path: [ {
                    stroke: "url(#sGD)",
                    d: "M4,32 c0,15,12,28,28,28c8,0,16-4,21-9"
                }, {
                    d: "M60,32 C60,16,47.464,4,32,4S4,16,4,32"
                } ],
                at: [ SPIN_ANIMATION ]
            } ]
        }
    };
    angular.extend(defaults, {
        spinners: spinners,
        SPIN_ANIMATION: SPIN_ANIMATION,
        animations: {
            android: function(ele) {
                function run() {
                    var v = easeInOutCubic(Date.now() - startTime, 650), scaleX = 1, translateX = 0, dasharray = 188 - 58 * v, dashoffset = 182 - 182 * v;
                    rIndex % 2 && (scaleX = -1, translateX = -64, dasharray = 128 - -58 * v, dashoffset = 182 * v);
                    var rotateLine = [ 0, -101, -90, -11, -180, 79, -270, -191 ][rIndex];
                    setSvgAttribute(circleEle, "da", Math.max(Math.min(dasharray, 188), 128)), setSvgAttribute(circleEle, "os", Math.max(Math.min(dashoffset, 182), 0)), 
                    setSvgAttribute(circleEle, "t", "scale(" + scaleX + ",1) translate(" + translateX + ",0) rotate(" + rotateLine + ",32,32)"), 
                    rotateCircle += 4.1, rotateCircle > 359 && (rotateCircle = 0), setSvgAttribute(svgEle, "t", "rotate(" + rotateCircle + ",32,32)"), 
                    v >= 1 && (rIndex++, rIndex > 7 && (rIndex = 0), startTime = Date.now()), window.requestAnimationFrame(run);
                }
                var startTime, rIndex = 0, rotateCircle = 0, svgEle = ele.querySelector("g"), circleEle = ele.querySelector("circle");
                return function() {
                    startTime = Date.now(), run();
                };
            }
        }
    }), this.$get = $MbSpinnerFactory;
}

function SpinnerDirective($mbSpinner) {
    function postLink(scope, element, attrs) {
        $mbSpinner.create(element, scope.icon);
    }
    return {
        restrict: "E",
        scope: {
            icon: "@"
        },
        compile: function(element) {
            return element.addClass("spinner"), postLink;
        }
    };
}

SpinnerDirective.$inject = [ "$mbSpinner" ], angular.module("mobie.components.spinner", []).directive("mbSpinner", SpinnerDirective).provider("$mbSpinner", $MbSpinnerProvider);
function MbSimpleComponentFactory($animate, EventEmitter) {
    function MbSimpleComponent(componentEl, id, options) {
        EventEmitter.call(this), this.isVisible = !1, angular.isObject(id) && (options = id, 
        id = void 0, angular.extend(this, options)), angular.isDefined(componentEl) && this.setElement(componentEl), 
        angular.isDefined(id) && this.setId(id), this.on("visibleStateChangeSuccess", function() {
            this.emit(this.getVisibleState() ? "visible" : "notVisible");
        }), this.on("visibleStateChangeStart", function(visibleState) {
            this.emit(visibleState ? "visibleChangeStart" : "notVisibleChangeStart");
        });
    }
    return inherits(MbSimpleComponent, EventEmitter, {
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
        setElement: function(element) {
            if (!element) throw new Error("invalid element");
            var el = this.element = angular.element(element), isVisible = this.getVisibleState(), hiddenClass = this.getHiddenClass();
            return el.hasClass(hiddenClass) || isVisible || el.addClass(hiddenClass), this;
        },
        getElement: function() {
            return this.element;
        }
    }), MbSimpleComponent;
}

function $MbComponentProvider() {
    function $MbComponentFactory(MbSimpleComponent, $controller, $compile, $templateCache, $animate, $rootScope) {
        function MbComponent(componentEl, id, options) {
            var _this = this;
            MbSimpleComponent.call(this), angular.isObject(componentEl) && (options = componentEl, 
            componentEl = null), angular.isUndefined(options) && (options = {}), angular.isString(componentEl) && (options.template = componentEl, 
            componentEl = void 0), this.options = options = angular.defaults(options, defaults), 
            id && this.setId(id), this.on("scope", function(scope) {
                var options = this.options;
                options.controller && this.appendController(options.controller, options.controllerAs);
            }), angular.isUndefined(options.scope) && (options.scope = $rootScope.$new());
            var scope = options.scope = this.scope = options.scope.$new();
            this.emit("scope", this.scope), scope.$on("$destroy", function() {
                _this.destroy(), el = void 0;
            }), this.on("visibleStateChangeSuccess", function() {
                this.digest();
            }), this.prepareComponent();
        }
        var bodyElement = angular.element(document.body);
        return inherits(MbComponent, MbSimpleComponent, {
            prepareComponent: function() {
                var scope = this.scope, options = this.options;
                angular.isUndefined(options.template) && angular.isDefined(options.templateUrl) && (this.options.template = $templateCache.get(options.templateUrl));
                var el = options.el = angular.element(options.template), componentLink = this.componentLink = $compile(el);
                this.once("visibleChangeStart", function() {
                    componentLink(scope);
                }), this.setElement(el), this.enterElement();
            },
            locals: function(locals) {
                this.digest(function(scope) {
                    angular.extend(scope, locals);
                });
            },
            appendController: function(controller, controllerAs) {
                var scope = this.scope, options = this.options;
                return this.controller = $controller(options.controller, {
                    $scope: scope,
                    $component: this
                }), angular.isString(controllerAs) && ($scope[controllerAs] = this.controller), 
                this;
            },
            digest: function(fn) {
                var scope = this.scope;
                return fn || (fn = angular.noop), scope && scope.$root ? (scope.$$phase || scope.$root.$$phase ? fn && scope.$applyAsync(fn) : scope.$apply(fn), 
                this) : (fn(scope), this);
            },
            enterElement: function() {
                var self = this;
                return angular.isUndefined(this.parentElement) && (this.parentElement = bodyElement), 
                this.emit("enterElementStart"), $animate.enter(this.getElement(), this.parentElement).then(function() {
                    self.emit("enter");
                });
            },
            removeElement: function() {
                return this.getElement().remove(), this.element = void 0, this;
            },
            leaveElement: function() {
                var _this = this;
                return this.emit("leaveElementStart"), $animate.leave(this.getElement()).then(function() {
                    return _this.emit("leave"), _this;
                });
            },
            destroy: function() {
                var _this = this;
                return this.hide().then(function() {
                    return _this.leaveElement();
                }).then(function() {
                    return _this.removeAllListeners();
                }).then(function() {
                    return _this.removeElement();
                });
            }
        }), MbComponent;
    }
    var defaults = this.defaults = {};
    $MbComponentFactory.$inject = [ "MbSimpleComponent", "$controller", "$compile", "$templateCache", "$animate", "$rootScope" ], 
    this.$get = $MbComponentFactory;
}

MbSimpleComponentFactory.$inject = [ "$animate", "EventEmitter" ], angular.module("mobie.core.component", [ "mobie.core.helpers", "mobie.components.animation" ]).factory("MbSimpleComponent", MbSimpleComponentFactory).provider("MbComponent", $MbComponentProvider);
function tryFunctionObject(value) {
    try {
        return fnToStr.call(value), !0;
    } catch (e) {
        return !1;
    }
}

function isCallable(value) {
    if ("function" != typeof value) return !1;
    if (hasToStringTag) return tryFunctionObject(value);
    var strClass = to_string.call(value);
    return strClass === fnClass || strClass === genClass;
}

var Empty = function() {}, array_push = Array.prototype.push, max = Math.max, array_slice = Array.prototype.slice, fnClass = "[object Function]", to_string = Object.prototype.toString, array_concat = Array.prototype.concat, hasToStringTag = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag;

angular.extend(Function.prototype, {
    bind: function(that) {
        var target = this;
        if (!isCallable(target)) throw new TypeError("Function.prototype.bind called on incompatible " + target);
        for (var bound, args = array_slice.call(arguments, 1), binder = function() {
            if (this instanceof bound) {
                var result = target.apply(this, array_concat.call(args, array_slice.call(arguments)));
                return $Object(result) === result ? result : this;
            }
            return target.apply(that, array_concat.call(args, array_slice.call(arguments)));
        }, boundLength = max(0, target.length - args.length), boundArgs = [], i = 0; boundLength > i; i++) array_push.call(boundArgs, "$" + i);
        return bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this, arguments); }")(binder), 
        target.prototype && (Empty.prototype = target.prototype, bound.prototype = new Empty(), 
        Empty.prototype = null), bound;
    }
});
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
function inherits(ctor, superCtor, attrs) {
    ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), attrs && angular.extend(ctor.prototype, attrs);
}

function nextId() {
    return id++, id;
}

function digest(scope, fn, context) {
    scope && (angular.isUndefined(fn) && (fn = function() {}), scope.$$phase || scope.$root && scope.$root.$$phase ? scope.$applyAsync(fn.bind(context)) : scope.$apply(fn.bind(context)));
}

angular.defaults = function(target, defaults) {
    var _defaults = angular.copy(defaults);
    return angular.isObject(target) && angular.isObject(_defaults) ? angular.extend(target, _defaults) : target;
};

var id = 0;

angular.module("mobie.core.helpers", [ "mobie.core.eventemitter" ]);
function $MbComponentRegistryFactory() {
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
}

angular.module("mobie.core.registry", [ "mobie.core.helpers" ]).factory("$mbComponentRegistry", $MbComponentRegistryFactory);
function $MbScrollProvider() {
    function $MbScrollFactory($window, $timeout, EventEmitter) {
        function MbScroll() {
            EventEmitter.call(this);
            var self = this;
            windowEl.on("scroll", function(evt) {
                self.emit("scroll", evt);
            }), this.on("scroll", this.onScroll), this.on("scrollStop", this.onScrollStop), 
            Object.defineProperty(this, "scrollY", {
                get: function() {
                    return this.getScrollY();
                }
            });
        }
        {
            var windowEl = angular.element($window);
            windowEl[0].document.body;
        }
        return inherits(MbScroll, EventEmitter), angular.extend(MbScroll.prototype, {
            scrollStoppedFn: function(evt) {
                this.emit("scrollStop", evt);
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
                this.setLastScrollY(this.getScrollY()), this.setScrollingState(!1);
            },
            setScrollingState: function(value) {
                this.scrollingState = value;
            },
            isScrolling: function() {
                return this.scrollingState;
            },
            onScroll: function(evt) {
                var currentScrollY = window.scrollY, self = this;
                this.setScrollingState(!0), $timeout.cancel(this.scrollStoppedPromise), 0 === currentScrollY && this.emit("scrollTop", evt), 
                currentScrollY > this.lastScrollY ? this.emit("scrollDown", evt) : this.emit("scrollUp", evt), 
                this.scrollStoppedPromise = $timeout(function() {
                    self.scrollStoppedFn(evt);
                }, defaults.scrollStoppedMs);
            }
        }), new MbScroll();
    }
    this.$get = $MbScrollFactory;
    var defaults = this.defaults = {
        scrollStoppedMs: 100
    };
    $MbScrollFactory.$inject = [ "$window", "$timeout", "EventEmitter" ];
}

angular.module("mobie.core.scroll", [ "mobie.core.helpers" ]).provider("$mbScroll", $MbScrollProvider);}(document, window, angular, undefined))