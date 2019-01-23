'use strict';

const inspect = require('util').inspect;
const resolve = require('path').resolve;

const PATH_ERROR = 'Expected a <string> of a directory path';

module.exports = function runInDir(dir, fn) {
	if (typeof dir !== 'string') {
		const error = new TypeError(`${PATH_ERROR}, but got a non-string value ${inspect(dir)}.`);
		error.code = 'ERR_INVALID_ARG_TYPE';

		throw error;
	}

	if (dir.length === 0) {
		const error = new Error(`${PATH_ERROR}, but got '' (empty string).`);
		error.code = 'ERR_INVALID_ARG_VALUE';

		throw error;
	}

	const absoluteDir = resolve(dir);

	if (typeof fn !== 'function') {
		const error = new TypeError(`Expected a <Function> to be run in ${absoluteDir}, but got a non-function value ${inspect(fn)}.`);
		error.code = 'ERR_INVALID_ARG_TYPE';

		throw error;
	}

	const cwd = process.cwd();

	if (cwd === absoluteDir) {
		return fn();
	}

	process.chdir(absoluteDir);

	const result = fn();

	process.chdir(cwd);

	return result;
};
