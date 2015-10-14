/**
 * @ngdoc object
 * @name MbSimpleComponent
 * @description
 * Create a new instance of MbSimpleComponent
 * @param {DOMElement} componentEl the component element, which will be showed and hidded
 * @param {string} id the component id
 * @param {object} options the component options
 */
function MbSimpleComponentFactory ($animate, EventEmitter) {
	function MbSimpleComponent (componentEl, id, options) {
		EventEmitter.call(this);

		// defaults
		this.isVisible = false;

		if(angular.isObject(id)) {
			options = id;
			id = undefined;
			angular.extend(this, options);
		}

		if(angular.isDefined(componentEl)) {
			this.setElement(componentEl);
		}

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
	}

	inherits(MbSimpleComponent, EventEmitter, {
		/**
		 * @ngdoc method
		 * @name MbSimpleComponent#show
		 * @kind function
		 *
		 * @description Show the component
		 *
		 * @return {Promise} the animation callback promise
		 */
		show: function () {
			return this.setVisibleState(true);
		},

		/**
		 * @ngdoc method
		 * @name MbSimpleComponent#hide
		 * @kind function
		 *
		 * @description Hide the component
		 *
		 * @return {Promise} the animation callback promise
		 */
		hide: function () {
			return this.setVisibleState(false);
		},

		/**
		 * @ngdoc method
		 * @name MbSimpleComponent#toggle
		 * @kind function
		 *
		 * @description Toggle the component visible state
		 *
		 * @return {Promise} the animation callback promise
		 */
		toggle: function () {
			return this.setVisibleState(!this.getVisibleState());
		},

		getHiddenClass: function () {
			return 'mb-hidden';
		},

		getVisibleClass: function () {
			return 'mb-visible';
		},

		getVisibleState: function () {
			return !!this.isVisible;
		},

		getClassReceiverElement: function () {
      if(this.classReceiverElement) {
        return this.classReceiverElement;
      }
      return this.getElement();
    },

    setClassReceiverElement: function (classReceiverElement) {
      this.classReceiverElement = classReceiverElement;
      return this;
    },

    removeElement: function () {
      this.getElement().remove();

      return this;
    },

		/**
		 * @ngdoc method
		 * @name MbSimpleComponent#setVisibleState
		 * @kind function
		 *
		 * @description Emit `visibleStateChangeStart` event before do anything,
		 * 		then add the visible class and/or remove the hidden, according
		 * 		to the setted visible state param and emit the final event
		 *		`visibleStateChangeSuccess` or `visibleStateChangeError` if we
		 *		got an error.
		 *
		 * @param {Boolean} visibleState the visible state to set
		 *
		 * @return {Promise} the animation callback promise
		 */
		setVisibleState: function (visibleState) {
			var self = this;
			var classReceiverElement = this.getClassReceiverElement();
			var promises = [];
			var addClass; // Class to add before animat;
			var removeClass; // Class to remove before animat;
			var hiddenClass = this.getHiddenClass();
			var visibleClass = this.getVisibleClass();
			var hiddenClassMethod = visibleState ? 'removeClass' : 'addClass';

			this.emit('visibleStateChangeStart', visibleState);

			addClass = visibleState ? visibleClass : hiddenClass;
			removeClass = visibleState ? hiddenClass : visibleClass;

			return $animate.setClass(classReceiverElement, addClass, removeClass).then(function () {
				self.isVisible = visibleState;
				self.emit('visibleStateChangeSuccess');
			}, function (err) {
				self.emit('visibleStateChangeError', err);
			});
		},

		setId: function (id) {
			if(angular.isDefined(this.getId())) {
				throw new Error('You cannot change a component.id more than once');
			}

			Object.defineProperty(this, 'id', {
				value: id,
				writable: false
			});

			return this;
		},

		getId: function () {
			return this.id;
		},

		setElement: function (element) {
			if(!element) {
				throw new Error('invalid element');
			}

			this.element 							= angular.element(element);

			var isVisible 						= this.getVisibleState();
			var hiddenClass 					= this.getHiddenClass();
			var el 										= this.getClassReceiverElement();

			if(!el.hasClass(hiddenClass) && !isVisible) {
				el.addClass(hiddenClass);
			}

			return this;
		},

		getElement: function () {
			return this.element;
		}
	});

	return MbSimpleComponent;
}

