ExamplesController.$inject = ['$scope'];
function ExamplesController ($scope) {
	var items = [{
		name: 'List',
		subitems: [{
			name: 'Divider',
			link: 'list-divider'
		}]
	}];

	function normalizeItemTmpUrl (item) {
		function normalize (item) {
			item.templateUrl = 'examples/' + item.link + '.html';
			if(_.isArray(item.subitems)) {
				item.subitems = normalizeItemTmpUrl(item.subitems);
			}
			return item;
		}

		return _.isArray(item) ? item.map(normalize) : normalize(item);
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