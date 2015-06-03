function getRandomThumbnailUrl() {
	var keys = _.keys(faker.image);

	var thumbnailUrl = faker.image[keys[Math.floor(Math.random() * keys.length)]]();

	return thumbnailUrl;
}

function FakerController ($scope, $window) {
	this.getPersons = function () {
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
	};
	
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

angular.module('device-example-app', ['mobie'])
.controller('FakerController', ['$scope', '$window', FakerController]);