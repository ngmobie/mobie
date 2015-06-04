var _ = require('lodash');
var es = require('event-stream');
var gutil = require('gulp-util');
var File = gutil.File;
var nunjucks = require('nunjucks');

module.exports = function (locals) {
	return es.map(function (file, callback) {
		nunjucks.compile(file.contents.toString()).render(locals, function (err, res) {
			if(err) {
				return callback(err);
			}

			file.contents = new Buffer(res);

			callback(null, file);
		})
	});
};