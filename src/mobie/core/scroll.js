/**
 * @ngdoc service
 * @name $mbScroll
 * 
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

				self.on('scroll', function () {

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