// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');

var Package = require('dgeni').Package;

// Create and export a new Dgeni package called dgeni-example. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = new Package('mobie', [
  require('dgeni-packages/ngdoc'),
  require('dgeni-packages/nunjucks'),
  require('dgeni-packages/examples')
])

.factory(require('./services/deployments/default'))

.processor(require('./processors/module-docs'))
.processor(require('./processors/index-page'))
.processor(require('./processors/pages-data'))

.config(function (renderDocsProcessor) {
  renderDocsProcessor.extraData.git = {
    version: {
      branch: 'master',
      isSnapshot: true
    },
    info: {
      owner: 'ngmobie',
      repo: 'mobie'
    }
  };
})

// Configure our dgeni-example package. We can ask the Dgeni dependency injector
// to provide us with access to services and processors that we wish to configure
.config(function(log, readFilesProcessor, templateFinder, writeFilesProcessor) {

  // Set logging level
  log.level = 'info';

  // Specify the base path used when resolving relative paths to source and output files
  readFilesProcessor.basePath = path.resolve(__dirname, '../..');

  // Specify collections of source files that should contain the documentation to extract
  readFilesProcessor.sourceFiles = [
    {
      // Process all js files in `src` and its subfolders ...
      include: 'src/**/*.js',
      // When calculating the relative path to these files use this as the base path.
      // So `src/foo/bar.js` will have relative path of `foo/bar.js`
      basePath: 'src'
    }
  ];

  // Add a folder to search for our own templates to use when rendering docs
  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

  // Specify where the writeFilesProcessor will write our generated doc files
  writeFilesProcessor.outputFolder = 'build/docs';
})

.config(function (computePathsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['indexPage'],
    pathTemplate: '.',
    outputPathTemplate: '${id}.html'
  });
})

.config(function (
  generateExamplesProcessor,
  generateProtractorTestsProcessor,
  defaultDeployment) {
  generateExamplesProcessor.deployments = [
    defaultDeployment
  ];
  generateProtractorTestsProcessor.deployments = [
    defaultDeployment
  ];
});