function $MbModalProvider () {
	var defaults = this.defaults = {};

	function $MbModalFactory (MbComponent, $compile, $templateCache, $animate, $rootScope) {
		var bodyEl = angular.element(document.body);

		return function (options) {
			var $mbModal = {};

			$mbModal.options = options = angular.extend({}, defaults, options);

			if(angular.isUndefined(options.scope)) {
				options.scope = $rootScope.$new();
			}

			var scope = options.scope = options.scope.$new();
			var component = options.component = $mbModal.component = new MbComponent();

			angular.forEach(['show', 'hide', 'toggle'], function (key) {
				$mbModal[key] = function () {
					return component[key]();
				};
			});

			// Create the element
			// using provided
			// template/templateUrl
			if(angular.isDefined(options.templateUrl)) {
				options.template = $templateCache.get(options.templateUrl);
			}

			var el = options.el = angular.element(options.template);

			var modalLink = $mbModal.modalLink = $compile(el.contents());

			component.once('visibleChangeStart', function () {
				modalLink(scope);
			});

			$animate.enter(el, bodyEl);

			component.setElement(el);

			return $mbModal;
		};
	}

	this.$get = $MbModalFactory;
}

angular.module('mobie.components.modal', [
	'mobie.core.component'
])
.provider('$mbModal', $MbModalProvider);