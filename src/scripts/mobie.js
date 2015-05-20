angular.module('mobie.components', [
	'mobie.components.sidenav',
	'mobie.components.backdrop',
	'mobie.components.modal',
	'mobie.components.icon'
]);

angular.module('mobie', [
	'mobie.core',
	'mobie.components'
]);

angular.module('mobie.core', [
	'mobie.core.helpers',
	'mobie.core.registry',
	'mobie.core.eventemitter',
	'mobie.core.component'
])
.directive('mbAnimation', function () {
	return function (scope, element, attrs) {
		var previousClass = undefined;

		attrs.$observe('mbAnimation', function (mbAnimation) {
			if(angular.isString(previousClass)) {
				element.removeClass(previousClass);
			}

			previousClass = 'mb-' + mbAnimation;

			element.addClass(previousClass);
		});
	};
});