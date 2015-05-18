describe('mobie.core.helpers', function () {
	describe('Helpers', function () {
		var Helpers;

		beforeEach(module('mobie.core.helpers'));
		beforeEach(inject(function (_Helpers_) {
			Helpers = _Helpers_;
		}))

		it('should create classes', function () {
			assert.doesNotThrow(function () {
				var MyClass = Helpers.createClass();
				new MyClass();
			})
		})

		it('should trigger initialize function', function () {
			var MyClass = Helpers.createClass({
				initialize: function () {
					this.called = true;
				}
			});

			var AnotherClass = MyClass.extend({
				someValue: true
			});

			var anotherClass = new AnotherClass();

			assert.ok(anotherClass.someValue);
			assert.ok(anotherClass.called);
		})

		it('should extend static props', function () {
			var MyClass = Helpers.createClass({
				protoProp: 1
			}, {
				staticProp: function () {
					throw new Error('dont use me')
				}
			})

			var myClass = new MyClass()

			assert.throws(function () {
				MyClass.staticProp()
			})

			assert.equal(myClass.protoProp, 1)
		})
	});
});