angular.module('mobie.components.animation', [])
.directive('mbAnimationDuration', function () {
	return function postLink (scope, element, attrs) {
		function setAnimationDuration (ms) {
			if(!angular.isUndefined(ms) && ms !== '') {
				ms = ms + 'ms';
			}

			element.css('-webkit-animation-duration', ms);
			element.css('-moz-animation-duration', ms);
			element.css('animation-duration', ms);
		}

		attrs.$observe('mbAnimationDuration', function (ms) {
			if(angular.isUndefined(ms)) {
				return setAnimationDuration(undefined);
			}
			
			setAnimationDuration(ms);
		});
	};
})
.directive('mbAnimation', function () {
	return function (scope, element, attrs) {
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
			if(element.hasClass(className)) {
				element.removeClass(className);
			}
		}

		function addClass (className) {
			element.addClass(className);
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
	};
});