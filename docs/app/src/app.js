function LeftbarController ($scope, pagesData) {
	$scope.pages = _(pagesData)
		.filter(function (page) {
			return page.area;
		})
		.groupBy('area')
		.mapValues(function (value, key) {
			return _.groupBy(value, 'module');
		})
		.mapValues(function (value, key) {
			return _(value).mapValues(function (value, key) {
				return _.groupBy(value, 'docType');
			}).value();
		})
		.value();
}

angular.module('docsApp', [
	'ngAnimate',
	'ngRoute',
	'pagesData'
])
.controller('LeftbarController', LeftbarController)
.config(function ($routeProvider, pagesDataProvider) {
	var pages = pagesDataProvider.pages;
	var basePath = '/';

	$routeProvider.when('/index', {
		templateUrl: 'app-index.html',
		controller: ['$scope', 'readmeContent', function ($scope, readmeContent) {
			$scope.readmeContent = readmeContent;
		}],
		resolve: {
			readmeContent: ['$http', '$sce', function ($http, $sce) {
				return $http.get('https://cdn.rawgit.com/ngmobie/mobie/master/README.md').then(function (res) {
					return res.data;
				}).then(function (md) {
					return marked.parse(md);
				}).then(function (htmlCode) {
					var el = angular.element('<div>');
					el.html(htmlCode);
					_.forEach(el[0].querySelectorAll('#demo, #demo+p'), function (el) {
						el.style.display = 'none';
					});

					return el.html();
				}).then(function (htmlCode) {
					return $sce.trustAsHtml(htmlCode);
				});
			}]
		}
	});

	_(pages)
	.filter(function (page) {
		return page.area && page.module &&
					page.docType && page.name;
	})
	.forEach(function (page) {
		var routePath = pagesDataProvider.resolve(page);

		routePath = path.resolve(basePath, routePath);

		$routeProvider
		.when(routePath, {
			templateUrl: path.join('partials', page.partialPath + '.html')
		});
	})
	.value();

	$routeProvider.otherwise({
		redirectTo: '/index'
	});
});