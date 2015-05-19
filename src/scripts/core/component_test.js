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

			component = new MbComponent(el)
			component.setId('my-component-id-here-2')
			assert.equal('my-component-id-here-2', component.getId())
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
	})
})