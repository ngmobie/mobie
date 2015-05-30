/**
 * @ngdoc directive
 * @name mbBarFixedTop
 * @restrict A
 */
function BarFixedTopDirective ($mbScroll, Helpers) {
	function postLink (scope, element, attrs) {
		var actualY = 0;

		function setTranslateY(actualY) {
			element.css('transform', 'translate3d(0,' + actualY + 'px,0)');
		}

		var lastActualY = actualY;
		window.addEventListener('scroll', function () {
			if(actualY !== lastActualY) {
				setTranslateY(actualY);
			}
			lastActualY = actualY;
		});

		$mbScroll.on('scrollTop', function () {
			if(actualY !== 0) {
				actualY = 0;
			}
		});

		$mbScroll.on('scrollDown', function (evt) {
			var offsetHeight = element.prop('offsetHeight');

			if((actualY * -1) >= offsetHeight) {
				return;
			}

			actualY -= 17.5;
		});

		$mbScroll.on('scrollUp', function (evt) {
			var offsetHeight = element.prop('offsetHeight');

			if(actualY >= 0) {
				return;
			}

			actualY += 17.5;
		});
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