/*
 * @ngdoc provider
 * @name $mbComponentProvider
 *
 * @description
 * Provider for the $mbComponent service
 */

/*
 * @ngdoc type
 * @name $mbComponent.Component
 * @module mobie.core.component
 *
 * @description
 * A component element will be compiled on the first time you ask for showing it
 */

/**
 * @ngdoc service
 * @name $mbComponent
 * @module mobie.core.component
 * 
 * @description
 * Create a reusable component, which have a template and need to be compiled.
 * It's the best shot if you want to create a custom component to reuse in your application.
 *
 * @param {object} options The options for this Component.
 *
 * - **template** - `{string}` - The string template of this component
 * - **templateUrl** - `{string}` - The template path which will be requested using `$templateCache`
 * - **scope** - `{Scope}` - The scope of the component, if no scope is provided, it will create and use a new $rootScope child.
 *
 * @example
  <example module="mbComponentExample">
  	<file name="index.html">
  		<div class="bar bar-header">
				<h3 class="title">Custom animation</h3>
  		</div>
  		<div class="list">
  			<div class="item item-input">
  				<input type="text" ng-model="msg" placeholder="Type a message here">
  			</div>
  		</div>
  		<div class="padding">
  			<p><div my-custom-component data-msg="{{msg}}"></div></p>
  		</div>
  	</file>
  	<file name="app.js">
  		angular.module('mbComponentExample', ['ngAnimate', 'mobie'])
  		.directive('myCustomComponent', ['$mbComponent', function ($mbComponent) {
				return {
					template: '<button ng-click="myCtrl.show()" class="button button-block">Show me up</button>',
					scope: {
						msg: '@'
					},
					controllerAs: 'myCtrl',
					controller: ['$scope', '$timeout', function ($scope, $timeout) {

						// Your component
						var myComponentTmp = '<div class="my-custom-component" mb-animation="zoom-in slide-out-left">' +
							'<div class="bar bar-header bar-primary">' +
								'<h3 class="title">My component</h3>' +
							'</div>' +
							'<div class="padding"><p>{{ msg || "Type a message in the next round" }}</p></div>' +
						'</div>';

						var component = $mbComponent({
							template: myComponentTmp,
							scope: $scope
						});

						this.show = function () {
							return component.show().then(function () {
								return $timeout(function () {
									return component.hide();
								}, 3000);
							});
						};
					}]
				};
  		}]);
  	</file>
  	<file name="app.css">
			@import url("../../lib/mobie.css");
			.my-custom-component {
				position: absolute;
				width: 100%;
				height: 100%;
				background-color: #fff;
				border-radius: 4px;
				z-index: 10;
			}
			.my-custom-component.mb-hidden {
				top: -9999px;
				left: -9999px;
			}
			.my-custom-component.mb-visible,
			.my-custom-component.mb-visible-add,
			.my-custom-component.mb-visible-remove,
			.my-custom-component.mb-hidden-add,
			.my-custom-component.mb-hidden-remove {
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
			}
  	</file>
  </example>
 *
 * @returns {$mbComponent.Component} The new $mbComponent instance
 */
