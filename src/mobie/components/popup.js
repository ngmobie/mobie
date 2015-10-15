var bodyEl = angular.element(document.body);

/**
 * @ngdoc provider
 * @name $mbPopupProvider
 */
function $MbPopupProvider () {
	this.$get = $MbPopupFactory;

	var defaults = this.defaults = {
		templateUrl: 'mobie/components/popup.html',
		activeBodyClass: 'mb-popup-visible'
	};

	/**
	 * @ngdoc service
	 * @name $mbPopup
	 *
	 * @description
	 * The popup is a component to show popup windows that require the
	 * user to respond in order to continue.
	 * 
	 * For now, the popup service support only `show()` method, since the
	 * you can do anything with this method. The others your be added in order
	 * for convenience only.
	 *
	 * @example
	  <example module="popupExampleApp">
	  	<file name="index.html">
	  		<div class="bar bar-header bar-primary">
					<h3 class="title">Popup Example</h3>
	  		</div>
	  		<div class="padding" ng-controller="PopupController as popupCtrl">
	  			<p>
	  				<div class="button button-block" ng-click="popupCtrl.show()">Show popup</div>
	  			</p>
	  		</div>
	  	</file>
	  	<file name="app.js">
	  		angular.module('popupExampleApp', ['ngAnimate', 'mobie'])
	  		.controller('PopupController', ['$scope', '$mbPopup', function ($scope, $mbPopup) {
					this.show = function () {
						return $mbPopup.show({
							title: 'Hey',
							text: 'That was nice!',
							buttons: [{
								text: 'OK',
								classes: ['button-primary']
							}]
						});
					};
	  		}]);
	  	</file>
	  	<file name="app.css">
	  		@import "../../lib/mobie.css";
	  	</file>
	  </example>
	 */
	function $MbPopupFactory (MbPopup, $mbBackdrop) {
		function _MbPopup () {
			MbPopup.call(this);

			this.component.on('element', function(element) {
				var node = element[0];

				var ON_CLICK = function (e) {
					if(e.target == node) {
						this.digest(function (){
							this.hide();
						});
					}
				}.bind(this);

				this.on('bindEvents', function () {
					node.addEventListener('click', ON_CLICK);
				})
				.on('unbindEvents', function () {
					node.removeEventListener('click', ON_CLICK);
				});
			}.bind(this));
		}

		inherits(_MbPopup, MbPopup, {
			defaults: defaults
		});

		return new _MbPopup();
	}
}

