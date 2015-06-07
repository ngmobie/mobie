(function(angular) {
  'use strict';
	var users = [];
for(var i=0; i<50; i++) {
	users[i] = faker.helpers.createCard();
}

	angular.module('actionSheetExampleApp', ['ngAnimate', 'mobie'])
	.controller('UserController', ['$scope', '$mbActionSheet', '$mbPopup', '$timeout', function ($scope, $mbActionSheet, $mbPopup, $timeout) {
		$scope.users = users;

		$scope.showMessage = function (msg, title) {
		return $mbPopup.show({
			title: title ? title : 'Hey',
			text: msg
		});
		};

		$scope.shareUser = function (user) {
		$timeout(function () {
			$scope.showMessage("It's done. " + user.name + ', shared!');
		}, 2000);
		};

		$scope.dropUser = function (user) {
		var index = $scope.users.indexOf(user);
		$scope.users.splice(index, 1);
		$timeout(function () {
			$scope.showMessage(user.name + ', deleted!');
		}, 2000);
		};

	$scope.showOptions = function (user) {
		$mbActionSheet.show({
			title: user.name,
			buttons: [
				{
					text: 'Share',
					onTap: function (scope) {
						scope.close();
						$scope.shareUser(user);
					}
				},
				{
					text: 'Delete',
					classes: ['button-danger'],
					onTap: function (scope) {
						$scope.dropUser(user);
						scope.close();
					}
				}
			]
		});
	};
	}]);
})(window.angular);