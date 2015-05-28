angular.module('mobie.core.registry', [
	'mobie.core.helpers'
])
.factory('$mbComponentRegistry', function () {
	var components = [];

	var $mbComponentRegistry = {
		get: function (componentId) {
			var component;
			angular.forEach(components, function (_component_) {
				if(_component_.id === componentId) {
					component = _component_;
				}
			});
			if(angular.isUndefined(component)) {
				throw new Error('component "' + componentId + '" is not defined');
			}
			return component;
		},
		register: function (component, componentId) {
			if(angular.isUndefined(component.id) && angular.isUndefined(componentId)) {
				throw new Error('component must have a id key or you must specify one for this instance');
			}

			if(angular.isUndefined(component.id)) {
				component.id = componentId;
			}

			components.push(component);

			return deregister;

			function deregister () {
				var index = components.indexOf(component);
				if(index !== -1) {
					components.splice(index, 1);
				}
			}
		}
	};

	return $mbComponentRegistry;
});