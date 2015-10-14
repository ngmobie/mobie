describe('mobie.components.action-sheet', function () {
	var $rootScope, $animate, $mbActionSheet, $timeout, $httpBackend;

	beforeEach(module('ngAnimateMock'));
	beforeEach(module('mobie'));

	beforeEach(inject(function (_$rootScope_, _$animate_, _$mbActionSheet_, _$timeout_, _$httpBackend_) {
		$rootScope = _$rootScope_;
		$animate = _$animate_;
		$timeout = _$timeout_;
		$mbActionSheet = _$mbActionSheet_;
		$httpBackend = _$httpBackend_;
	}));

	describe('$actionSheet', function () {
		/*afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});*/

		it('should show an action sheet', function () {
			$mbActionSheet.show({
				buttons: [{
					text: 'Button 1'
				}]
			});
			
			$animate.triggerCallbacks();
			$rootScope.$digest();

			assert.ok(angular.element(document.querySelector('.action-sheet-wrapper')).hasClass('mb-visible'));
			assert.equal('Button 1', document.querySelector('.action-sheet-wrapper .button').textContent);
		});
	});
});