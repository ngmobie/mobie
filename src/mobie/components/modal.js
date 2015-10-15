function $MbModalProvider () {
	var defaults = this.defaults = {
		templateUrl: 'components/modal/modal.html',
		activeBodyClass: 'mb-modal-visible'
	};

	/**
	 * @ngdoc service
	 * @name $mbModal
	 *
	 * @description
	 *
	 * @example
	  <example module="modalExampleApp">
	  	<file name="index.html">
	  		<div class="bar bar-header bar-primary">
					<h3 class="title">Modal Example</h3>
	  		</div>
	  		<div class="padding" ng-controller="ModalController as modalCtrl">
	  			<p>
	  				<div class="button button-block" ng-click="modalCtrl.show()">Show modal</div>
	  			</p>
	  		</div>
	  	</file>
	  	<file name="app.js">
	  		angular.module('modalExampleApp', ['ngAnimate', 'mobie'])
	  		.controller('ModalController', ['$scope', '$mbModal', function ($scope, $mbModal) {
	  			var template = '<div class="modal" mb-animation="slide-in-up slide-out-down">' +
	  				'<div class="bar bar-header">' +
	  					'<h3 class="title">Modal Example</h3>' +
	  					'<button class="button button-clear button-primary" ng-click="modalCtrl.hide()">Fechar</button>' +
	  				'</div>' +
	  			'</div>';

	  			var modal = $mbModal({
	  				template: template,
	  				scope: $scope
	  			});

					this.show = function () {
						return modal.show();
					};

					this.hide = function () {
						return modal.hide();
					};
	  		}]);
	  	</file>
	  	<file name="app.css">
	  		@import "../../lib/mobie.css";
	  	</file>
	  </example>
	 */
	function $MbModalFactory (MbComponent, $animate, $mbBackdrop, $timeout) {
		var bodyElement = angular.element(document.body);

		function MbModal(options) {
			if(angular.isUndefined(options)) {
				options = {};
			}

			var options = mobie.defaults(options, defaults);

			MbComponent.call(this, options);

			var _this = this;

			var scope = this.scope;

			this.scope.$hide = function () {
				_this.postDigest(function () {
					return _this.hide();
				});
			};

			this.on('visibleChangeStart', this.appendBodyClass);

			this.on('notVisible', this.removeBodyClass);
		}

		inherits(MbModal, MbComponent, {
			appendBodyClass: function (remove) {
				this.digest(function() {
					$animate[remove ? 'removeClass' : 'addClass'](bodyElement, this.options.activeBodyClass);
				});

				return this;
			},

			removeBodyClass: function() {
				return this.appendBodyClass(true);
			}
		});

		return angular.extend(function (options) {
			return new MbModal(options);
		}, {
			MbModal: MbModal
		});
	}

	this.$get = $MbModalFactory;
}

angular.module('mobie.components.modal', [
	'mobie.core.component',
	'mobie.core.helpers',
	'mobie.components.backdrop'
])
.provider('$mbModal', $MbModalProvider);