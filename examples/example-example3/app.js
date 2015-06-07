(function(angular) {
  'use strict';
angular.module('popupExampleApp', ['ngAnimate', 'mobie'])
.controller('PopupController', ['$scope', '$mbPopup', function ($scope, $mbPopup) {
this.show = function () {
	return $mbPopup.show({
		title: 'Hey',
		text: 'That was nice!',
		buttons: [{
			text: 'OK',
			classes: ['button-primary']
		}]
	});
};
}]);
})(window.angular);