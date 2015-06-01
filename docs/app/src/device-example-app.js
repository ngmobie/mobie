function FakerController ($scope, $window) {
	this.getPersons = function () {
		var persons = [];
		for(var i=0; i<100; i++) {
			persons[i] = {
				id: i,
				name: faker.name.findName(),
				checked: false
			};
		}
		return persons;
	};
	$scope.persons = this.getPersons();
	this.checkPerson = function (person) {
		person.checked = !!!person.checked;
	};

	this.getCheckedPersons = function () {
		var checkedPersons = 0;
		$scope.persons.forEach(function (person) {
			if(person.checked) {
				checkedPersons += 1;
			}
		});
		return checkedPersons;
	};
}

angular.module('device-example-app', ['mobie'])
.controller('FakerController', ['$scope', '$window', FakerController]);