function $MbModalProvider () {
	var defaults = this.defaults = {
		templateUrl: 'components/modal/modal.html'
	};

	function $MbModalFactory ($mbComponent) {
		var bodyEl = angular.element(document.body);

		return function (options) {
			options = angular.extend({}, defaults, options);
			var scope = options.scope;
			var $mbModal = $mbComponent(options);
			return $mbModal;
		};
	}

	this.$get = $MbModalFactory;
}

angular.module('mobie.components.modal', [
	'mobie.core.component'
])
.provider('$mbModal', $MbModalProvider);