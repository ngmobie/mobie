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
	var $animate, $rootScope, $compile, $httpBackend, backdropEl, popupEl;

	beforeEach(module('ngAnimateMock'));
	beforeEach(module('mobie.components.popup'));
	beforeEach(module('mbpopup-module'));

	beforeEach(inject(function (_$rootScope_, _$animate_, _$compile_, _$mbPopup_, _$httpBackend_) {
		$rootScope = _$rootScope_;
		$animate = _$animate_;
		$mbPopup = _$mbPopup_;
		$compile = _$compile_;
		$httpBackend = _$httpBackend_;
		backdropEl = angular.element(document.querySelector('.backdrop'));
		
		popupEl = angular.element(document.querySelector('.popup-container'));
	}));

	describe('MbPopup', function() {
		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('should support async requests', inject(function(MbPopup) {
			$httpBackend.expectGET('my-popup-template.html').respond(200, '<div>My {{ component }} template</div>');

			function MyMbPopup() {
				MbPopup.call(this);
			}

			inherits(MyMbPopup, MbPopup, {
				defaults: {
					templateUrl: 'my-popup-template.html'
				}
			});

			var popup = new MyMbPopup();

			$httpBackend.flush();

			popup.show({ component: 'popup' });

			$animate.flush();
			$rootScope.$digest();

			assert.equal('My popup template', popup.el.text());
		}));
	});

	describe('$mbPopup', function () {
		it('should auto enter the popup element', function () {
			assert.ok(angular.element(document.querySelector('.popup-container')).length)
		});

		it('should show a popup without defining any buttons', function () {
			$mbPopup.show({
				text: 'some text',
				buttons: [
					{text: 'test'}
				]
			});

			$animate.flush();

			assert.equal('some text', document.querySelector('.popup-container').textContent);
		});

		it('should show a popup', function () {
			$mbPopup.show({
				text: 'my popup text',
				buttons: [{
					text: 'OK'
				}]
			});

			$animate.flush();
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
		$animate.flush();
		$rootScope.$digest();

		assert.equal(actualPopupId, $mbPopup.lastId);

		$mbPopup.show();

		$animate.flush();
		$rootScope.$digest();

		assert.equal('This is a test', popupEl.text());
		assert.ok(popupEl.hasClass('mb-visible'));
	});
});