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

		function safeDigest() {
			return Helpers.safeDigest.apply(Helpers, arguments);
		}

		function asyncDigest () {
			return $q(function (resolve) {
				safeDigest(scope, function () {
					resolve();
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
			})
		}

		function hide (notTouchBackdrop) {
			var promises = [];
			return setComponent(false).then(function () {
				promises.push(setBackdrop(notTouchBackdrop));

				promises.push(setActiveBodyClass(false));

				return $q.all(promises).then(function () {
					return unbindEvents();
				});
			});
		}

		function show (options) {
			if(getVisibleState()) {
				return hide(true).then(function () {
					return show(options);
				});
			}

			var promises = [];
			angular.extend(scope, options);
			angular.forEach(scope.buttons, function (btn, i) {
				if(!angular.isFunction (btn.onTap)) {
					scope.buttons[i].onTap = defaultOnTapFn;
				}
			});

			return setComponent(true).then(function () {
				promises.push(setBackdrop(true));
				promises.push(setActiveBodyClass(true));
				return $q.all(promises).then(function () {
					return bindEvents();
				});
			});
		}

		$mbPopup.show = show;
		$mbPopup.hide = hide;

		return $mbPopup;
	}
}

angular.module('mobie.components.popup', [
	'mobie.core.helpers',
	'mobie.components.backdrop',
	'mobie.core.component',
])
.provider('$mbPopup', $MbPopupProvider);