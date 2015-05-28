var bodyEl = angular.element(document.body);

function $MbPopupProvider () {
	this.$get = $MbPopupFactory;

	var defaults = this.defaults = {
		templateUrl: 'components/popup/popup.html',
		activeBodyClass: 'mb-popup-visible'
	};

	function $MbPopupFactory ($mbComponent, Helpers, $rootScope, $mbBackdrop, $animate, $q, $timeout) {
		var $mbPopup = {};
		var options = {
			scope: $rootScope.$new()
		};

		options = angular.extend({}, defaults, options);

		var mbComponent = $mbPopup.component = $mbComponent(options);
		var component = mbComponent.component;
		var el = component.getElement();
		var scope = options.scope;

		function defaultOnTapFn () {
			return asyncDigest().then(function () {
				return $mbPopup.hide();
			});
		}

		function safeDigest(fn) {
			Helpers.safeDigest(scope, fn);
		}

		function asyncDigest () {
			return $q(function (resolve) {
				safeDigest(function (scope) {
					resolve(scope);
				});
			});
		}

		function unbindEvents () {
			return asyncDigest().then(function () {
				el.off('click', defaultOnTapFn);
			});
		}

		function bindEvents () {
			return asyncDigest().then(function () {
				el.on('click', defaultOnTapFn);
			});
		}

		function setActiveBodyClass (isActive) {
			return asyncDigest().then(function () {
				return $animate[isActive ? 'addClass' : 'removeClass'](bodyEl, options.activeBodyClass);
			});
		}

		function setBackdrop (isActive) {
			return asyncDigest().then(function () {
				return $mbBackdrop[isActive ? 'show' : 'hide']();
			});
		}

		function getVisibleState () {
			return component.getVisibleState();
		}

		// Set the component to some
		// visibleState (hidden or visible)
		function setComponent (isActive) {
			return asyncDigest().then(function (){
				return component[isActive ? 'show' : 'hide']();
			});
		}

		// Hide the popup
		function hide (notTouchBackdrop) {
			return $q.all([
				setComponent(false),
				setBackdrop(notTouchBackdrop),
				setActiveBodyClass(false)
			]).then(function () {
				return unbindEvents();
			});
		}

		// Reset the popup scope
		// with the default options
		function scopeReset () {
			scopeExtend({
				text: '',
				title: '',
				template: '',
				buttons: []
			});
		}

		// Extend the popup scope
		function scopeExtend(options) {
			safeDigest(function (scope) {
				angular.extend(scope, options);
			});
		}

		// Show the popup
		function show (options) {
			// If the popup is visible
			// just hide with the `notTouchBackdrop`
			// option, and then, show it again, with
			// the new options
			if(getVisibleState()) {
				return hide(true).then(function () {
					return show(options);
				});
			}

			// Reset the actual scope, for we don't
			// want to get a undesired `title` option,
			// right?
			scopeReset();
			scopeExtend(options);
			angular.forEach(scope.buttons, function (btn, i) {
				if(!angular.isFunction(btn.onTap)) {
					scope.buttons[i].onTap = defaultOnTapFn;
				}
			});

			return $q.all([
				setComponent(true),
				setBackdrop(true),
				setActiveBodyClass(true)
			]).then(function () {
				return bindEvents();
			});
		}

		$mbPopup.show = show;
		$mbPopup.hide = hide;

		return $mbPopup;
	}
}

angular.module('mobie.components.popup', [
	'mobie.core.helpers',
	'mobie.core.component',
	'mobie.components.backdrop'
])
.provider('$mbPopup', $MbPopupProvider);