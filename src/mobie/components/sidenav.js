function $MbSidenavController ($scope, $element, $attrs, $transclude, $animate, Helpers, MbComponent, $mbComponentRegistry, $mbBackdrop, $mbSidenav, $window) {
	var bodyEl = angular.element($window.document.body),
			backdropEl = $mbBackdrop.getElement(),
			sidenavOptions = $mbSidenav.getOptions(),
			activeBodyClass = sidenavOptions.activeBodyClass;

	function digest(fn) {
		return Helpers.safeDigest($scope, fn);
	}

	function setVisibleState (visibleState) {
		digest(function () {
			$mbBackdrop[visibleState ? 'show' : 'hide']();

			if(angular.isString(activeBodyClass)) {
				$animate[visibleState ? 'addClass' : 'removeClass'](bodyEl, activeBodyClass);
			}
		});
	}

	function onClickListener(evt) {
		digest(function () {
			component.hide();
		});
	}

	var component = this.component = new MbComponent($element, {
		id: $attrs.componentId
	});

	$mbComponentRegistry.register(this.component);

	component.on('visibleChangeStart', function () {
		setVisibleState(true);
	});

	component.on('visible', function () {
		backdropEl.on('click', onClickListener);
	});

	component.on('notVisible', function () {
		backdropEl.off('click', onClickListener);
		setVisibleState(false);
	});
}

function CloseDirective () {
	return {
		require: '?^mbSidenav',
		link: function (scope, element, attrs, mbSidenav) {
			if(angular.isUndefined(mbSidenav)) {
				return;
			}

			element.on('click', function () {
				scope.$apply(function () {
					mbSidenav.component.hide();
				});
			});
		}
	};
}

function $MbSidenavProvider () {
	var defaults = this.defaults = {
		activeBodyClass: 'mb-sidenav-visible'
	};

	function $MbSidenavFactory ($mbComponentRegistry) {
		return angular.extend(function (componentId) {
			return $mbComponentRegistry.get(componentId);
		}, {
			getOptions: function () {
				return defaults;
			}
		});
	}
	this.$get = $MbSidenavFactory;
}

/**
 * @ngdoc directive
 * @name mbSidenav
 */
function SidenavDirective () {
	return {
		restrict: 'EA',
		scope: {},
		controller: '$mbSidenavController',
		controllerAs: 'mbSidenavCtrl'
	};
}

angular.module('mobie.components.sidenav', [
	'mobie.components.animation',
	'mobie.components.backdrop',
	'mobie.core.registry',
	'mobie.core.component',
	'mobie.core.helpers'
])
.directive('mbClose', CloseDirective)
.controller('$mbSidenavController', $MbSidenavController)
.provider('$mbSidenav', $MbSidenavProvider)
.directive('mbSidenav', SidenavDirective);