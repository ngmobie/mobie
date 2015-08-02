/**
 * @ngdoc service
 * @name $mbActionSheet
 * @module mobie.components.action-sheet
 * 
 * @description
 * The Action Sheet is a slide-up pane that lets the user
 * choose from a set of options.
 *
 * There are easy ways to cancel out of the action sheet, such
 * as tapping the backdrop or even hitting escape on the keyboard
 * for desktop testing.
 *
 * @example
  <example module="actionSheetExampleApp">
  	<file name="index.html">
			<div class="bar bar-header bar-primary">
				<h3 class="title">Action Sheet Bar</h3>
			</div>
			<ul class="list" ng-controller="UserController as userCtrl">
				<a class="item" ng-repeat="user in users track by $index" ng-click="showOptions(user)">
					<div class="item-content">
						{{user.name}}
					</div>
				</a>
			</ul>
  	</file>
  	<file name="app.js">
  		var users = [];
			for(var i=0; i<50; i++) {
				users[i] = faker.helpers.createCard();
			}

  		angular.module('actionSheetExampleApp', ['ngAnimate', 'mobie'])
  		.controller('UserController', ['$scope', '$mbActionSheet', '$mbPopup', '$timeout', function ($scope, $mbActionSheet, $mbPopup, $timeout) {
  			$scope.users = users;

  			$scope.showMessage = function (msg, title) {
					return $mbPopup.show({
						title: title ? title : 'Hey',
						text: msg
					});
  			};

  			$scope.shareUser = function (user) {
					$timeout(function () {
						$scope.showMessage("It's done. " + user.name + ', shared!');
					}, 2000);
  			};

  			$scope.dropUser = function (user) {
					var index = $scope.users.indexOf(user);
					$scope.users.splice(index, 1);
					$timeout(function () {
						$scope.showMessage(user.name + ', deleted!');
					}, 2000);
  			};

				$scope.showOptions = function (user) {
					$mbActionSheet.show({
						title: user.name,
						buttons: [
							{
								text: 'Share',
								onTap: function (scope) {
									scope.close();
									$scope.shareUser(user);
								}
							},
							{
								text: 'Delete',
								classes: ['button-danger'],
								onTap: function (scope) {
									$scope.dropUser(user);
									scope.close();
								}
							}
						]
					});
				};
  		}]);
  	</file>
  	<file name="app.css">
  		@import url(../../lib/mobie.css);
  	</file>
  </example>
 */
function $MbActionSheetProvider () {
	var defaults = this.defaults = {
		templateUrl: 'mobie/components/action-sheet.html',
		activeBodyClass: 'mb-action-sheet-visible',
		cancelTextButton: 'Cancel'
	};

	this.$get = $MbActionSheetFactory;

	function $MbActionSheetFactory ($mbComponent, $rootScope, $mbBackdrop, $animate, $q, $timeout, $document) {
		var $mbActionSheet = {};
		var options = {
			scope: $rootScope.$new()
		};

		options = angular.extend({}, defaults, options);

		var mbComponent = $mbActionSheet.component = $mbComponent(options),
				component = mbComponent.component,
				el = component.getElement(),
				backdropEl = $mbBackdrop.getElement(),
				scope = options.scope;

		function onKeyUpFn (event) {
			if (event.which == 27) {
        scope.close();
      }
		}

		function onTabBackdropFn() {
			return asyncDigest().then(function () {
				return $mbActionSheet.hide();
			});
		}

		function defaultOnTapFn () {
			return asyncDigest().then(function () {
				return $mbActionSheet.hide();
			});
		}

		function apply(fn) {
			digest(scope, fn);
		}

		function asyncDigest () {
			return $q(function (resolve) {
				apply(function (scope) {
					resolve(scope);
				});
			});
		}

		function unbindEvents () {
			return asyncDigest().then(function () {
				backdropEl.off('click', onTabBackdropFn);
				$document.off('keyup', onKeyUpFn);
			});
		}

		function bindEvents () {
			return asyncDigest().then(function () {
				backdropEl.on('click', onTabBackdropFn);
				$document.on('keyup', onKeyUpFn);
			});
		}

		function setActiveBodyClass (isActive) {
			return asyncDigest().then(function () {
				return $animate[isActive ? 'addClass' : 'removeClass'](bodyEl, options.activeBodyClass);
			});
		}

		function setBackdrop (isActive) {
			return asyncDigest().then(function () {
				return $timeout(function () {
					return $mbBackdrop[isActive ? 'show' : 'hide']();
				}, (60 * 2) * 2);
			});
		}

		function getVisibleState () {
			return component.getVisibleState();
		}

		function setComponent (isActive) {
			return asyncDigest().then(function (){
				return component[isActive ? 'show' : 'hide']();
			});
		}

		/**
		 * @ngdoc method
		 * @name $mbActionSheet#hide
		 *
		 * @description
		 * Hide the actual action sheet
		 *
		 * @returns {Promise} Returns a promise which will be resolved
		 *   when the element shows
		 */
		function hide (notTouchBackdrop) {
			return $q.all([
				setComponent(false),
				setBackdrop(notTouchBackdrop),
				setActiveBodyClass(false)
			]).then(function () {
				unbindEvents();
				return scheduleVisibleStateListener('visible');
			});
		}

		function scopeReset () {
			scopeExtend({
				text: '',
				title: '',
				template: '',
				buttons: []
			});
		}

		function scopeExtend(options) {
			apply(function (scope) {
				angular.extend(scope, options);
			});
		}

		function scheduleVisibleStateListener(type) {
			type = angular.isString(type) ? type : 'notVisible';

			return $q(function (resolve) {
				component.once(type, function () {
					resolve();
				});
			});
		}

		/**
		 * @ngdoc method
		 * @name $mbActionSheet#show
		 *
		 * @description
		 * Create a new Action Sheet template
		 *
		 * @param {object} options Options of the action sheet
		 *
		 * @returns {Promise} Returns a promise which will be resolved
		 *   when the element hides
		 */
		function show (options) {
			// If the action sheet is visible
			// just hide with the `notTouchBackdrop`
			// option, and then, show it again, with
			// the new options
			if(getVisibleState()) {
				return hide(true).then(function () {
					return show(options);
				});
			}

			// Reset the actual scope, for we don't
			// want to get a undesired `title` option,
			// right?
			scopeReset();
			scopeExtend(options);
			angular.forEach(scope.buttons, function (btn, i) {
				if(!angular.isFunction(btn.onTap)) {
					btn.onTap = defaultOnTapFn;
				}
				if(angular.isArray(btn.classes)) {
					var classes = btn.classes;
					
					btn.classes = {};

					angular.forEach(classes, function (value) {
						btn.classes[value] = true;
					});
				}
			});

			return $q.all([
				setComponent(true),
				setBackdrop(true),
				setActiveBodyClass(true)
			]).then(function () {
				bindEvents();

				return scheduleVisibleStateListener('notVisible');
			});
		}

		$mbActionSheet.show = show;
		$mbActionSheet.hide = hide;

		scope.$$close = scope.close = function () {
			return $mbActionSheet.hide();
		};

		scope.cancelTextButton = defaults.cancelTextButton;
		scope.scope = scope;

		return $mbActionSheet;
	}
}

angular.module('mobie.components.action-sheet', [
	'mobie.components.backdrop',
	'mobie.core.component',
	'mobie.core.helpers'
])
.provider('$mbActionSheet', $MbActionSheetProvider);