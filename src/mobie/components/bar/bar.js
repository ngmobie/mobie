/**
 * @ngdoc directive
 * @name mbBarFixedTop
 * @restrict A
 */
function BarFixedTopDirective ($mbScroll, $animate, $timeout, MbComponent, Helpers) {
	function postLink (scope, element, attrs) {
		var ms = 60,
				component = new MbComponent(element),
				animationPromise,
				visibleState = true;

		function cancelTimeout () {
			return $timeout.cancel(animationPromise);
		}

		function setVisibleState (visibleState) {
			return Helpers.safeDigest(scope, function () {
				cancelTimeout();
				animationPromise = $timeout(ms).then(function () {
					return component[visibleState ? 'show' : 'hide']();
				});
			});
		}

		$mbScroll.on('scrollTop', function () {
			setVisibleState(true);
		});

		$mbScroll.on('scrollDown', function (evt) {
			setVisibleState(false);
		});

		$mbScroll.on('scrollUp', function (evt) {
			setVisibleState(true);
		});

		setVisibleState(visibleState);
	}

	return {
		restrict: 'A',
		compile: function (element, attrs) {
			element.addClass('mb-fixed-top');
			return postLink;
		}
	};
}


angular.module('mobie.components.bar', [
	'mobie.core.scroll'
])
.directive('mbBarFixedTop', BarFixedTopDirective);