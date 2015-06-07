(function(angular) {
  'use strict';
angular.module('barFixedTopExample', ['ngAnimate', 'mobie'])
.controller('PersonsController', ['$scope', function ($scope) {
$scope.persons = [];
for(var i=0; i<10; i++) {
	$scope.persons[i] = { name: faker.name.findName() };
}
}]);
})(window.angular);