angular.module('mobie.components.popup', [
	'mobie.core.helpers',
	'mobie.core.component',
	'mobie.components.backdrop'
])
.factory('MbPopup', function ($rootScope, MbComponent, $q, $animate) {
	function MbPopup(options) {
	  EventEmitter.call(this);

	  this.on('scope', function (scope) {
	    scope.close = function () {
	    	this.scope.$$postDigest(function () {
	    		this.hide();
	    	}.bind(this));
	    }.bind(this);
	  });

	  this.options = {};

	  if(angular.isObject(options)) {
	    angular.extend(this.options, options);
	  }


	  this.applyDefaults();

	  this.history 			= {};
	  this.component    = new MbComponent(this.options);

	  var scope = this.options.scope = this.scope = this.component.scope;
	  this.emit('scope', scope);

	  this.component.on('element', function(element) {
	  	this.el           = element;
	  	this.node         = this.el[0];
	  }.bind(this));

	  this.bodyElement  = angular.element(document.body);

	  Object.defineProperty(this, 'lastId', {
	  	get: function () {
	  		var keys = Object.keys(this.history);
	  		
	  		if(keys.length < 1) {
	  			return 0;
	  		}

	  		return parseInt(keys[keys.length - 1]);
	  	}
	  });


	  angular.forEach(this.replicateEvents, function (e) {
	  	this.component.on(e, function () {
	  		this.emit(e);
	  	}.bind(this));
	  }.bind(this));

	  this.on('hide', function (options, id) {
	  	this.history[id] = options;
	  });
	}

	inherits(MbPopup, EventEmitter, {
		replicateEvents: [
	  	'visible',
	  	'notVisible',
	  	'visibleChangeStart',
			'notVisibleChangeStart'
	  ],

	  getOptions: function () {
	    return this.options;
	  },

	  createScope: function () {
	    this.options.scope = this.scope = $rootScope.$new();

	    return this.scope;
	  },

	  applyDefaults: function () {
	    mobie.defaults(this.options, this.defaults);

	    return this;
	  },

	  digest: function (fn) {
	    return mobie.digest(this.scope, fn, this);
	  },

	  asyncDigest: function () {
	    return $q(function (resolve) {
	      this.digest(function (scope) {
	        resolve(scope);
	      });
	    }.bind(this));
	  },

	  unbindEvents: function () {
	    return this.asyncDigest().then(function () {
	      this.emit('unbindEvents');
	    }.bind(this));
	  },

	  bindEvents: function () {
	    return this.asyncDigest().then(function () {
	      this.emit('bindEvents');
	    }.bind(this));
	  },

	  setActiveBodyClass: function (isActive) {
	    return this.asyncDigest().then(function () {
	      return $animate[isActive ? 'addClass' : 'removeClass'](this.bodyElement, this.options.activeBodyClass);
	    }.bind(this));
	  },

	  setBackdrop: function (isActive) {
	    return this.asyncDigest().then(function () {
	      return $mbBackdrop[isActive ? 'show' : 'hide']();
	    });
	  },

	  getVisibleState: function () {
	    return this.component.getVisibleState();
	  },

	  // Set the component to some
	  // visibleState (hidden or visible)
	  setComponent: function (isActive) {
	    return this.asyncDigest().then(function (){
	      return this.component[isActive ? 'show' : 'hide']();
	    }.bind(this));
	  },

	  // Hide the popup
	  hide: function () {
	    return this.setComponent(false).then(function () {
	      return this.unbindEvents();
	    }.bind(this)).then(function () {
	      this.emit('hide', this.options, this.id);
	    }.bind(this));
	  },

	  defaultScopeAttrs: {
      text: '',
      title: '',
      template: '',
      buttons: [{
        text: 'OK',
        classes: ['button-stable']
      }],
      backdropEvents: true
    },

	  // Reset the popup scope
	  // with the default options
	  reset: function () {
	    this.locals(this.defaultScopeAttrs);

	    this.emit('reset');
	  },

	  // Extend the popup scope
	  locals: function(locals) {
      this.component.locals(locals);
      this.emit('updated');

	    return this;
	  },

	  showById: function (id) {
	  	var item = this.history[id];

	  	if(angular.isUndefined(item)) {
	  		return $q.reject(new Error('popup id does not exists'));
	  	}

	  	return this.show(item, id);
	  },

	  // Show the popup
	  show: function (options, id) {
			/*
			 * If the popup is visible
			 * just hide with the `notTouchBackdrop`
			 * option, and then, show it again, with
			 * the new options
			 */
			if(this.getVisibleState()) {
			  return this.hide().then(function () {
			    return this.show(options, id);
			  }.bind(this));
			}

	  	if(angular.isNumber(options)) {
	  		return this.showById(options);
	  	}

	  	if(!options) {
	  		return this.show(this.lastId);
	  	}

	    this.id = (id || nextId());
	    this.options = options;
	    this.emit('show', options, this.id);

	    /*
	     * Reset the actual scope, for we don't
	     * want to get a undesired `title` option,
	     * right?
	     */
	    this.reset();
	    this.locals(options);

	    this.digest(function() {
	    	this.configureScope(this.scope);
	    });

	    return this.setComponent(true).then(function () {
	      return this.bindEvents();
	    }.bind(this));
	  },

	  configureOnTapEvent: function(onTap) {
			var fn = function (event) {
				this.emit('onTap', this.id, this.scope, event);

				return onTap.call(this, this.scope, event);
			};

			return fn.bind(this);
	  },

	  configureButtonClasses: function (btn) {
	  	var classes = btn.classes;

      btn.classes = {};

      angular.forEach(classes, function (value) {
        btn.classes[value] = true;
      });
	  },

	  configureButtons: function(buttons) {
	  	angular.forEach(buttons, function (btn, i) {
	      if(!angular.isFunction(btn.onTap)) {
	        btn.onTap = this.defaultOnTapFn;
	      }

	      if(angular.isArray(btn.classes)) {
	        this.configureButtonClasses(btn);
	      }

	      var onTapFn = btn.onTap;

	      btn.onTap = this.configureOnTapEvent(btn.onTap);
	    }.bind(this));
	  },

	  configureScope: function (scope) {
	  	this.configureButtons(scope.buttons);
	  },

	  defaultOnTapFn: function () {
	    return this.asyncDigest().then(function () {
	      return this.hide();
	    }.bind(this));
	  }
	});

	return MbPopup;
})
.provider('$mbPopup', $MbPopupProvider);