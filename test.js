'use strict';

const {join} = require('path');

const noop = require('lodash/noop');
const runInDir = require('.');
const test = require('tape');

test('runInDir()', t => {
	runInDir(join(__dirname, 'node_modules'), () => {
		t.equal(
			process.cwd(),
			join(__dirname, 'node_modules'),
			'should change current working directory before invoking a function.'
		);
	});

	t.equal(
		process.cwd(),
		__dirname,
		'should restore the original value of `process.cwd()`.'
	);

	t.equal(
		runInDir('.', () => process.cwd()),
		__dirname,
		'should support a relative path.'
	);

	t.end();
});

test('Argument validation', t => {
	t.throws(
		() => runInDir(-0, noop),
		/^TypeError: Expected a <string> of a directory path, but got a non-string value -0\./u,
		'should fail when the first argument is not a string.'
	);

	t.throws(
		() => runInDir('', noop),
		/^Error: Expected a <string> of a directory path, but got '' \(empty string\)\./u,
		'should fail when the first argument is an empty string.'
	);

	t.throws(
		() => runInDir('abc', new Int8Array()),
		/^TypeError: Expected a <Function> to be run in .*abc, but got a non-function value Int8Array \[\]\./u,
		'should fail when the second argument is not a function.'
	);

	t.throws(
		() => runInDir(),
		/^RangeError: Expected 2 arguments \(<string>\[, <Function>\]\), but got no arguments\./u,
		'should fail when it takes no arguments.'
	);

	t.throws(
		() => runInDir('a', noop, 'b'),
		/^RangeError: Expected 2 arguments \(<string>\[, <Function>\]\), but got 3 arguments\./u,
		'should fail when it takes too many arguments.'
	);

	t.end();
});
