function MbComponentFactory (MbComponentInterface, $animate) {
	var MbComponent = MbComponentInterface.extend({
		initialize: function (componentEl, id, options) {
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
		getHiddenClass: function () {
			return 'mb-hidden';
		},
		getVisibleClass: function () {
			return 'mb-visible';
		},
		getVisibleState: function () {
			return !!this.isVisible;
		},
		setVisibleState: function (visibleState) {
			var self = this,
					el = this.getElement(),
					promises = [],
					addClass, // Class to add before animate
					removeClass, // Class to remove before animate
					hiddenClass = this.getHiddenClass(),
					visibleClass = this.getVisibleClass(),
					hiddenClassMethod = visibleState ? 'removeClass' : 'addClass';

			this.emit('visibleStateChangeStart', visibleState);

			addClass = visibleState ? visibleClass : hiddenClass;
			removeClass = visibleState ? hiddenClass : visibleClass;

			return $animate.setClass(el, addClass, removeClass).then(function () {
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
		setElement: function (componentEl) {
			var el = this.componentEl = componentEl,
					isVisible = this.getVisibleState(),
					hiddenClass = this.getHiddenClass();

			if(!el.hasClass(hiddenClass) && !isVisible) {
				el.addClass(hiddenClass);
			}

			return this;
		},
		getElement: function () {
			return this.componentEl;
		},
		enterElement: function (parent, after) {
			var self = this;

			if(angular.isUndefined(parent)) {
				parent = angular.element(document.body);
			}

			this.emit('enterElementStart');

			return $animate.enter(this.getElement(), parent, after).then(function () {
				self.emit('enterElementSuccess');
			});
		},
		removeElement: function () {
			this.getElement().remove();
			this.componentEl = undefined;
			return this;
		},
		leaveElement: function () {
			var self = this;

			this.emit('leaveElementStart');

			return $animate.leave(this.getElement()).then(function () {
				self.emit('leaveElementSuccess');
			});
		},
		destroy: function () {
			this.removeElement();
		}
	});

	return MbComponent;
}

function MbComponentInterface (Helpers) {
	var MbComponentInterface = Helpers.createClass({
		show: Helpers.notImplemented('show'),
		hide: Helpers.notImplemented('hide'),
		toggle: Helpers.notImplemented('toggle'),
		setElement: Helpers.notImplemented('setElement'),
		getElement: Helpers.notImplemented('getElement'),
		setId: Helpers.notImplemented('setId'),
		getId: Helpers.notImplemented('getId'),
		destroy: Helpers.notImplemented('destroy'),
		getVisibleState: Helpers.notImplemented('getVisibleState'),
		setVisibleState: Helpers.notImplemented('setVisibleState')
	});

	return MbComponentInterface;
}

// This service will be used to build
// components which will be reused just
// like this one, which will need to be
// recompiled before any action of showing
function $MbComponentProvider () {
	var defaults = this.defaults = {};

	function $MbComponentFactory (MbComponent, $compile, $templateCache, $animate, $rootScope) {
		var bodyEl = angular.element(document.body);

		return function (options) {
			var $mbComponent = {},
					el,
					template;

			if(angular.isString(options)) {
				template = options;
				options = {};
				options.template = template;
			}

			$mbComponent.options = options = angular.extend({}, defaults, options);

			if(angular.isUndefined(options.scope)) {
				options.scope = $rootScope.$new();
			}

			var scope = options.scope = $mbComponent.scope = options.scope.$new();
			var component = options.component = $mbComponent.component = new MbComponent();

			scope.$on('$destroy', function () {
				component.destroy();
				el = undefined;
			});

			angular.forEach(['show', 'hide', 'toggle'], function (key) {
				$mbComponent[key] = function () {
					return component[key]();
				};
			});

			// Create the element
			// using provided
			// template/templateUrl
			if(angular.isUndefined(options.template) && angular.isDefined(options.templateUrl)) {
				template = options.template = $templateCache.get(options.templateUrl);
			}

			if(angular.isUndefined(options.template)) {
				throw new Error('template must have something');
			}

			el = options.el = $mbComponent.element = angular.element(options.template);

			var componentLink = $mbComponent.componentLink = $compile(el);

			// Compile the component
			// for the first time
			// before it gets showed
			// up
			component.once('visibleChangeStart', function () {
				componentLink(scope);
			});

			$animate.enter(el, bodyEl).then(function () {
				component.emit('enter');
			});

			component.setElement(el);

			return $mbComponent;
		};
	}

	this.$get = $MbComponentFactory;
}

angular.module('mobie.core.component', [
	'mobie.core.helpers',
	'mobie.components.animation'
])
.factory('MbComponentInterface', MbComponentInterface)
.factory('MbComponent', MbComponentFactory)
.provider('$mbComponent', $MbComponentProvider)