angular.module('mbpopup-module', [])
.config(function ($mbPopupProvider) {
	$mbPopupProvider.defaults.template = '<div class="popup-container">' +
		'<div class="popup">' +
			'<div class="popup-head">' +
				'<h3 class="popup-title" ng-bind="title"></h3>' +
			'</div>' +
			'<div class="popup-body" ng-if="text" ng-bind="text">' +
			'</div>' +
		'</div>'
	'</div>';
})

describe('mobie.components.popup', function () {
	var $animate, $rootScope, $compile;
	beforeEach(module('ngAnimateMock'))
	beforeEach(module('mobie.components.popup'))
	beforeEach(module('mbpopup-module'))
	beforeEach(inject(function (_$rootScope_, _$animate_, _$compile_, _$mbPopup_) {
		$rootScope = _$rootScope_
		$animate = _$animate_
		$mbPopup = _$mbPopup_
		$compile = _$compile_
	}))
	describe('$mbPopup', function () {
		it('should show a popup', function () {
			$mbPopup.show({
				text: 'my popup text',
				buttons: [{
					text: 'OK'
				}]
			})

			$animate.triggerCallbacks()
			$rootScope.$digest()

			var popupEl = angular.element(document.querySelector('.popup-container'));

			assert.ok(popupEl.hasClass('mb-visible'));
		})
	});
});