function $MbComponentProvider () {
	var defaults = this.defaults = {};

	function $MbComponentFactory (MbSimpleComponent, $http, $q, $controller, $compile, $templateCache, $animate, $rootScope) {
		var bodyElement = angular.element(document.body);

		function MbComponent(componentEl, id, options) {
			var template, _this = this;

			MbSimpleComponent.call(this);

			if(angular.isObject(componentEl)) {
				options = componentEl;
				componentEl = null;
			}

			if(angular.isUndefined(options)) {
				options = {};
			}

			if(angular.isString(componentEl)) {
				options.templateUrl = componentEl;
				componentEl = undefined;
			}

      this.options = options = mobie.defaults(options, defaults);

      if(id) {
      	this.setId(id);
      }

      this.on('scope', function (scope) {
        var options = this.options;

        if(options.controller) {
          this.appendController(options.controller, options.controllerAs);
        }
      });

      if(!mobie.isScope(options.scope)) {
        options.scope = $rootScope.$new();
      }

      var scope = options.scope = this.scope = options.scope.$new();

      this.emit('scope', this.scope);

      scope.$on('$destroy', function () {
        _this.destroy();
      });

      this.on('componentLink', function(componentLink) {

      	this.once('visibleChangeStart', function () {
				  componentLink(this.scope);
				});

      });

      this.on('element', function(element) {
				var componentLink = this.componentLink = $compile(this.getElement());
				this.emit('componentLink', this.componentLink);
      });

      if(this.options.templateUrl || this.options.template) {
	      this.digest(function() {
	      	this.prepareComponent();
	      }.bind(this));
	    }
		}

		inherits(MbComponent, MbSimpleComponent, {
			storeTemplateAfterRequest: function(response) {
				var templateUrl = this.options.templateUrl;
				var template = response.data;

				$templateCache.put(templateUrl, template);

				return this.getTemplateSync();
			},

			getTemplateSync: function() {
				return this.options.template ||
							$templateCache.get(this.options.templateUrl);
			},

			getElementAsync: function(){
				if(this.getElement()) {
					return $q.when(this.getElement());
				}

				var template = this.getTemplateSync() ||
											$http.get(this.options.templateUrl)
											.then(this.storeTemplateAfterRequest.bind(this));

				return $q.when(template).then(function(template) {
					var element = angular.element(template);

					this.setElement(element);

					return element;
				}.bind(this));
			},

			prepareComponent: function () {
				return this.getElementAsync();
			},

			locals: function (locals) {
				this.digest(function(scope) {
          angular.extend(scope, locals);
        });

        return this;
			},

			appendController: function (controller, controllerAs) {
        var scope = this.scope;
        var options = this.options;

        this.controller = $controller(options.controller, {
          $scope: scope,
          $component: this
        });

        if(angular.isString(controllerAs)) {
          $scope[controllerAs] = this.controller;
        }

        return this;
      },

			digest: function (fn) {
        var scope = this.scope;

        if(!fn) {
        	fn = angular.noop;
        }

        if(!scope || !scope.$root) {
        	fn(scope);

        	return this;
        }

        if(!(scope.$$phase || scope.$root.$$phase)) {
          scope.$apply(fn);
        } else if (fn) {
          scope.$applyAsync(fn);
        }

        return this;
      },

      setElement: function() {
      	if(this.getElement()) {
      		throw new Error('Element already exists');
      	}

      	var setElement = MbSimpleComponent.prototype.setElement;

      	setElement.apply(this, arguments);
      	this.emit('element', this.getElement());

				return this.enterElement();
      },

			enterElement: function () {
				var self = this;

				if(angular.isUndefined(this.parentElement)) {
					this.parentElement = bodyElement;
				}

				this.emit('enterElementStart');

				return $animate.enter(this.getElement(), this.parentElement).then(function () {
					self.emit('enter');
				});
			},

			removeElement: function () {
				this.getElement().remove();
				this.element = undefined;
				return this;
			},

			leaveElement: function () {
				var _this = this;

				this.emit('leaveElementStart');

				return $animate.leave(this.getElement()).then(function () {
					_this.emit('leave');

					return _this;
				});
			},

			/**
			 * @ngdoc method
			 * @name MbComponent#destroy
			 *
			 * @description
			 * Destroys the element permanently
			 */
			destroy: function () {
				var _this = this;

				this.emit('destroy');

				return this
				.hide()
				.then(function () {
					return _this.leaveElement();
				})				
				.then(function () {
					return _this.removeAllListeners();
				})
				.then(function () {
					return _this.removeElement();
				})
				.then(function() {
					_this.emit('destroyed');
				});
			}
		});

		return MbComponent;
	}

	this.$get = $MbComponentFactory;
}

angular.module('mobie.core.component', [
	'mobie.core.helpers',
	'mobie.components.animation'
])
.factory('MbSimpleComponent', MbSimpleComponentFactory)
.provider('MbComponent', $MbComponentProvider);