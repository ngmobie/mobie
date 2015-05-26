var _ = require('lodash');

module.exports = function generatePagesDataProcessor () {
	return {
		$runBefore: ['rendering-docs'],
		$process: function (docs) {
			var pagesData = [];

			_.forEach(docs, function (doc, index) {
				pagesData.push({
					partialPath: doc.path,
					aliases: doc.aliases,
					module: doc.module,
					area: doc.area,
					name: doc.name
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