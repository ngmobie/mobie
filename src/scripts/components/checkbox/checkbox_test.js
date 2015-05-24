angular.module('checkbox-test', [])
.run(function ($templateCache) {
	$templateCache.put('components/checkbox/checkbox.html', '<label class="item item-checkbox">' +
		'<div class="checkbox checkbox-circle">' +
			'<input type="checkbox"/>' +
		'</div>' +
		'<div class="item-content" ng-bind="content"></div>' +
	'</label>');
})
describe('mobie.components.checkbox', function () {
	var $rootScope, $compile, $animate;
	beforeEach(module('ngAnimateMock'))
	beforeEach(module('checkbox-test'));
	beforeEach(module('mobie.components.checkbox'));
	beforeEach(inject(function (_$rootScope_, _$animate_, _$compile_) {
		$rootScope = _$rootScope_;
		$animate = _$animate_;
		$compile = _$compile_
	}))
	describe('mbCheckbox directive', function () {
		it('should support ngModel directive', function () {
			var scope = $rootScope.$new();
			var tpl = '<div class="list">' +
				'<div mb-checkbox ng-model="checkbox" content="{{ checkboxContent }}"></div>'
			'</div>';
			scope.checkbox = false;
			scope.checkboxContent = 'My checkbox content';
			scope.$apply();
			var el = $compile(tpl)(scope);

			$rootScope.$digest();

			assert.equal(false, el.hasClass('mb-checked'))

			scope.checkbox = true;

			scope.$apply();
			$animate.triggerCallbacks()

			var mbCheckbox = angular.element(el[0].querySelector('[mb-checkbox]'));

			assert.ok(mbCheckbox.hasClass('mb-checked'));

			scope.checkbox = false;

			$rootScope.$digest()
			$animate.triggerCallbacks()

			assert.equal(false, mbCheckbox.hasClass('mb-checked'))
		})
		it('should add class to the directive when the input is checked', function () {
			var scope = $rootScope.$new();
			var tpl = '<div class="list">' +
				'<div mb-checkbox content="{{ checkboxContent }}"></div>'
			'</div>';
			scope.checkboxContent = 'My checkbox content';
			scope.$apply();
			var el = $compile(tpl)(scope);

			$rootScope.$digest();

			assert.equal(scope.checkboxContent, el.children('[ng-bind="content"]').text())

			var inputEl = el[0].querySelector('input');

			inputEl.checked = true;

			$rootScope.$digest()
			$animate.triggerCallbacks()

			assert.ok(angular.element(el[0].querySelector('[mb-checkbox]')).hasClass('mb-checked'));
			
			inputEl.checked = false;

			$rootScope.$digest()
			$animate.triggerCallbacks()
			
			assert.equal(false, angular.element(el[0].querySelector('[mb-checkbox]')).hasClass('mb-checked'));
		})
		it('should render a mbCheckbox', function () {
			var scope = $rootScope.$new();
			var tpl = '<div class="list">' +
				'<div mb-checkbox content="{{ checkboxContent }}"></div>'
			'</div>';
			scope.checkboxContent = 'My checkbox content';
			scope.$apply();
			var el = $compile(tpl)(scope);

			$rootScope.$digest();

			assert.equal(scope.checkboxContent, el.children('[ng-bind="content"]').text())
		})
	});
});