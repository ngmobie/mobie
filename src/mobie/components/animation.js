/**
 * @ngdoc directive
 * @name mbAnimation
 * @restrict A
 *
 * @description 
 * Add to the element which will be animated when `mb-visible` and
 * `mb-hidden` class is removed and added animation classes.
 *
 * ## Mixin classes
 * All the components could be animateds or not. You can mix them, however you want.
 * So if you need that an component get animated on it's `visible` and not animated on
 * it's `hidden`, sure you can do it
 *
 * @example
  <example module="customAnimationExample">
  	<file name="index.html">
  		<div class="bar bar-header">
				<h3 class="title">Custom animation</h3>
  		</div>
  		<div class="list">
  			<div class="item item-input">
  				<input type="text" ng-model="msg" placeholder="Type a message here">
  			</div>
  		</div>
  		<div class="padding">
  			<p><div my-custom-component data-msg="{{msg}}"></div></p>
  		</div>
  	</file>
  	<file name="app.js">
  		angular.module('customAnimationExample', ['ngAnimate', 'mobie'])
  		.directive('myCustomComponent', ['MbComponent', function (MbComponent) {
				return {
					template: '<button ng-click="myCtrl.show()" class="button button-block">Show me up</button>',
					scope: {
						msg: '@'
					},
					controllerAs: 'myCtrl',
					controller: ['$scope', '$timeout', function ($scope, $timeout) {

						// Your component
						var myComponentTmp = '<div class="my-custom-component" mb-animation="zoom-in slide-out-left">' +
							'<div class="bar bar-header bar-primary">' +
								'<h3 class="title">My component</h3>' +
							'</div>' +
							'<div class="padding"><p>{{ msg || "Type a message in the next round" }}</p></div>' +
						'</div>';

						var component = new MbComponent({
							template: myComponentTmp,
							scope: $scope
						});

						this.show = function () {
							return component.show().then(function () {
								return $timeout(function () {
									return component.hide();
								}, 3000);
							});
						};
					}]
				};
  		}]);
  	</file>
  	<file name="app.css">
			@import url("../../lib/mobie.css");
			.my-custom-component {
				position: absolute;
				width: 100%;
				height: 100%;
				background-color: #fff;
				border-radius: 4px;
				z-index: 10;
			}
			.my-custom-component.mb-hidden {
				top: -9999px;
				left: -9999px;
			}
			.my-custom-component.mb-visible,
			.my-custom-component.mb-visible-add,
			.my-custom-component.mb-visible-remove,
			.my-custom-component.mb-hidden-add,
			.my-custom-component.mb-hidden-remove {
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
			}
  	</file>
  </example>
 *
 * All the animation names inside the `mb-animation` attribute, takes the `mb-`
 * prefixes, and are all added as a class in the element. So, if you have:
 * ```html
 * <div mb-animation="my-animation"></div>
 * ```
 *
 * The compiled element will be: 
 * ```html
 * <div mb-animation="my-animation" class="mb-my-animation"></div>
 * ```
 *
 * ## Animation names
 * There are many animations that can be used in many elements:
 *
 * ### Visible animations (`mb-visible`)
 * Animations executed when the component is being showed up.
 *
 * - slide-in-right
 * - slide-in-left
 * - slide-in-up
 * - slide-in-down
 * - zoom-in

 * ### Hidden animations (`mb-hidden`)
 * Animations executed when the component is being hidded.
 *
 * - slide-out-right
 * - slide-out-left
 * - slide-out-up
 * - slide-out-down
 * - zoom-out
 *
 * Each animation are a implementation of [Animate.css](https://daneden.github.io/animate.css/)
 * animation, adapted to AngularJS Animations.
 */
function AnimationDirective () {
	return function (scope, element, attrs) {
		var previousClass;

		function resolveClassName (newClassName) {
			previousClass = '';
			
			var classes = newClassName.split(/\ /),
					classesLength = classes.length;

			angular.forEach(classes, function (className, i) {
				previousClass += 'mb-' + className;
				if(i < classesLength) {
					previousClass += ' ';
				}
			});
		}

		function removeClass (className) {
			if(element.hasClass(className)) {
				element.removeClass(className);
			}
		}

		function addClass (className) {
			element.addClass(className);
		}

		attrs.$observe('mbAnimation', function (mbAnimation) {
			if(angular.isString(previousClass)) {
				removeClass(previousClass);
			}

			resolveClassName(mbAnimation);

			// If this element is a sidenav
			// just set the mbVisibleClass
			// option of the component
			addClass(previousClass);
		});
	};
}

angular.module('mobie.components.animation', [])
.directive('mbAnimationDuration', function () {
	return function postLink (scope, element, attrs) {
		function setAnimationDuration (ms) {
			if(!angular.isUndefined(ms) && ms !== '') {
				ms = ms + 'ms';
			}

			element.css('-webkit-animation-duration', ms);
			element.css('-moz-animation-duration', ms);
			element.css('animation-duration', ms);
		}

		attrs.$observe('mbAnimationDuration', function (ms) {
			if(angular.isUndefined(ms)) {
				return setAnimationDuration(undefined);
			}
			
			setAnimationDuration(ms);
		});
	};
})
.directive('mbAnimation', AnimationDirective);