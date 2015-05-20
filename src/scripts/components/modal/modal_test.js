describe('mobie.components.modal', function () {
	var $rootScope, $animate, $mbModal;
	beforeEach(module('ngAnimateMock'))
	beforeEach(module('mobie.components.modal'))
	beforeEach(inject(function (_$rootScope_, _$animate_, _$mbModal_) {
		$rootScope = _$rootScope_
		$animate = _$animate_
		$mbModal = _$mbModal_
	}))

	describe('$mbModal factory', function () {
		it('should append mb-modal-visible class to body when is visible', function () {
			var scope = $rootScope.$new();

			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-my-component>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-my-component>';

			var modal = $mbModal({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			$rootScope.$digest();
			$animate.triggerCallbacks();

			var mbModalEl = angular.element(document.querySelector('mb-my-component'));

			var compiledTpl = 'that it, this is my modal template. and that is my value 1000';
			assert.equal(compiledTpl, mbModalEl.text());

			scope.obj = {
				value: 1001
			};

			scope.$apply();

			assert.equal(compiledTpl.replace('1000', '1001'), mbModalEl.text())

			assert.ok(angular.element(document.body).hasClass('mb-modal-visible'))
		})

		it('should remove mb-modal-visible class from body when is not visible', function () {
			var scope = $rootScope.$new();

			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-my-component>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-my-component>';

			var modal = $mbModal({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			$rootScope.$digest();
			$animate.triggerCallbacks();

			var mbModalEl = angular.element(document.querySelector('mb-my-component'));

			var compiledTpl = 'that it, this is my modal template. and that is my value 1000';
			assert.equal(compiledTpl, mbModalEl.text());

			scope.obj = {
				value: 1001
			};

			scope.$apply();

			assert.equal(compiledTpl.replace('1000', '1001'), mbModalEl.text())

			assert.ok(angular.element(document.body).hasClass('mb-modal-visible'))

			modal.hide();

			$rootScope.$digest()
			$animate.triggerCallbacks()

			assert.equal(false, angular.element(document.body).hasClass('mb-modal-visible'))
		})
	})
})