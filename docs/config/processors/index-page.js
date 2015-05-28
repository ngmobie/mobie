"use strict";

var _ = require('lodash');
var path = require('canonical-path');

/**
 * @dgProcessor generateIndexPagesProcessor
 * @description
 * This processor creates docs that will be rendered as the index page for the app
 */
module.exports = function generateIndexPagesProcessor() {
  return {
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {
      docs.forEach(function (doc) {
        console.log(doc.moduleDoc)
      })
      docs.push({
        docType: 'indexPage',
        id: 'index',
        template: 'index-page.template.html'
      });
    }
  };
};