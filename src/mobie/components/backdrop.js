function BackdropFactory (MbBackdrop) {
	return new MbBackdrop('default-backdrop');
}

angular.module('mobie.components.backdrop', [
	'mobie.core.component'
])
.factory('MbBackdrop', function(MbSimpleComponent, $q, $animate) {
	function MbBackdrop(id) {
		MbSimpleComponent.call(this);

		this.queue = [];
		this._queuePromise = null;

		this.setId(id, nextId());
		this.setElement(this.createBackdropElement());
		this.enterElement();
	}

	inherits(MbBackdrop, MbSimpleComponent, {
		createBackdropElement: function() {
			if(this.getElement()) {
				return this.getElement();
			}

			return angular.element(this.template);
		},

		template: '<div class="backdrop mb-backdrop"></div>',
		containerElement: angular.element(document.body),

		enterElement: function() {
			if(angular.isUndefined(this.getElement())) {
				throw new Error('element does not exists');
			}

			return $animate.enter(this.getElement(), this.containerElement);
		},

		operate: function(operation) {
			return this[operation.method].apply(this, operation.args);
		},

		run: function() {
			var promises = [];

			angular.forEach(this.queue, function(operation, index) {
				promises.push(this.operate(operation));

				this.queue.splice(index, 1);
			}, this);

			this._queuePromise = $q.all(promises).then(function() {
				this._queuePromise = null;

				if(this.queue.length > 0) {
					return this.finish();
				}
			}.bind(this));

			return this.finish();
		},

		finish: function() {
			if(this._queuePromise) {
				return this._queuePromise;
			}
			
			return this.run();
		},

		perform: function (method) {
			var args = mobie.toArray(arguments).slice(1);
			var operation = {
				method: method,
				args: args
			};

			this.queue.push(operation);

			return this.finish();
		},

		show: function() {
			return this.perform('setVisibleState', true);
		},

		hide: function() {
			return this.perform('setVisibleState', false);
		}
	});

	return MbBackdrop;
})
.factory('$mbBackdrop', BackdropFactory);