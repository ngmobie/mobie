(function(angular) {
  'use strict';
angular.module('exampleApp', ['mobie', 'ngAnimate'])
.controller('BarController', ['$mbSidenav', function ($mbSidenav) {
this.toggle = function () {
	return $mbSidenav('sidenav-left').toggle();
};
this.toggleSecond = function () {
	return $mbSidenav('sidenav-right').toggle();
};
this.toggleTop = function () {
	return $mbSidenav('sidenav-top').toggle();
};
}]);
})(window.angular);