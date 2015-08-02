/**
 * @ngdoc directive
 * @name mbBarFixedTop
 * @restrict A
 *
 * @description
 * Add the class `mb-fixed-top` which keep the bar
 * fixed to the top of the body.
 *
 * When you scroll down the page, the bar hides. And
 * when you scroll up the page, the bar shows.
 *
 * @example
  <example module="barFixedTopExample">
  	<file name="index.html">
  		<div class="bar bar-primary bar-header" mb-bar-fixed-top>
  			<h3 class="title">Bar Fixed Top</h3>
  		</div>
  		<div class="list" ng-controller="PersonsController">
  			<div class="item" ng-repeat="person in persons track by $index">{{person.name}}</div>
  		</div>
  	</file>
  	<file name="app.js">
  		angular.module('barFixedTopExample', ['ngAnimate', 'mobie'])
  		.controller('PersonsController', ['$scope', function ($scope) {
				$scope.persons = [];
				for(var i=0; i<10; i++) {
					$scope.persons[i] = { name: faker.name.findName() };
				}
  		}]);
  	</file>
  	<file name="app.css">
  	@import url(../../lib/mobie.css);
  	</file>
  </example>
 */
function BarFixedTopDirective ($mbScroll, $animate, $timeout, MbComponent) {
	function postLink (scope, element, attrs) {
		var ms = 60,
				component = new MbComponent(element),
				animationPromise,
				visibleState = true;

		function cancelTimeout () {
			return $timeout.cancel(animationPromise);
		}

		function setVisibleState (visibleState) {
			return digest(scope, function () {
				cancelTimeout();
				animationPromise = $timeout(function () {
					return component[visibleState ? 'show' : 'hide']();
				}, ms);
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