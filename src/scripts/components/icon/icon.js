angular.module('mobie.components.icon', [])
.directive('mbIcon', function () {
	return {
		restrict: 'EA',
		scope: {
			name: '@'
		},
		template: '<span ng-class="classes" ng-show="hasIconName"></span>',
		controller: function ($scope, $attrs) {
			$scope.classes = {
				fa: true
			};

			$attrs.$observe('name', function (iconName) {
				if(iconName) {
					$scope.hasIconName = $scope.classes['fa-' + iconName] = true;
				} else {
					$scope.hasIconName = false;
				}
			});
		}
	};
});