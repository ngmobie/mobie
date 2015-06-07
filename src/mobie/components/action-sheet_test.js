describe('mobie.components.action-sheet', function () {
	var $rootScope, $animate, $mbActionSheet, $timeout;

	beforeEach(module('ngAnimateMock'));
	beforeEach(module('mobie'));
	beforeEach(inject(function (_$rootScope_, _$animate_, _$mbActionSheet_, _$timeout_) {
		$rootScope = _$rootScope_;
		$animate = _$animate_;
		$timeout = _$timeout_;
		$mbActionSheet = _$mbActionSheet_;
	}));

	describe('$actionSheet', function () {
		it('should show an action sheet', function () {
			$mbActionSheet.show({
				buttons: [{
					text: 'Button 1'
				}]
			});

			assert.ok(angular.element(document.querySelector('.action-sheet-wrapper')).hasClass('mb-visible'));
			assert.equal('Button 1', document.querySelector('.action-sheet-wrapper .button').textContent);
		});

		it('should support several shows', function () {
			for(var i=0; i<10; i++) {
				$mbActionSheet.show({
					buttons: [{
						text: 'Button ' + i
					}]
				});
				assert.equal('Button ' + i, document.querySelector('.action-sheet-wrapper .button').textContent);
			}
		});

		it('should return a promise which will be resolved when the user closes the component', function () {
			var finished = false;
			$mbActionSheet.show({
				buttons: [{
					text: 'Btn 1'
				}]
			}).then(function () {
				finished = true;
			});
			$animate.triggerCallbacks()
			$timeout.flush()

			assert.equal(false, finished);

			$mbActionSheet.hide();			
			$animate.triggerCallbacks()
			$timeout.flush();

			assert.ok(finished);
		});
	});
});