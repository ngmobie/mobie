angular.module('docsApp.footer', [])
.directive('mbFooterTemplate', function () {
	return {
		restrict: 'E',
		templateUrl: 'footer-template.html'
	}
});