describe('mobie.core.component', function () {
	describe('MbComponent', function () {
		beforeEach(module('mobie.core.component'))

		var MbComponent;
		beforeEach(inject(function (_MbComponent_) {
			MbComponent = _MbComponent_;
		}))

		it('should instantiate a new component', function () {
			var el = angular.element('<div>')
			var component = new MbComponent(el);
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
	})
})