/**
 * @ngdoc service
 * @name $mbScroll
 * @module mobie.core.scroll
 * @description
 * Emit events when you scroll the page.
 * 
 * `scroll` everytime you scroll, `scrollUp`
 * and `scrollDown` when you scroll in each
 * direction
 */
function $MbScrollProvider () {
	this.$get = $MbScrollFactory;

	var defaults = this.defaults = {
		scrollStoppedMs: 100
	};

	function $MbScrollFactory ($window, $timeout, Helpers) {
		var windowEl = angular.element($window);
		var bodyEl = windowEl[0].document.body;

		var MbScroll = Helpers.createClass({
			scrollStoppedFn: function (evt) {
				this.emit('scrollStop', evt);
			},

			initialize: function () {
				var self = this;

				windowEl.on('scroll', function (evt) {
					self.emit('scroll', evt);
				});
				
				this.on('scroll', this.onScroll);
				this.on('scrollStop', this.onScrollStop);

				Object.defineProperty(this, 'scrollY', {
					get: function () {
						return this.getScrollY();
					}
				});
			},

			/**
			 * @ngdoc method
			 * @name $mbScroll#getLastScrollY
			 * @description Return the last stored `window.scrollY`
			 *   which have been cached after the `scrollStop`
			 *   event
			 */
			getLastScrollY: function () {
				return this.lastScrollY;
			},
			
			setLastScrollY: function (lastScrollY) {
				this.lastScrollY = lastScrollY;
			},

			getScrollY: function () {
				return windowEl.prop('scrollY');
			},

			onScrollStop: function () {
				this.setLastScrollY(this.getScrollY());
			},
			
			onScroll: function (evt) {
				var currentScrollY = window.scrollY;
				var self = this;

				$timeout.cancel(this.scrollStoppedPromise);

				if(currentScrollY === 0) {
					this.emit('scrollTop', evt);
				}
				if(currentScrollY > this.lastScrollY) {
					this.emit('scrollDown', evt);
				} else {
					this.emit('scrollUp', evt);
				}

				this.scrollStoppedPromise = $timeout(defaults.scrollStoppedMs).then(function () {
					self.scrollStoppedFn(evt);
				});
			}
		});

		return new MbScroll();
	}
}

angular.module('mobie.core.scroll', [
	'mobie.core.helpers'
])
.provider('$mbScroll', $MbScrollProvider);