function $MbSidenavFactory ($mbComponentRegistry) {
	return function (componentId) {
		return $mbComponentRegistry.get(componentId);
	};
}

function SidenavDirective () {
	return {
		restrict: 'EA',
		require: '?^mbSidenav',
		scope: {},
		controller: '$mbSidenavController',
		controllerAs: 'mbSidenavCtrl',
		link: function (scope, element, attrs, mbSidenav) {
		}
	};
}

angular.module('mobie.components.sidenav', [
	'mobie.components.backdrop',
	'mobie.core.registry',
	'mobie.core.component'
])
.controller('$mbSidenavController', function ($scope, $element, $attrs, $transclude, MbComponent, $mbComponentRegistry) {
	this.component = new MbComponent($element, $attrs.componentId);

	$mbComponentRegistry.register(this.component);
})
.factory('$mbSidenav', $MbSidenavFactory)
.directive('mbSidenav', SidenavDirective)