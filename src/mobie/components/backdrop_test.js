describe('mobie.components.backdrop', function () {
	describe('$mbBackdrop', function () {
		var $mbBackdrop, $animate, $rootScope, backdropEl, MbBackdrop;

		beforeEach(module('ngAnimateMock'));
		beforeEach(module('mobie.components.backdrop'))

		beforeEach(inject(function (_$mbBackdrop_, _$rootScope_, _$animate_, _MbBackdrop_) {
			$mbBackdrop = _$mbBackdrop_;
			$rootScope = _$rootScope_;
			$animate = _$animate_;
			MbBackdrop = _MbBackdrop_;

			backdropEl = document.body.querySelector('.backdrop');
		}))

		it('should show backdrop', function () {
			assert.equal(false, $mbBackdrop.getVisibleState());
			
			$mbBackdrop.show();
			$animate.flush();
			
			assert.equal($mbBackdrop.getElement()[0], backdropEl)
			assert.ok($mbBackdrop.getVisibleState());
		});

		it('should have a default id', function () {
			assert.equal('default-backdrop', $mbBackdrop.getId())
		});

		describe('show()', function() {
			it('should queue operations', function() {
				var backdrop = new MbBackdrop();

				assert.equal(0, backdrop.queue.length);

				backdrop.show();
				backdrop.hide();

				assert.equal(1, backdrop.queue.length);

				backdrop.show();

				assert.equal(2, backdrop.queue.length);

				$animate.flush();

				assert.ok(backdrop.getElement().hasClass('mb-hidden'));

				assert.equal(1, backdrop.queue.length);

				$animate.flush();

				assert.ok(backdrop.getElement().hasClass('mb-visible'));

				assert.equal(0, backdrop.queue.length);
			});
		});
	})
})