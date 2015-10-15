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
		}
	});

	return MbBackdrop;
})
.factory('$mbBackdrop', BackdropFactory);