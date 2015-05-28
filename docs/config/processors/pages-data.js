var _ = require('lodash');

module.exports = function generatePagesDataProcessor () {
	return {
		$runBefore: ['rendering-docs'],
		$process: function (docs) {
			var pagesData = [];

			// We are only interested in docs that are in an area
      var pages = _.filter(docs, function(doc) {
        return doc.area;
      });

			_.forEach(docs, function (doc, index) {
				pagesData.push({
					partialPath: doc.path,
					aliases: doc.aliases,
					module: doc.module,
					area: doc.area,
					name: doc.name,
					docType: doc.docType
				});
			});

			docs.push({
				docType: 'pages-data',
				id: 'pages-data',
				template: 'pages-data.template.js',
				outputPath: 'js/pages-data.js',
				pages: pagesData
			});
		}
	};
};