function MbComponentFactory (MbComponentInterface, $animate) {
	var MbComponent = MbComponentInterface.extend({
		initialize: function (componentEl, id) {
			this.setElement(componentEl);
			this.isVisible = false;

			if(angular.isDefined(id)) {
				this.setId(id);
			}
		},
		show: function () {
			return this.setVisibleState(true);
		},
		hide: function () {
			return this.setVisibleState(false);
		},
		toggle: function () {
			return this.setVisibleState(!this.getVisibleState());
		},
		getVisibleState: function () {
			return !!this.isVisible;
		},
		setVisibleState: function (visibleState) {
			var self = this;

			var promise = $animate[visibleState ? 'addClass' : 'removeClass'](this.componentEl, 'mb-visible').then(function () {
				self.isVisible = visibleState;
			});
		},
		setId: function (id) {
			this.id = id;
		},
		getId: function () {
			return this.id;
		},
		setElement: function (componentEl) {
			this.componentEl = componentEl;
		}
	});

	return MbComponent;
}

function MbComponentInterface (Helpers) {
	var MbComponentInterface = Helpers.createClass({
		show: Helpers.notImplemented('show'),
		hide: Helpers.notImplemented('hide'),
		setElement: Helpers.notImplemented('setElement'),
		getElement: Helpers.notImplemented('getElement'),
		setId: Helpers.notImplemented('setId'),
		getId: Helpers.notImplemented('getId'),
		getVisibleState: Helpers.notImplemented('getVisibleState'),
		setVisibleState: Helpers.notImplemented('setVisibleState')
	});

	return MbComponentInterface;
}

angular.module('mobie.core.component', [
	'mobie.core.helpers'
])
.factory('MbComponentInterface', MbComponentInterface)
.factory('MbComponent', MbComponentFactory)