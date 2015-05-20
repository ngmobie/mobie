angular.module('mobie.components.animation', [])
.directive('mbAnimation', function () {
	return {
		require: '?mbSidenav',
		link: function (scope, element, attrs, mbSidenav) {
			var previousClass = undefined;

			function resolveClassName (newClassName) {
				previousClass = '';
				
				var classes = newClassName.split(/\ /),
						classesLength = classes.length;

				angular.forEach(classes, function (className, i) {
					previousClass += 'mb-' + className;
					if(i < classesLength) {
						previousClass += ' ';
					}
				});
			}

			function removeClass (className) {
				if(angular.isDefined(mbSidenav)) {
					return;
				}

				if(element.hasClass(className)) {
					element.removeClass(className);
				}
			}

			function addClass (className) {
				if(angular.isObject(mbSidenav) && mbSidenav.hasOwnProperty('component')) {
					mbSidenav.component.setAnimationClass(className);
				} else {
					element.addClass(className);
				}
			}

			attrs.$observe('mbAnimation', function (mbAnimation) {
				if(angular.isString(previousClass)) {
					removeClass(previousClass);
				}

				resolveClassName(mbAnimation);

				// If this element is a sidenav
				// just set the mbVisibleClass
				// option of the component
				addClass(previousClass);
			});
		}
	};
});