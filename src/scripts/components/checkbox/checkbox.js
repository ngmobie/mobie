function CheckboxDirective () {
	return {
		controller: function ($scope, $element, $attrs, $animate, Helpers) {
			var self = this;
			var inputEl = angular.element($element[0].querySelector('input'));

			self.isChecked = inputEl.prop('checked');

			$scope.$watch(function () {
				return self.isChecked;
			}, function (isChecked) {
				inputEl.prop('checked', isChecked);
			});

			$scope.$watch(function () {
				return inputEl.prop('checked');
			}, function (isChecked, isCheckedOld) {
				if(isChecked === isCheckedOld) {
					return;
				}

				self.isChecked = isChecked;

				$animate[isChecked ? 'addClass' : 'removeClass']($element, 'mb-checked');
			});

			function onChangeCheckbox () {
				Helpers.safeDigest($scope);
			}

			inputEl.on('change', onChangeCheckbox);

			$scope.$on('$destroy', function () {
				inputEl.off('change', onChangeCheckbox);
			});
		},
		templateUrl: 'components/checkbox/checkbox.html',
		scope: {
			content: '@'
		}
	};
}

angular.module('mobie.components.checkbox', [
	'mobie.core.helpers'
])
.directive('input', function () {
	return {
		restrict: 'E',
		require: ['?^ngModel', '?^mbCheckbox'],
		link: function (scope, element, attrs, ctrls) {
			if(!ctrls[0] || !ctrls[1]) {
				return;
			}

			var ngModel = ctrls[0];
			var mbSidenav = ctrls[1];

			scope.$watch(function () {
				return ngModel.$viewValue;
			}, function (viewValue, viewValueOld) {
				if(viewValue === viewValueOld) {
					return;
				}

				mbSidenav.isChecked = viewValue;
			});

			scope.$watch(function () {
				return mbSidenav.isChecked;
			}, function (isChecked, isCheckedOld) {
				if(isChecked !== isCheckedOld) {
					ngModel.$setViewValue(isChecked);
					ngModel.$render();
				}
			});
		}
	};
})
.directive('mbCheckbox', CheckboxDirective)