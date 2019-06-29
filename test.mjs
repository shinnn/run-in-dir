import {strict as assert} from 'assert';
import {dirname} from 'path';

import noop from 'lodash/noop';
import runInDir from '.';
import test from 'testit';

const originalCwd = process.cwd();
const dir = dirname(process.execPath);

test('change the current working directory only while invoking a function', () => {
	runInDir(dir, () => assert.equal(process.cwd(), dir));
	assert.equal(process.cwd(), originalCwd);
});

test('support a relative path', () => {
	assert.equal(runInDir('.', () => process.cwd()), originalCwd);
});

test('restore the current directory even if a function throws an error', () => {
	assert.throws(() => runInDir(dir, () => {
		throw new Error(`This error was thrown on purpose in ${process.cwd()}.`);
	}), {message: `This error was thrown on purpose in ${dir}.`});
	assert.equal(process.cwd(), originalCwd);
});

test('fail when the first argument is not a string', () => {
	assert.throws(() => runInDir(-0, noop), {
		name: 'TypeError',
		message: 'Expected a <string> of a directory path, but got a non-string value -0 (number).'
	});
});

test('fail when the first argument is an empty string', () => {
	assert.throws(() => runInDir('', noop), {
		message: 'Expected a <string> of a directory path, but got \'\' (empty string).'
	});
});

test('fail when the second argument is not a function', () => {
	assert.throws(() => runInDir('abc', new Int8Array()), {
		name: 'TypeError',
		message: /^Expected a <Function> to be run in .*abc, but got a non-function value Int8Array \[\]\.$/u
	});
});

test('fail when the second argument is an async function', () => {
	assert.throws(() => runInDir('abc', async () => {}), {
		name: 'TypeError',
		message: /^Expected a non-async <Function> to be run in .*abc, but got an async function \[AsyncFunction\]\.$/u
	});
});

test('fail when it takes no arguments', () => {
	assert.throws(() => runInDir(), {
		name: 'RangeError',
		message: 'Expected 2 arguments (<string>[, <Function>]), but got no arguments.'
	});
});

test('fail when it takes too many arguments', () => {
	assert.throws(() => runInDir('a', noop, 'b'), {
		name: 'RangeError',
		message: 'Expected 2 arguments (<string>[, <Function>]), but got 3 arguments.'
	});
});
