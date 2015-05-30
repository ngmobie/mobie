describe('mobie.core.scroll', function () {
	var $mbScroll, $rootScope, bodyEl;

	beforeEach(module('mobie.core.scroll'));
	beforeEach(inject(function (_$mbScroll_, _$rootScope_) {
		$mbScroll = _$mbScroll_;
		$rootScope = _$rootScope_;
		bodyEl = window.document.body;

		$rootScope.$watch(function () {
			return window.document.body.scrollTop;
		}, function () {
			var evt = document.createEvent('Event');
			evt.initEvent('scroll', true, true);
			window.dispatchEvent(evt);
		});
	}));

	describe('$mbScroll', function () {
		it('should emit scroll events', function () {
			bodyEl.scrollTop += 10;

			var scrolled = false;
			$mbScroll.on('scroll', function () {
				scrolled = true;
			});
			$rootScope.$digest()
			assert.ok(scrolled);
		});
	});
});