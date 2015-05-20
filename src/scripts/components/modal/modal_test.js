describe('mobie.components.modal', function () {
	var $mbModal, $rootScope, $animate;

	beforeEach(module('ngAnimateMock'))
	beforeEach(module('mobie.components.modal'));

	beforeEach(inject(function (_$mbModal_, _$rootScope_, _$animate_) {
		$rootScope = _$rootScope_;
		$animate = _$animate_;
		$mbModal = _$mbModal_;
	}));

	describe('$mbModal', function () {
		it('should remove component when scope is destroyed', function () {
			var scope = $rootScope.$new();
			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-modal>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-modal>';

			var modal = $mbModal({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			$rootScope.$digest();
			$animate.triggerCallbacks();

			assert.ok(modal.component.getElement());

			scope.$destroy();

			assert.equal(undefined, modal.component.getElement());
		})

		it('should recompile the modal before show', function () {
			var scope = $rootScope.$new();

			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-modal>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-modal>';

			var modal = $mbModal({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			$rootScope.$digest();
			$animate.triggerCallbacks();

			var mbModalEl = angular.element(document.querySelector('mb-modal'));

			var compiledTpl = 'that it, this is my modal template. and that is my value 1000';
			assert.equal(compiledTpl, mbModalEl.text());

			scope.obj = {
				value: 1001
			};

			scope.$apply();

			assert.equal(compiledTpl.replace('1000', '1001'), mbModalEl.text())
		});
	});
});