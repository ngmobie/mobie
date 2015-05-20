describe('mobie.components.animation', function () {
	var $rootScope;
	beforeEach(module('mobie.components.animation'))
	beforeEach(inject(function (_$rootScope_, _$compile_) {
		$rootScope = _$rootScope_
		$compile = _$compile_
	}))
	describe('mbAnimation directive', function () {
		it('should add a class to an element', function () {
			var tpl = '<div mb-animation="my-fucking-anim"></div>';
			var scope = $rootScope.$new()
			var el = $compile(tpl)(scope);
			scope.$digest()

			assert.ok(el.hasClass('mb-my-fucking-anim'))
		})

		it('should support more than one class name', function () {
			var tpl = '<div mb-animation="my-fucking-anim my-animation-of-fucking-2"></div>';
			var scope = $rootScope.$new()
			var el = $compile(tpl)(scope);
			scope.$digest()

			assert.ok(/(mb-my-fucking-anim)(\ )(mb-my-animation-of-fucking-2)/.exec(el.attr('class')))
			assert.ok(el.hasClass('mb-my-fucking-anim'))
			assert.ok(el.hasClass('mb-my-animation-of-fucking-2'))
		})
	})
})