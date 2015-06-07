(function(angular) {
  'use strict';
angular.module('mbComponentExample', ['ngAnimate', 'mobie'])
.directive('myCustomComponent', ['$mbComponent', function ($mbComponent) {
return {
	template: '<button ng-click="myCtrl.show()" class="button button-block">Show me up</button>',
	scope: {
		msg: '@'
	},
	controllerAs: 'myCtrl',
	controller: ['$scope', '$timeout', function ($scope, $timeout) {

		// Your component
		var myComponentTmp = '<div class="my-custom-component" mb-animation="zoom-in slide-out-left">' +
			'<div class="bar bar-header bar-primary">' +
				'<h3 class="title">My component</h3>' +
			'</div>' +
			'<div class="padding"><p>{{ msg || "Type a message in the next round" }}</p></div>' +
		'</div>';

		var component = $mbComponent({
			template: myComponentTmp,
			scope: $scope
		});

		this.show = function () {
			return component.show().then(function () {
				return $timeout(function () {
					return component.hide();
				}, 3000);
			});
		};
	}]
};
}]);
})(window.angular);