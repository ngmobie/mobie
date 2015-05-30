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

	function $MbScrollFactory ($window, Helpers) {
		var windowEl = angular.element($window);
		var bodyEl = windowEl[0].document.body;

		var MbScroll = Helpers.createClass({
			initialize: function () {
				var self = this;

				windowEl.on('scroll', function (evt) {
					self.emit('scroll', evt);
				});

				var lastScrollTop;
				self.on('scroll', function (evt) {
					var currentScrollTop = bodyEl.scrollTop;
					if(currentScrollTop === 0) {
						self.emit('scrollTop', evt);
					}
					if(currentScrollTop > lastScrollTop) {
						self.emit('scrollDown', evt);
					} else {
						self.emit('scrollUp', evt);
					}
					lastScrollTop = currentScrollTop;
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