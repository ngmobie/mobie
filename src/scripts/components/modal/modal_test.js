describe('mobie.components.modal', function () {
	var $mbModal, $rootScope, $timeout;

	beforeEach(module('mobie.components.modal'));

	beforeEach(inject(function (_$mbModal_, _$rootScope_, _$timeout_) {
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;
		$mbModal = _$mbModal_;
	}));

	describe('$mbModal', function () {
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
			$timeout.flush()

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