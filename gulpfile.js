var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var ngTemplates = require('gulp-ng-templates');
var pleeease = require('gulp-pleeease');

var paths = {
	templates: [
		'src/scripts/**/*.jade'
	],
	scripts: [
		'src/scripts/**/*.js',
		'!src/scripts/**/*_test.js'
	]
};

gulp.task('templates', function () {
	gulp.src(paths.templates)
		.pipe(jade())
		.pipe(ngTemplates({
			module: 'mobie',
			standalone: false,
			filename: 'mobie.tpl.js'
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('stylesheets', function () {
	sass('src/stylesheets/mobie.scss')
		.pipe(pleeease())
		.pipe(gulp.dest('build'));
});

gulp.task('scripts', function () {
	gulp.src(paths.scripts)
		.pipe(concat('mobie.js'))
		.pipe(gulp.dest('build'));
});