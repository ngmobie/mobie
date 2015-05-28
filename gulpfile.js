var log = require('gulp-util').log;
var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-ruby-sass');
var bower = require('bower');
var Dgeni = require('dgeni');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');
var pleeease = require('gulp-pleeease');
var ngAnnotate = require('gulp-ng-annotate');
var ngTemplates = require('gulp-ng-templates');

var paths = {
	templates: [
		'src/**/*.jade'
	],
	scripts: [
		'src/**/*.js',
		'!src/**/*_test.js'
	],
	docs: {
		scripts: ['docs/app/src/**/*.js'],
		assets: ['docs/app/assets/**/*.*']
	}
};

gulp.task('docs-assets', function () {
	gulp.src(paths.docs.assets)
	.pipe(gulp.dest('build/docs'))
});

gulp.task('docs-scripts', function () {
	gulp.src(paths.docs.scripts)
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(concat('app.js'))
	.pipe(wrapper({
		header: `(function (window, angular, undefined) {`,
		footer: `}(window, angular, undefined));`
	}))
	.pipe(gulp.dest('build/docs/js'));
});

gulp.task('docs-deps', ['build', 'docs-scripts', 'docs-assets'], function (done) {
	gulp.src([
		'build/mobie.js',
		'build/mobie.css',
		'build/mobie.tpl.js'
	])
	.pipe(gulp.dest('build/docs/lib'))

	var bowerTask = bower.commands.install([], {}, {
		directory: 'build/docs/lib'
	});

	bowerTask.on('log', function (result) {
		log('bower:', result.id, result.data.endpoint.name);
	});

	bowerTask.on('error', function (error) {
		log(error);
	});

	bowerTask.on('end', function () {
		done();
	});
});

gulp.task('docs-build', ['docs-deps', 'docs-scripts'], function () {
	var dgeni = new Dgeni([require('./docs/config')])
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
	sass('stylesheets/mobie.scss')
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

gulp.task('build', ['scripts', 'templates', 'stylesheets']);
gulp.task('default', ['build', 'livereload', 'watch'])