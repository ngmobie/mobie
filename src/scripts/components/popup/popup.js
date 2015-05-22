var bodyEl = angular.element(document.body);

function $MbPopupProvider () {
	this.$get = $MbPopupFactory;

	var defaults = this.defaults = {
		templateUrl: 'components/popup/popup.html',
		activeBodyClass: 'mb-popup-visible'
	};

	function $MbPopupFactory ($mbComponent, Helpers, $rootScope, $mbBackdrop, $animate) {
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
			Helpers.safeDigest(scope, function () {
				component.hide();
			});
		}

		function unbindEvents () {
			el.off('click', defaultOnTapFn);
		}

		function bindEvents () {
			el.on('click', defaultOnTapFn);
		}

		component.on('visibleChangeStart', function () {
			angular.forEach(scope.buttons, function (btn, i) {
				if(!angular.isFunction (btn.onTap)) {
					options.scope.buttons[i].onTap = defaultOnTapFn;
				}
			});

			$mbBackdrop.show();
			$animate.addClass(bodyEl, options.activeBodyClass);
		});

		component.on('visible', function () {
			bindEvents();
		});

		component.on('notVisible', function () {
			Helpers.safeDigest(scope, function () {
				$mbBackdrop.hide();
				$animate.removeClass(bodyEl, options.activeBodyClass);
				unbindEvents();
			});
		});

		$mbPopup.show = function (options) {
			angular.extend(scope, options);			
			component.show();
		};

		return $mbPopup;
	}
}

angular.module('mobie.components.popup', [
	'mobie.core.helpers',
	'mobie.components.backdrop',
	'mobie.core.component',
])
.provider('$mbPopup', $MbPopupProvider);