function HelpersFactory () {
	return {
		digest: function (scope, fn) {
			if(!_.isFunction (fn)) {
				fn = function () {};
			}

			if(scope.$$phase || scope.$root.$$phase) {
				fn(scope);
			} else {
				scope.$apply(fn);
			}
		}
	}
}

angular.module('docsApp.helpers', [])
.factory('Helpers', HelpersFactory);