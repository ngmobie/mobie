angular.module('mbpopup-module', [])
.config(function ($mbPopupProvider) {
	$mbPopupProvider.defaults.template = '<div class="popup-container">' +
		'<div class="popup">' +
			'<div class="popup-head">' +
				'<h3 class="popup-title" ng-bind="title"></h3>' +
			'</div>' +
			'<div class="popup-body" ng-show="text" ng-bind="text">' +
			'</div>' +
		'</div>'
	'</div>';
})

describe('mobie.components.popup', function () {
	var $animate, $rootScope, $compile, backdropEl, popupEl;

	beforeEach(module('ngAnimateMock'));
	beforeEach(module('mobie.components.popup'));
	beforeEach(module('mbpopup-module'));

	beforeEach(inject(function (_$rootScope_, _$animate_, _$compile_, _$mbPopup_) {
		$rootScope = _$rootScope_;
		$animate = _$animate_;
		$mbPopup = _$mbPopup_;
		$compile = _$compile_;
		backdropEl = angular.element(document.querySelector('.backdrop'));
		
		popupEl = angular.element(document.querySelector('.popup-container'));
	}));

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
			});

			$animate.triggerCallbacks();
			$rootScope.$digest();

			assert.ok(popupEl.hasClass('mb-visible'));
		});

		it('should support multiple popups', inject(function ($timeout, $browser) {
			$mbPopup.show({
				text: 'hey, that is my text here'
			});

			var popupElText = angular.element(popupEl[0].querySelector('[ng-bind="text"]'));

			$rootScope.$digest();

			assert.equal('hey, that is my text here', popupElText.text());

			$mbPopup.show({
				text: 'another text'
			});

			assert.equal('another text', angular.element(popupEl[0].querySelector('[ng-bind="text"]')).text());

			$mbPopup.hide();
			$rootScope.$digest();

			assert.ok(backdropEl.hasClass('mb-hidden'));
		}));
	});

	it('should just show the last popup if no option is defined or if the option parameter is a number type variable', function () {
		$mbPopup.show({
			text: 'This is a test'
		});

		$rootScope.$digest();

		assert.equal('This is a test', popupEl.text());

		var actualPopupId = $mbPopup.id;

		$mbPopup.hide();
		$rootScope.$digest();

		assert.equal(actualPopupId, $mbPopup.id);
		assert.ok(popupEl.hasClass('mb-hidden'));

		$mbPopup.hide();
		$animate.triggerCallbacks();
		$rootScope.$digest();

		assert.equal(actualPopupId, $mbPopup.lastId);

		$mbPopup.show();

		$animate.triggerCallbacks();
		$rootScope.$digest();

		assert.equal('This is a test', popupEl.text());
		assert.ok(popupEl.hasClass('mb-visible'));
	});
});