describe('mobie.components.backdrop', function () {
	describe('$mbBackdrop factory', function () {
		var $mbBackdrop, $rootScope, backdropEl;

		beforeEach(module('mobie.components.backdrop'))

		beforeEach(inject(function (_$mbBackdrop_, _$rootScope_, _$timeout_) {
			$mbBackdrop = _$mbBackdrop_
			$rootScope = _$rootScope_
			$timeout = _$timeout_
			backdropEl = document.body.querySelector('.backdrop');
		}))

		it('should show backdrop', function () {
			assert.equal(false, $mbBackdrop.getVisibleState());
			
			$mbBackdrop.show();
			$rootScope.$digest();
			$timeout.flush();
			
			assert.equal($mbBackdrop.getElement()[0], backdropEl)
			assert.ok($mbBackdrop.getVisibleState());
		})

		it('should have a default id', function () {
			assert.equal('default-backdrop', $mbBackdrop.getId())
		})
	})
})