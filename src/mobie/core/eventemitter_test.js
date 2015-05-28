describe('mobie.core', function () {
	describe('EventEmitter', function () {
		var EventEmitter;

		beforeEach(module('mobie.core.eventemitter'));

		beforeEach(inject(function (_EventEmitter_) {
			EventEmitter = _EventEmitter_
		}));

		it('should have EventEmitter', function () {
			assert.notEqual(EventEmitter, undefined);
		});

		it('should emit events', function () {
			var server = new EventEmitter();

			function listener (mydata) {
				assert.equal(mydata, 100);
			}

			server.on('myevent', listener);

			server.emit('myevent', 100);
		});

		it('should list listeners', function () {
			var server = new EventEmitter;

			function listener (mydata) {
				assert.ok(mydata === 100);
			}

			server.on('myevent', listener);

			server.emit('myevent', 100);

			assert.equal(listener, server.listeners('myevent')[0])
		});

		it('should support once time events', function () {
			var server = new EventEmitter;
			var counter = 0;

			function listener () {
				counter += 100;
			}

			server.once('increaseCounter', listener);

			assert.equal(counter, 0);

			server.emit('increaseCounter');

			assert.equal(counter, 100);

			server.emit('increaseCounter');

			assert.equal(counter, 100);
		});

		it('should remove listener', function () {
			var server = new EventEmitter;
			var counter = 0;

			function listener () {
				counter += 100;
			}

			server.on('increaseCounter', listener);

			assert.equal(counter, 0);

			server.emit('increaseCounter');

			assert.equal(counter, 100);

			server.removeListener('increaseCounter', listener);

			server.emit('increaseCounter');

			assert.equal(counter, 100);
		});

		it('should remove all listeners', function () {
			var server = new EventEmitter;
			var counter = 0;

			function listener1 () {
				counter += 100;
			}

			function listener2 () {
				counter += 100;
			}

			server.on('increaseCounter', listener1);
			server.on('increaseCounter', listener2);

			assert.equal(counter, 0);

			server.emit('increaseCounter');

			assert.equal(counter, 200);

			server.removeAllListeners('increaseCounter');

			server.emit('increaseCounter');

			assert.equal(counter, 200);
		});
	})
});