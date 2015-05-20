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
	'mobie.core.component'
])
.directive('mbClose', CloseDirective)
.controller('$mbSidenavController', function ($scope, $element, $attrs, $transclude, MbComponent, $mbComponentRegistry, $mbBackdrop) {
	var component = this.component = new MbComponent($element, {
		id: $attrs.componentId
	});
	var backdropEl = $mbBackdrop.getElement();

	$mbComponentRegistry.register(this.component);

	function onClickListener(evt) {
		component.hide();
		$scope.$apply();
	}

	component.on('visibleChangeStart', function () {
		$mbBackdrop.show();
	});

	component.on('visibleStateChangeError', function () {
		$mbBackdrop.hide();
	});

	component.on('visible', function () {
		backdropEl.on('click', onClickListener);
	});

	component.on('notVisible', function () {
		backdropEl.off('click', onClickListener);
		$mbBackdrop.hide();
	});
})
.factory('$mbSidenav', $MbSidenavFactory)
.directive('mbSidenav', SidenavDirective)