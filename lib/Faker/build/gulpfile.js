/*

  gulpfile.js - gulp script for building Faker package for browser / stand-alone package
  run this file using the gulp command
  
  If this is your first time trying to build faker, you will need to install gulp:

    cd faker.js/
    [sudo] npm install
    [sudo] npm install gulp -g
    cd build/
    gulp

*/

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mustache = require('gulp-mustache');
var browserify = require('browserify');
var transform = require('vinyl-transform');


gulp.task('browser-package', function() {

  /* task for building browser bundles using browserify

     this task will generate the following files:

      ./build/faker.js
      ./build/faker.min.js
      ../examples/browser/js/faker.js
      ../examples/browser/js/faker.min.js

  */

  var browserified = transform(function(filename) { 
    // use browserify to create UMD stand-alone browser package
    var b = browserify(filename, {
      standalone: 'faker'
    });
    return b.bundle();
  });

  return gulp.src('../index.js')
    .pipe(browserified)
    .pipe(rename('faker.js'))
    .pipe(gulp.dest('build/'))
    .pipe(gulp.dest('../examples/browser/js'))
    .pipe(rename({ extname: ".min.js" }))
    .pipe(uglify())
    .pipe(gulp.dest('build/'))
    .pipe(gulp.dest('../examples/browser/js'))
    .pipe(rename('../examples/browser/js/faker.min.js'));
});


// builds Readme.md file from docs.md and exported faker methods
gulp.task('documentation', function(cb) {

  /* task for generating documentation

     this task will generate the following file:

      ../Readme.md

  */

  var API = '';
  var faker = require('../index');

  // generate nice tree of api for docs
  for (var module in faker) {
    API += '* ' + module + '\n';
    for (var method in faker[module]) {
      API += '  * ' + method + '\n';
    }
  }

  return gulp.src('./src/docs.md')
    .pipe(mustache({
       'API': API,
       'startYear': 2010,
       'currentYear': new Date().getFullYear()
     }))
    .pipe(rename("./Readme.md"))
    .pipe(gulp.dest('../'))

});

gulp.task('default', ['browser-package', 'documentation']);