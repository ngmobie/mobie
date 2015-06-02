ExamplesController.$inject = ['$scope'];
function ExamplesController ($scope) {
	var items = [{
		name: 'Introduction',
		example: false
	}, {
		name: 'Typography'
	}, {
		name: 'List',
		subitems: [{
			name: 'List Dividers',
			link: 'list-divider'
		}]
	}, {
		name: 'Checkbox'
	}];

	function normalizeItemTmpUrl (item) {
		function normalize (item) {
			item.templateUrl = 'examples/' + item.link + '.html';
			if(_.isArray(item.subitems)) {
				item.subitems = normalizeItemTmpUrl(item.subitems);
			}
			return item;
		}

		return _.isArray(item) ? _.map(item, normalize) : normalize(item);
	}

	$scope.items = _(items).map(function (item) {
		if(!item.link) {
			item.link = item.name.toLowerCase();
		}
		return normalizeItemTmpUrl(item);
	}).value();
}

angular.module('docsApp')
.config(function ($stateProvider) {
	$stateProvider.state('css-examples', {
		url: '/examples',
		templateUrl: 'examples.html',
		controller: ExamplesController
	});
});