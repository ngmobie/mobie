describe('mobie.core.component', function () {
	var $rootScope, $timeout;
	beforeEach(module('mobie.core.component'))
	beforeEach(inject(function (_$rootScope_, _$timeout_) {
		$rootScope = _$rootScope_
		$timeout = _$timeout_
	}))

	describe('MbComponent', function () {
		var MbComponent;
		beforeEach(inject(function (_MbComponent_) {
			MbComponent = _MbComponent_;
			var el = angular.element('<div>')
			component = new MbComponent(el)
		}))

		it('should instantiate a new component', function () {
			assert.equal(MbComponent, component.constructor);
		})

		it('should set a component id', function () {
			var el = angular.element('<div>')
			var component = new MbComponent(el, 'my-component-id-here');
			assert.equal('my-component-id-here', component.id);
		})

		it('should emit an event when is visible', function () {
			component.on('visible', function () {
				this.fnCalled = true;
			})

			component.show()

			$rootScope.$digest()
			$timeout.flush();

			assert.ok(component.fnCalled)
		})

		it('should emit an event when is not visible', function () {
			component.on('notVisible', function () {
				this.fnCalled = true;
			})
			
			component.hide()

			$rootScope.$digest()
			$timeout.flush();

			assert.ok(component.fnCalled)
		})

		it('should return a promise', function (done) {
			var isVisible = false;
			var eventHasPassed = false;
			var el = angular.element('<my-component></my-component>');
			var component = new MbComponent(el)
			component.setId('my-component-id-here-3');
			component.on('visibleChangeStart', function () {
				eventHasPassed = true;
			})
			component.on('visible', function () {
				isVisible = true
			})
			component.show().then(function () {
				assert.ok(eventHasPassed);
				assert.ok(isVisible);
				done();
			});

			$rootScope.$digest()
			$timeout.flush()
		});

		it('should not have an id key by default', function () {
			var component = new MbComponent();
			assert.ok('undefined', typeof component.getId())
		})

		it('should define a component id once', function () {
			var component = new MbComponent();
			component.setId('my-comp01');
			assert.equal('my-comp01', component.id);

			assert.throws(function () {
				component.setId('my-comp02')
			})
		})

		it('should enter the element', function () {
			var myel = angular.element('<div class="my-el"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el'));
			assert.throws(function () {
				assert.ok(_myel_.length)
			})

			component.enterElement();

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el'));

			assert.ok(myel.length)
		})

		it('should emit an enter element events', function () {
			var myel = angular.element('<div class="my-el2"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el2'));
			assert.throws(function () {
				assert.ok(_myel_.length)
			})

			var enterElEvt = false,
					hasEntered = false;
			component.on('enterElementSuccess', function () {
				hasEntered = true;
			})
			component.on('enterElementStart', function () {
				enterElEvt = true;
			})

			component.enterElement();

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el2'));

			assert.ok(myel.length)
			assert.ok(enterElEvt)
		})

		it('should leave the element', function () {
			var myel = angular.element('<div class="my-el3"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el3'));
			assert.throws(function () {
				assert.ok(_myel_.length)
			})

			component.enterElement();

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el3'));

			assert.ok(myel.length)

			component.leaveElement()

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el3'));

			assert.equal(null, myel[0]);
		})
	})
})