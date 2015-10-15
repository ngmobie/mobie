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
						text: msg,
						buttons: [{
							text: 'OK'
						}]
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

					return $scope.showMessage(user.name + ', deleted!');
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
									scope.close().then(function () {
										return $scope.dropUser(user);
									});
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

	function $MbActionSheetFactory (MbActionSheet) {
		function _MbActionSheet () {
			MbActionSheet.call(this);

			var scope = this.scope;
			scope.cancelTextButton = defaults.cancelTextButton;
			scope.$$close = scope.close = function () {
				return this.hide();
			}.bind(this);
		}

		inherits(_MbActionSheet, MbActionSheet, {
			defaults: defaults
		});

		return new _MbActionSheet();
	}
}

angular.module('mobie.components.action-sheet', [
	'mobie.components.backdrop',
	'mobie.core.component',
	'mobie.core.helpers'
])
.factory('MbActionSheet', function ($mbBackdrop, MbPopup) {
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
	function MbActionSheet() {
		MbPopup.call(this);

		var node = $mbBackdrop.element[0];

		var ON_CLICK = function (e) {
			if(e.target == node) {
				this._close();
			}
		}.bind(this);

		var ON_KEYDOWN = function(e) {
			if(e.keyCode === 27) {
				this._close();
			}
		}.bind(this);

		this
	  .on('notVisibleChangeStart', function () {
			$mbBackdrop.hide();
		})
		.on('visibleChangeStart', function () {
			$mbBackdrop.show();
		})
		.on('bindEvents', function () {
			if(this.scope.backdropEvents) {
				node.addEventListener('click', ON_CLICK);
			}
			if(this.scope.escapeKey) {
				node.addEventListener('keydown', ON_KEYDOWN);
			}
		})
		.on('unbindEvents', function () {
			node.removeEventListener('click', ON_CLICK);
		});
		this.defaultScopeAttrs.groups = [];
		this.defaultScopeAttrs.noCancelButton = false;
	}

	inherits(MbActionSheet, MbPopup, {
		_close: function() {
			this.digest(function() {
				this.hide();
			});
		},

		configureScope: function (scope) {
			var groups = scope.groups;
			var buttons = scope.buttons;

			if(groups && groups.length < 1 && buttons) {
				this.noGroupApproach(scope, buttons);
			}

			angular.forEach(groups, function(group){
				this.configureButtons(group.buttons);
			}.bind(this));
	  },

	  noGroupApproach: function (scope, buttons) {
	  	var title = scope.title;
	  	var groups = scope.groups;

	  	var group = {
	  		title: title,
	  		buttons: buttons
	  	};

	  	groups.push(group);
	  }
	});

	return MbActionSheet;
})
.provider('$mbActionSheet', $MbActionSheetProvider);