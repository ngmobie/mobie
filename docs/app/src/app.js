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
});