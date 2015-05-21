# mobie

### Why mobie?

- Well optimized to be as fast as it can in any mobile device
- Run it anywhere, not only in Cordova Browser. (Safari, Chrome, Firefox, IE8+)
- Works in any router, without any router, you don't need to use `ui.router` or `ngRoute`, you can use whatever you want, wherever you want.

### Improving your application performance/bootstrap

#### Using `gulp-ng-templates`

To put all of your html templates in a js file to be used for `$templateCache` and spare your browser from requesting templates everytime you change your view

```js

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