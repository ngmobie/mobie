var _ = require('lodash');

module.exports = function moduleDocsProcessor() {
  return {
    $runAfter: ['ids-computed', 'memberDocsProcessor'],
    $runBefore: ['computing-paths'],
    $process: function(docs) {
      _.forEach(docs, function (doc, index) {
        var module = {
          name: doc.module
        };

        docs[index].moduleDoc = module;
      });
    }
  };
};
