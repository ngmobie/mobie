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
	function $MbPopupFactory ($mbComponent, $rootScope, $mbBackdrop, $animate, $q, $timeout) {
		var $mbPopup = {};
		var options = {
			scope: $rootScope.$new()
		};

		options = angular.extend({}, defaults, options);

		var mbComponent = $mbPopup.component = $mbComponent(options),
				component = mbComponent.component,
				el = component.getElement(),
				scope = options.scope;

		function onTapContainerFn(event) {
			return asyncDigest().then(function () {
				if(event.target === el[0]) {
					return $mbPopup.hide();
				}
			});
		}

		function defaultOnTapFn () {
			return asyncDigest().then(function () {
				return $mbPopup.hide();
			});
		}

		function apply(fn) {
			digest(scope, fn);
		}

		function asyncDigest () {
			return $q(function (resolve) {
				apply(function (scope) {
					resolve(scope);
				});
			});
		}

		function unbindEvents () {
			return asyncDigest().then(function () {
				el.off('click', onTapContainerFn);
			});
		}

		function bindEvents () {
			return asyncDigest().then(function () {
				el.on('click', onTapContainerFn);
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
			apply(function (scope) {
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
					btn.onTap = defaultOnTapFn;
				}
				if(angular.isArray(btn.classes)) {
					var classes = btn.classes;
					
					btn.classes = {};

					angular.forEach(classes, function (value) {
						btn.classes[value] = true;
					});
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