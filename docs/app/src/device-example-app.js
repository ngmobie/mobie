function getPersons () {
	var persons = [];
	for(var i=0; i<100; i++) {
		var person = {
			id: i,
			name: faker.name.findName(),
			checked: false,
			avatarUrl: faker.image.avatar(),
			bio: faker.lorem.sentences(8)
		};

		var posts = [];
		for(var j=0; j<10; j++) {
			var post = {
				title: faker.lorem.sentence(3),
				authorId: person.id,
				createdAt: faker.date.past(),
				updatedAt: faker.date.recent()
			};

			post.title = _.capitalize(post.title);
			post.author = person;
			post.thumbnailUrl = getRandomThumbnailUrl();

			posts[j] = post;
		}

		person.posts = posts;

		persons[i] = person;
	}

	return persons;
}

function getRandomThumbnailUrl() {
	var keys = _.keys(faker.image);

	var thumbnailUrl = faker.image[keys[Math.floor(Math.random() * keys.length)]]();

	return thumbnailUrl;
}

FakerController.$inject = ['$scope', '$mbPopup', '$interpolate'];
function FakerController ($scope, $mbPopup, $interpolate) {
	this.submitForm = function (msg, username, password) {
		$mbPopup.show({
			title: 'Hey, you did it!',
			text: $interpolate(msg)($scope)
		});
	};

	this.brands = ['danger', 'success', 'info', 'primary'];

	this.getPersons = getPersons;
	
	this.persons = $scope.persons = this.getPersons();

	this.getPersonById = function (personId) {
		var person;
		this.persons.forEach(function (key) {
			if(key.id === Number(personId)) {
				person = key;
			}
		});
		return person;
	};

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

function QueryFilter () {
	return function (input, term) {
		if(!term) {
			return input;
		}
		var regexp = new RegExp(term);
		return _(input).filter(function (key) {
			var has = false;
			_.forEach(key, function (value) {
				if(regexp.test(value)) {
					has = true;
				}
			});
			return has;
		}).value();
	};
}

function BoldFilter () {
	return function (input, query) {
		if(!query) {
			return input;
		}

		input = input.replace(new RegExp(query, 'g'), '<b>$&<\/b>');

		_(query).map(function (letter) {
			input = input.replace(new RegExp(letter, 'g'), '<b>$&<\/b>');
		}).value().join('');

		return input;
	};
}

BoldDirective.$inject = ['$sce', '$filter'];
function BoldDirective ($sce, $filter) {
	return {
		scope: {
			query: '=mbBold',
			bind: '=bind'
		},
		link: function (scope, element, attrs) {
			scope.$watch('value', function (value) {
				element.html(value);
			});
			scope.$watch('query', function (query) {
				scope.value = $filter('bold')(scope.bind, query);
			});
		}
	};
}

angular.module('device-example-app', ['mobie', 'ngAnimate'])
.filter('query', QueryFilter)
.filter('bold', BoldFilter)
.directive('mbBold', BoldDirective)
.controller('FakerController', FakerController);