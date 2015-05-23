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
	var $animate, $rootScope, $compile, backdropEl;
	beforeEach(module('ngAnimateMock'))
	beforeEach(module('mobie.components.popup'))
	beforeEach(module('mbpopup-module'))
	beforeEach(inject(function (_$rootScope_, _$animate_, _$compile_, _$mbPopup_) {
		$rootScope = _$rootScope_;
		$animate = _$animate_;
		$mbPopup = _$mbPopup_;
		$compile = _$compile_;
		backdropEl = angular.element(document.querySelector('.backdrop'));
	}))
	describe('$mbPopup', function () {
		it('should auto enter the popup element', function () {
			assert.ok(angular.element(document.querySelector('.popup-container')).length)
		});
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
		it('should support multiple popups', inject(function ($timeout, $browser) {
			$mbPopup.show({
				text: 'hey, that is my text here'
			})

			var popupEl = angular.element(document.querySelector('.popup-container'));
			var popupElText = angular.element(popupEl[0].querySelector('[ng-bind="text"]'));

			assert.equal('hey, that is my text here', popupElText.text());
			assert.ok(backdropEl.hasClass('mb-visible'))

			$mbPopup.show({
				text: 'another text'
			})

			assert.equal('another text', angular.element(popupEl[0].querySelector('[ng-bind="text"]')).text())

			$mbPopup.hide();

			assert.ok(backdropEl.hasClass('mb-hidden'))
		}))
	});
});