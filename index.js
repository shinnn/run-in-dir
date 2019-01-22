'use strict';

var inspect = require('util').inspect;
var resolve = require('path').resolve;

var PATH_ERROR = 'Expected a <string> of a directory path';

module.exports = function runInDir(dir, fn) {
	if (typeof dir !== 'string') {
		var error0 = new TypeError(PATH_ERROR + ', but got a non-string value ' + inspect(dir) + '.');
		error0.code = 'ERR_INVALID_ARG_TYPE';

		throw error0;
	}

	if (dir.length === 0) {
		var error1 = new Error(PATH_ERROR + ', but got \'\' (empty string).');
		error1.code = 'ERR_INVALID_ARG_VALUE';

		throw error1;
	}

	var absoluteDir = resolve(dir);

	if (typeof fn !== 'function') {
		var error2 = new TypeError('Expected a <Function> to be run in ' + absoluteDir + ', but got a non-function value ' + inspect(fn) + '.');
		error2.code = 'ERR_INVALID_ARG_TYPE';

		throw error2;
	}

	var cwd = process.cwd();

	if (cwd === absoluteDir) {
		return fn();
	}

	process.chdir(absoluteDir);

	var result = fn();

	process.chdir(cwd);

	return result;
};
