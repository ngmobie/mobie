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
	'mobie.components.backdrop',
	'mobie.core.registry',
	'mobie.core.component'
])
.controller('$mbSidenavController', function ($scope, $element, $attrs, $transclude, MbComponent, $mbComponentRegistry, $mbBackdrop) {
	var component = this.component = new MbComponent($element, $attrs.componentId);

	$mbComponentRegistry.register(this.component);

	function onClickListener(evt) {
		component.hide();
		$scope.$apply();
	}

	component.on('visibleStateChanged', function () {
		var isVisible = this.getVisibleState();
		$mbBackdrop[isVisible ? 'show' : 'hide']();
		var el = $mbBackdrop.getElement();
		if(isVisible) {
			el.on('click', onClickListener);
		} else {
			el.off('click', onClickListener);
		}
		$scope.$apply();
	});
})
.factory('$mbSidenav', $MbSidenavFactory)
.directive('mbSidenav', SidenavDirective)