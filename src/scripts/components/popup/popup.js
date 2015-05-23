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

		function setComponent (isActive) {
			return asyncDigest().then(function (){
				return component[isActive ? 'show' : 'hide']();
			});
		}

		function hide (notTouchBackdrop) {
			return $q.all([
				setComponent(false),
				setBackdrop(notTouchBackdrop),
				setActiveBodyClass(false)
			]).then(function () {
				return unbindEvents();
			});
		}

		function scopeReset () {
			scopeExtend({
				text: '',
				title: '',
				template: ''
			});
		}

		function scopeExtend(options) {
			safeDigest(function (scope) {
				angular.extend(scope, options);
			});
		}

		function show (options) {
			if(getVisibleState()) {
				return hide(true).then(function () {
					return show(options);
				});
			}

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