function $MbModalProvider () {
	var defaults = this.defaults = {
		templateUrl: 'components/modal/modal.html',
		activeBodyClass: 'mb-modal-visible'
	};

	function $MbModalFactory ($mbComponent, $animate, $mbBackdrop, Helpers, $timeout) {
		var bodyEl = angular.element(document.body);

		return function (options) {
			options = angular.extend({}, defaults, options);
			var $mbModal = $mbComponent(options);
			var scope = options.scope;
			var component = $mbModal.component;

			component.on('visibleChangeStart', function () {
				$mbBackdrop.show();
				$animate.addClass(bodyEl, options.activeBodyClass);
			});

			component.on('notVisible', function () {
				Helpers.safeDigest(scope, function () {
					$timeout(function () {
						$mbBackdrop.hide();
					}, 250);
					
					$animate.removeClass(bodyEl, options.activeBodyClass);
				});
			});

			return $mbModal;
		};
	}

	this.$get = $MbModalFactory;
}

angular.module('mobie.components.modal', [
	'mobie.core.component',
	'mobie.core.helpers',
	'mobie.components.backdrop',
])
.provider('$mbModal', $MbModalProvider);