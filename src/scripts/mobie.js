angular.module('mobie.components', [
	'mobie.components.animation',
	'mobie.components.sidenav',
	'mobie.components.backdrop',
	'mobie.components.popup',
	'mobie.components.modal',
	'mobie.components.icon'
]);

angular.module('mobie', [
	'mobie.core',
	'mobie.components'
]);

angular.module('mobie.core', [
	'mobie.core.helpers',
	'mobie.core.registry',
	'mobie.core.eventemitter',
	'mobie.core.component'
]);