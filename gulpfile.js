var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-ruby-sass');
var Dgeni = require('dgeni');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');
var pleeease = require('gulp-pleeease');
var ngAnnotate = require('gulp-ng-annotate');
var ngTemplates = require('gulp-ng-templates');

var paths = {
	templates: [
		'src/scripts/**/*.jade'
	],
	scripts: [
		'src/scripts/**/*.js',
		'!src/scripts/**/*_test.js'
	]
};

gulp.task('docs', function () {
	var dgeni = new Dgeni([require('./docs')])
	return dgeni.generate();
});

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
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(concat('mobie.js'))
		.pipe(wrapper({
			header: `(function (document, window, angular, undefined) { 'use strict';`,
			footer: `}(document, window, angular, undefined))`
		}))
		.pipe(gulp.dest('build'));
});