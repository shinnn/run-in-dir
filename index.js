'use strict';

const {resolve} = require('path');
const {inspect} = require('util');

const inspectWithKind = require('inspect-with-kind');

const ARG_ERROR = 'Expected 2 arguments (<string>[, <Function>])';
const PATH_ERROR = 'Expected a <string> of a directory path';

module.exports = function runInDir(...args) {
	const argLen = args.length;

	if (argLen === 0) {
		const error = new RangeError(`${ARG_ERROR}, but got no arguments.`);
		error.code = 'ERR_MISSING_ARGS';

		throw error;
	}

	if (argLen !== 2) {
		const error = new RangeError(`${ARG_ERROR}, but got ${argLen} arguments.`);
		error.code = 'ERR_TOO_MANY_ARGS';

		throw error;
	}

	const [dir, fn] = args;

	if (typeof dir !== 'string') {
		const error = new TypeError(`${PATH_ERROR}, but got a non-string value ${inspectWithKind(dir)}.`);
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
		const error = new TypeError(`Expected a <Function> to be run in ${absoluteDir}, but got a non-function value ${inspectWithKind(fn)}.`);
		error.code = 'ERR_INVALID_ARG_TYPE';

		throw error;
	}

	if (inspect(fn).startsWith('[AsyncFunction')) {
		const error = new TypeError(`Expected a non-async <Function> to be run in ${absoluteDir}, but got an async function ${inspect(fn, {breakLength: Infinity})}.`);
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
