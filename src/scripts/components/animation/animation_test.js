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

		it('should support mb-animation-duration attribute', function () {
			var tpl = '<div mb-animation="my-fucking-anim my-animation-of-fucking-2" mb-animation-duration="{{ animationDuration }}"></div>';
			var scope = $rootScope.$new();
			scope.animationDuration = 300;
			scope.$apply();

			var el = $compile(tpl)(scope);
			scope.$digest()

			assert.ok(/(mb-my-fucking-anim)(\ )(mb-my-animation-of-fucking-2)/.exec(el.attr('class')))
			assert.ok(el.hasClass('mb-my-fucking-anim'))
			assert.ok(el.hasClass('mb-my-animation-of-fucking-2'))
			assert.equal('300ms', el.css('-webkit-animation-duration'))
			assert.equal('300ms', el.css('-moz-animation-duration'))
			assert.equal('300ms', el.css('animation-duration'))

			scope.animationDuration = undefined;
			scope.$digest()

			assert.equal('', el.css('animation-duration'))
			assert.equal('', el.css('-webkit-animation-duration'))
			assert.equal('', el.css('-moz-animation-duration'))
		})
	})
})