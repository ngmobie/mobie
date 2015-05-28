function BackdropFactory ($animate, MbComponent) {
	var bodyEl = angular.element(document.body);

	var el = angular.element('<div>');
	el.addClass('backdrop mb-backdrop');

	// Insert the backdrop in the body element
	$animate.enter(el, bodyEl);

	var $mbBackdrop = new MbComponent(el, 'default-backdrop');

	return $mbBackdrop;
}

angular.module('mobie.components.backdrop', [
	'mobie.core.component'
])
.factory('$mbBackdrop', BackdropFactory);