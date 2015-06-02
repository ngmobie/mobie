$AffixController.$inject = ['$scope', '$element', '$attrs', '$transclude', '$location', '$anchorScroll'];
function $AffixController ($scope, $element, $attrs, $transclude, $location, $anchorScroll) {
	var ctrl = this;
	var items = this.items = {};

	this.activeItem = {};

	this.activate = function (href) {
		ctrl.activeItem = ctrl.items[href];
	};

	this.updateHash = function () {
		$location.hash(this.activeItem.link);
	};

	this.go = function (href) {
		if(this.activeItem.link !== href) {
			this.activate(href);
			this.updateHash();
			$anchorScroll();
		}
	};

	this.set = function (href, obj) {
		this.items[href] = obj;
	};

	this.setDisabled = function (href) {
		this.activeItem = {};
	};

	this.isActive = function (href) {
		return this.activeItem === this.items[href];
	};

	// when the user loads the page
	// for the first time
	var unwatch = $scope.$watch(function () {
		return $location.hash();
	}, function (hash) {
		if(hash !== '') {
			$scope.$$postDigest(function () {
				ctrl.go(hash);
			});
		}

		unwatch();
	});

	$scope.$on('$affixChanged', function (href) {
		ctrl.updateHash();
	});

	$scope.$watch(function () {
		return ctrl.activeItem.link;
	}, function (href, oldHref) {
		if(href === oldHref) {
			return;
		}

		if(_.isString(href)) {
			$scope.$emit('$affixChanged', ctrl.activeItem);
		}
	});
}

function AffixDirective () {
	return {
		controller: $AffixController,
		controllerAs: 'mbAffixCtrl'
	};
}

AffixHrefDirective.$inject = ['$animate'];
function AffixHrefDirective ($animate) {
	return {
		scope: {
			href: '@mbAffixHref'
		},
		require: '?^mbAffix',
		link: function (scope, element, attrs, mbAffix) {
			if(!mbAffix) {
				return;
			}

			element.on('click', function () {
				scope.$apply(function () {
					mbAffix.go(scope.href);
				});
			});

			scope.$watch(function () {
				return mbAffix.activeItem.link;
			}, function (href, oldHref) {
				if(href === oldHref) {
					return;
				}

				var isActive = (href === scope.href);

				$animate[isActive ? 'addClass' : 'removeClass'](element.parent('li'), 'mb-affix-active');
			});
		}
	};
}

AffixContentDirective.$inject = ['$window', '$animate'];
function AffixContentDirective ($window, $animate) {
	$window = angular.element($window);

	function preLink (scope, element, attrs, mbAffix) {
		if(!mbAffix) {
			return;
		}

		if(_.isUndefined(scope.example)) {
			scope.example = true;
		}

		mbAffix.set(scope.href, {
			isActive: false,
			link: scope.href,
			example: scope.example
		});
	}

	function postLink (scope, element, attrs, mbAffix) {
		if(!mbAffix) {
			return;
		}

		function onScroll () {
			var isActive = false;

			var offset = element.offset();
			var pageYOffset = window.pageYOffset;

			// Out of range
			if(pageYOffset > offset.top + element.height()) {
				return;
			}

			if(pageYOffset < element.prop('offsetTop')) {
				isActive = false;
			} else {
				isActive = true;
			}

			if(mbAffix.isActive(scope.href) === isActive) {
				return;
			}

			scope.$apply(function () {
				mbAffix[isActive ? 'activate' : 'setDisabled'](scope.href);
			});
		}

		scope.$watch(function () {
			return mbAffix.isActive(scope.href);
		}, function (isActive) {
			$animate[isActive ? 'addClass' : 'removeClass'](element, 'mb-affix-active');
		});

		$window.on('scroll', onScroll);

		scope.$on('$destroy', function () {
			$window.off('scroll', onScroll);
		});

		// Put the link in the first heading of the element content
		var firstHeadingEl = angular.element(element[0].querySelector('h1,h2,h3,h4,h5,h6'));
		firstHeadingEl.attr('id', scope.href);

		var anchorEl = angular.element('<a>');
		anchorEl.on('click', function () {
			scope.$apply(function () {
				mbAffix.go(scope.href);
			});
		});
		
		var headingText = firstHeadingEl.text();
		anchorEl.text(headingText);

		firstHeadingEl.text('');
		firstHeadingEl.prepend(anchorEl);
	}

	return {
		require: '?^mbAffix',
		scope: {
			href: '=mbAffixId',
			example: '=mbHasExample'
		},
		compile: function () {
			return {
				pre: preLink,
				post: postLink
			};
		}
	};
}

function AffixColumnDirective () {
	return function (scope, element, attrs) {
		window.addEventListener('scroll', function () {
			var boundingClientRect = element[0].getBoundingClientRect();
			var olderWidth = boundingClientRect.width;

			if(boundingClientRect.top <= window.scrollY) {
				element[0].style.position = 'fixed';
				element[0].style.top = '20px';
				element[0].style.width = olderWidth + 'px';
				element.addClass('mb-affix-column-fixed');
			} else {
				element[0].style.position = '';
				element[0].style.width = '';
				element.removeClass('mb-affix-column-fixed');
			}
		});
	}
}

AffixMobileTemplateDirective.$inject = ['$animate'];
function AffixMobileTemplateDirective ($animate) {
	return {
		require: '?^mbAffix',
		template: '<div ng-repeat="(key, item) in _$items$_" id="{{ item.link }}" class="phone-example-right">' +
			'<iframe ng-src="{{item.mobileTemplatePath}}"></iframe>' +
		'</div>',
		link: function (scope, element, attrs, mbAffix) {
			if(!mbAffix) {
				return;
			}

			scope._$items$_ = {};

			scope.$watchCollection(function () {
				return mbAffix.items;
			}, function (items) {
				scope._$items$_ = _(items).map(function (item) {
					var itemName = String(item.link).toLowerCase();
					var mobileTemplatePath = [itemName, 'mobile', 'html'].join('.');
					item.mobileTemplatePath = path.join('examples', mobileTemplatePath);

					return item;
				}).value()
			});

			var itemEl;
			scope.$watch('template', function (itemLink) {
				if(itemEl) {
					$animate.removeClass(itemEl, 'mb-affix-active');
				}

				itemEl = element[0].querySelector('#' + itemLink);

				if(!itemEl) {
					return;
				}
				
				$animate.addClass(itemEl, 'mb-affix-active');
			});

			scope.$on('$affixChanged', function (event, item) {
				if(item.example) {
					$animate.setClass(element, 'mb-visible', 'mb-hidden');
					scope.template = item.link;
				} else {
					$animate.setClass(element, 'mb-hidden', 'mb-visible');
				}
			});
		}
	};
}

angular.module('docsApp.affix', [])
.config(['$anchorScrollProvider', function ($anchorScrollProvider) {
	$anchorScrollProvider.disableAutoScrolling();
}])
.directive('mbAffixHref', AffixHrefDirective)
.directive('mbAffixColumn', AffixColumnDirective)
.directive('mbAffix', AffixDirective)
.directive('mbAffixContent', AffixContentDirective)
.directive('mbAffixMobileTemplate', AffixMobileTemplateDirective)