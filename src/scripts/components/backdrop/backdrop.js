function BackdropFactory ($animate, $document) {
	var bodyEl = angular.element($document.body);

	var $mbBackdrop = {
		isVisible: false
	};

	var el = $mbBackdrop.el = angular.element('<div>');
	el.addClass('backdrop mb-backdrop');

	// Insert the backdrop in the body element
	$animate.enter(el, bodyEl);

	$mbBackdrop.show = function () {
		setVisibleState(true);
	};

	$mbBackdrop.hide = function () {
		setVisibleState(false);
	};

	$mbBackdrop.toggle = function () {
		var newVisibleState = !$mbBackdrop.isVisible;
		setVisibleState(newVisibleState);
	};

	function setVisibleState (visibleState) {
		$animate[visibleState ? 'addClass' : 'removeClass'](el, 'mb-visible');
	}

	return $mbBackdrop;
}

angular.module('mobie.components.backdrop', [])
.factory('$mbBackdrop', BackdropFactory);