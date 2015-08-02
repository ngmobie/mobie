describe('mobie.core.helpers', function () {
	describe('Helpers', function () {
		beforeEach(module('mobie.core.helpers'));

		it('should generate an id', function () {
			assert.equal('number', typeof nextId())
		});
	});
});