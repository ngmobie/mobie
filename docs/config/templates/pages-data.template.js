angular.module('pagesData', [])
.provider('pagesData', function () {
	var pages = this.pages = {$ doc.pages | json $}.map(function (page) {
		if(_.isString(page.partialPath)) {
			page.stateName = page.partialPath.replace(/\./g, '_').replace(/\//g, '.');
		}
		
		return page;
	});

	this.resolve = function (page) {
		return path.join(page.area, page.module,	page.docType,	page.name);
	};

	this.$get = function () {
		return pages;
	};
});