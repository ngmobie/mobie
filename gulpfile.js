var log = require('gulp-util').log;
var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-ruby-sass');
var bower = require('bower');
var Dgeni = require('dgeni');
var cssmin = require('gulp-cssmin');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');
var pleeease = require('gulp-pleeease');
var ngAnnotate = require('gulp-ng-annotate');
var livereload = require('gulp-livereload');
var ngTemplates = require('gulp-ng-templates');

var paths = {
	templates: [
		'src/**/*.jade'
	],
	scripts: [
		'src/**/*.js',
		'!src/**/*_test.js'
	],
	stylesheets: ['stylesheets/**/*.scss'],
	docs: {
		scripts: ['docs/app/src/**/*.js'],
		assets: ['docs/app/assets/**/*.*'],
		templates: ['docs/app/src/**/*.html']
	}
};

gulp.task('docs-assets', function () {
	gulp.src(paths.docs.assets)
	.pipe(gulp.dest('build/docs'));
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

gulp.task('docs-mobie-build', function () {
	gulp.src([
		'build/mobie.js',
		'build/mobie.css',
		'build/mobie.tpl.js'
	])
	.pipe(gulp.dest('build/docs/lib'));
});

gulp.task('docs-deps', [
	'build',
	'docs-scripts',
	'docs-templates',
	'docs-assets',
	'docs-mobie-build'
], function (done) {
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

gulp.task('docs-build', ['docs-deps'], function () {
	var dgeni = new Dgeni([require('./docs/config')])
	return dgeni.generate();
});

gulp.task('docs-livereload', function () {
	livereload.listen();
	gulp.watch([
		'build/docs/{js,css,partials}/*.{js,css,html}',
		'build/docs/lib/mobie.*'
	]).on('change', livereload.changed);
});

gulp.task('docs-stylesheets', function () {
	sass('./docs/app/scss/app.scss')
	.pipe(cssmin())
	.pipe(gulp.dest('build/docs/css'));
});

gulp.task('docs-watch', ['docs-livereload'], function () {
	gulp.watch('docs/app/scss/**/*.scss', ['docs-stylesheets']);
	gulp.watch('docs/app/src/**/*.js', ['docs-scripts']);
	gulp.watch('docs/app/src/**/*.{html,jade}', ['docs-templates']);
	gulp.watch('docs/config/**/*.{js,html}', ['docs-build']);

	gulp.watch(paths.scripts, ['scripts', 'docs-mobie-build']);
	gulp.watch(paths.templates, ['templates', 'docs-mobie-build']);
	gulp.watch(paths.stylesheets, ['stylesheets', 'docs-mobie-build']);
});

var express = require('express');
gulp.task('docs-serve', ['docs-watch'], function () {
	var app = express();
	app.use(express.static('build/docs'));
	app.get('/', function (req, res) {
		res.render('index.html');
	});
	app.listen(8080, function () {
		console.log('Documentation server is running at 0.0.0.0:8080');
	});
});

gulp.task('docs-templates', function () {
	gulp.src(['docs/app/src/**/*.mobile.jade'])
	.pipe(jade())
	.pipe(gulp.dest('build/docs'));

	gulp.src(paths.docs.templates)
	.pipe(ngTemplates({
		module: 'docsApp',
		standalone: false,
		filename: 'templates.js'
	}))
	.pipe(gulp.dest('build/docs/js'));
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
		.pipe(cssmin())
		.pipe(gulp.dest('build'));
});

var scriptsHeaderObj = {
	header: `(function (document, window, angular, undefined) { 'use strict';`,
	footer: `}(document, window, angular, undefined))`
};

gulp.task('scripts-min', function () {
	gulp.src(paths.scripts)
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(concat('mobie.min.js'))
		.pipe(wrapper(scriptsHeaderObj))
		.pipe(gulp.dest('build'));
});

gulp.task('jshint', function () {
	gulp.src(paths.scripts.concat(paths.docs.scripts))
		.pipe(jshint({ lookup: true }))
		.pipe(jshint.reporter());
});

gulp.task('scripts', ['scripts-min'], function () {
	gulp.src(paths.scripts)
		.pipe(ngAnnotate())
		.pipe(uglify({
			mangle: false,
			output: {
				beautify: true,
			}
		}))
		.pipe(concat('mobie.js'))
		.pipe(wrapper(scriptsHeaderObj))
		.pipe(gulp.dest('build'));
});

gulp.task('build', ['scripts', 'templates', 'stylesheets']);
gulp.task('default', ['build', 'livereload', 'watch'])