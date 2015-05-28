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

function $MbSidenavFactory ($mbComponentRegistry) {
	return function (componentId) {
		return $mbComponentRegistry.get(componentId);
	};
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
.controller('$mbSidenavController', function ($scope, $element, $attrs, $transclude, Helpers, MbComponent, $mbComponentRegistry, $mbBackdrop) {
	var component = this.component = new MbComponent($element, {
		id: $attrs.componentId
	});
	var backdropEl = $mbBackdrop.getElement();

	$mbComponentRegistry.register(this.component);

	function onClickListener(evt) {
		Helpers.safeDigest($scope, function () {
			component.hide();
		});
	}

	component.on('visibleChangeStart', function () {
		Helpers.safeDigest($scope, function () {
			$mbBackdrop.show();
		});
	});

	component.on('visibleStateChangeError', function () {
		Helpers.safeDigest($scope, function () {
			$mbBackdrop.hide();
		});
	});

	component.on('visible', function () {
		backdropEl.on('click', onClickListener);
	});

	component.on('notVisible', function () {
		backdropEl.off('click', onClickListener);
		Helpers.safeDigest($scope, function () {
			$mbBackdrop.hide();
		});
	});
})
.factory('$mbSidenav', $MbSidenavFactory)
.directive('mbSidenav', SidenavDirective)