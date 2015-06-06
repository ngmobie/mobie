/**
 * @ngdoc type
 * @name mbSidenav.MbSidenavController
 */
function MbSidenavController ($scope, $element, $attrs, $transclude, $animate, Helpers, MbComponent, $mbComponentRegistry, $mbBackdrop, $mbSidenav, $window) {
	var bodyEl = angular.element($window.document.body),
			backdropEl = $mbBackdrop.getElement(),
			sidenavOptions = $mbSidenav.getOptions(),
			activeBodyClass = sidenavOptions.activeBodyClass;

	function digest(fn) {
		return Helpers.safeDigest($scope, fn);
	}

	function setVisibleState (visibleState) {
		digest(function () {
			$mbBackdrop[visibleState ? 'show' : 'hide']();

			if(angular.isString(activeBodyClass)) {
				$animate[visibleState ? 'addClass' : 'removeClass'](bodyEl, activeBodyClass);
			}
		});
	}

	function onClickListener(evt) {
		digest(function () {
			component.hide();
		});
	}

	var component = this.component = new MbComponent($element, {
		id: $attrs.componentId
	});

	$mbComponentRegistry.register(this.component);

	component.on('visibleChangeStart', function () {
		setVisibleState(true);
	});

	component.on('visible', function () {
		backdropEl.on('click', onClickListener);
	});

	component.on('notVisible', function () {
		backdropEl.off('click', onClickListener);
		setVisibleState(false);
	});
}

function CloseDirective () {
	return {
		require: '?^mbSidenav',
		link: function (scope, element, attrs, mbSidenav) {
			if(angular.isUndefined(mbSidenav)) {
				return;
			}

			element.on('click', function () {
				scope.$apply(function () {
					mbSidenav.component.hide();
				});
			});
		}
	};
}

function $MbSidenavProvider () {
	var defaults = this.defaults = {
		activeBodyClass: 'mb-sidenav-visible'
	};

	function $MbSidenavFactory ($mbComponentRegistry) {
		return angular.extend(function (componentId) {
			return $mbComponentRegistry.get(componentId);
		}, {
			getOptions: function () {
				return defaults;
			}
		});
	}
	this.$get = $MbSidenavFactory;
}

/**
 * @ngdoc directive
 * @name mbSidenav
 *
 * @example
 * In this example you can see a active and fully working sidenav strategy, a sidenav is married to the `$componentRegistry` and you can have how many sidenavs you want to. As long as you define the `componentId` attribute in the sidenav element.
  <example module="exampleApp">
  	<file name="index.html">
			<div class="sidenav" mb-sidenav data-component-id="sidenav-left" mb-animation="slide-in-left slide-out-left">
				<div class="bar bar-header">
					<h3 class="title">Sidenav Left</h3>
				</div>
			</div>

			<div class="sidenav sidenav-right" mb-sidenav data-component-id="sidenav-right" mb-animation="slide-in-right slide-out-right">
				<div class="bar bar-header">
					<h3 class="title">Sidenav Right</h3>
				</div>
			</div>

			<div class="sidenav sidenav-top" mb-sidenav data-component-id="sidenav-top" mb-animation="slide-in-up slide-out-down">
				<div class="bar bar-header">
					<h3 class="title">"Sidenav" Top</h3>
				</div>
			</div>

 			<div ng-controller="BarController as barCtrl">
				<div class="bar bar-header">
					<button class="button button-clear icon ion-navicon" ng-click="barCtrl.toggle()"></button>
					<h3 class="title">Content bar</h3>
					<button class="button button-clear icon ion-navicon" ng-click="barCtrl.toggleSecond()"></button>
				</div>

				<div class="row">
					<div class="col">
						<p>That is my content</p>

						<p>
							<button class="button button-block" ng-click="barCtrl.toggleTop()">Toggle Sidenav Top</button>
						<p>
					</div>
				</div>
			</div>
  	</file>
  	<file name="app.js">
  		angular.module('exampleApp', ['mobie', 'ngAnimate'])
  		.controller('BarController', ['$mbSidenav', function ($mbSidenav) {
				this.toggle = function () {
					return $mbSidenav('sidenav-left').toggle();
				};
				this.toggleSecond = function () {
					return $mbSidenav('sidenav-right').toggle();
				};
				this.toggleTop = function () {
					return $mbSidenav('sidenav-top').toggle();
				};
  		}]);
  	</file>
  	<file name="app.css">
			@import url("../../lib/mobie.css");
			@import url("../../lib/ionicons/css/ionicons.min.css");
			.sidenav-whatever.mb-visible,
			.sidenav-whatever.mb-visible-remove,
			.sidenav-whatever.mb-visible-remove-active {
			  bottom: 0;
			}
  	</file>
  </example>
 */
function SidenavDirective () {
	return {
		restrict: 'EA',
		scope: {},
		controller: 'MbSidenavController',
		controllerAs: 'mbSidenavCtrl'
	};
}

angular.module('mobie.components.sidenav', [
	'mobie.components.animation',
	'mobie.components.backdrop',
	'mobie.core.registry',
	'mobie.core.component',
	'mobie.core.helpers'
])
.directive('mbClose', CloseDirective)
.controller('MbSidenavController', MbSidenavController)
.provider('$mbSidenav', $MbSidenavProvider)
.directive('mbSidenav', SidenavDirective);