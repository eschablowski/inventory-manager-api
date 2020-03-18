'use strict';
const gutil = require('gulp-util');
const through = require('through2');
const parser = require('json-schema-ref-parser');

/**
 * Dereference a jsonschema
 */
function dereference(file, opts, cb) {
	parser.dereference(file.path, opts, (err, schema) => {
		if (err) {
			this.emit('error', new gutil.PluginError('gulp-jsonschema-deref', err, {fileName: file.path}));
		} else {
			file.contents = Buffer.from(JSON.stringify(schema));
			this.push(file);
		}
		cb();
	});
}

/**
 * Typical gulp plugin boilerplate
 */
module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-jsonschema-deref', 'Streaming not supported'));
			return;
		}

		try {
			dereference.call(this, file, opts, cb);
		} catch (err) {
			cb(new gutil.PluginError('gulp-jsonschema-deref', err));
		}
	});
};