angular.module('pagesData', [])
.provider('pagesData', function () {
	var pages = this.pages = {$ doc.pages | json $};

	this.resolve = function (page) {
		return path.join(page.area, page.module,	page.docType,	page.name);
	};

	this.$get = function () {
		return pages;
	};
});