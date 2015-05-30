# mobie

A library to help you to build a scalable mobile application using AngularJS and whatever you want. This project stylesheets is based on [Ionic Framework](https://github.com/driftyco/ionic/blob/master/scss/) and our components in [Angular Material](https://github.com/angular/material).

### Demo

Checkout a demo page [here](http://ngmobie.github.io/mobie-demo/#/app/index)

### Installation

```
bower install --save mobie
```

### Why mobie?

- Well optimized to be as fast as it can in any mobile device
- Run it anywhere, not only in Cordova Browser. (Safari, Chrome, Firefox, IE8+)
- Works in any router, without any router, you don't need to use `ui.router` or `ngRoute`, you can use whatever you want, wherever you want.

### Improving your application performance/bootstrap

#### Using `gulp-ng-templates`

To put all of your html templates in a js file to be used for `$templateCache` and spare your browser from requesting templates everytime you change your view

```js
var ngTemplates = require('gulp-ng-templates');
var paths = {
	templates: ['src/scripts/**/*.html']
};
gulp.task('templates', function () {
	gulp.src(paths.templates)
		.pipe(ngTemplates({
			module: 'myapp.templates',
			filename: 'templates.js',
			standalone: true //  -> angular.module('myapp.templates', [])
			// standalone: false -> angular.module('myapp.templates')
		}))
		.pipe(gulp.dest('www/js'));
});
```

#### Using `gulp-uncss`

```js
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var uncss = require('gulp-uncss');
var paths = {
	stylesheets: ['src/stylesheets/**/*.scss'],
	templates: ['src/scripts/**/*.html']
};
gulp.task('stylesheets', function () {
	gulp.src('src/stylesheets/app.scss')
		.pipe(sass())
		.pipe(uncss({
			html: glob.sync(paths.templates.concat(['http://localhost:3000']))
		}))
		.pipe(csso())
		.pipe(gulp.dest('www/css'));
});
```

### Improving your development experience

#### Use a template engine (like [Jade](http://jade-lang.com/))

```jade
doctype html
html(lang="en")
  head
    title= pageTitle
    script(type='text/javascript').
      if (foo) {
         bar(1 + 5)
      }
  body
    h1 Jade - node template engine
    #container.col
      if youAreUsingJade
        p You are amazing
      else
        p Get on it!
      p.
        Jade is a terse and simple
        templating language with a
        strong focus on performance
        and powerful features.
```

It's visibly more efficient while writing your templates to use a template engine and then build them to HTML, than developing in HTML directly, since all your template should pass through a task to endup in a JavaScript (you can catch a ride in this process), this way you spare more browser requests to HTML files. So you should just add one more process to the pipe/something else (if you decide to use [Grunt](http://gruntjs.com/)).

You can check a gulp task below, to help you understand how this process should be made:

```js
var jade = require('gulp-jade');

// (...)

gulp.task('templates', function () {
	gulp.src(paths.templates)
		.pipe(jade())
		.pipe(ngTemplates({
			// (...)
		}))
		.pipe(gulp.dest('www/js'));
```

#### You don't need a cli, use `gulp-livereload` and `express`

gulpfile.js
```js
var livereload = require('gulp-livereload');
var paths = {
	scripts: ['src/scripts/**/*.js'],
	templates: ['src/scripts/**/*.html']
};
gulp.task('livereload', function () {
	livereload.listen();
	gulp.watch('www/{css,js}/*.{css,js}').on('change', livereload.changed);
});
```

index.js
```js
var express = require('express');
var app = express();

app.use(express.static('www'));
app.get('/', function (req, res) {
	res.render('index.html');
});

app.listen(8080);
```

package.json
```js
{
	"main": "index.js"
}
```

```
node .
```

#### Browser as a platform (Cordova)

Type those commands 
```
cordova platform add browser
cordova prepare browser
```

And change `app.use(express.static('www'))` to `app.use(express.static('platforms/browser/www'))`, so you can use your browser as a platform and have access to all Cordova plugins or something close to this. It may prevent your application to break if you're using a plugin which only runs in a mobile device, like `plugin.google.maps`. Remember to always execute `cordova prepare browser` after change any file in your `www` folder, for Cordova will copy everything on her and put into `platforms/browser/www`.