# run-in-dir

[![npm version](https://img.shields.io/npm/v/run-in-dir.svg)](https://www.npmjs.com/package/run-in-dir)
[![Build Status](https://travis-ci.com/shinnn/run-in-dir.svg?branch=master)](https://travis-ci.com/shinnn/run-in-dir)
[![codecov](https://codecov.io/gh/shinnn/run-in-dir/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/run-in-dir)

Run a function with changing the current working directory to a given path

```javascript
const {resolve} = require('path');
const runInDir = require('run-in-dir');

process.cwd(); //=> /Users/shinnn/example
resolve('A'); //=> /Users/shinnn/example/A

runInDir('fixtures', () => {
  process.cwd(); //=> /Users/shinnn/example/fixtures
  resolve('A'); //=> /Users/shinnn/example/fixtures/A
});

process.cwd(); //=> /Users/shinnn/example
resolve('A'); //=> /Users/shinnn/example/A
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install run-in-dir
```

## API

```javascript
const runInDir = require('run-in-dir');
```

### runInDir(*dir*, *fn*)

*dir*: `string` (a directory path where *fn* will be invoked)  
*fn*: `Function` (a non-[async](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) one)  
Return: `any` (return value of *fn*)

It [changes the current working directory](https://nodejs.org/api/process.html#process_process_chdir_directory) to *dir*, call *fn* and immediately change back to the original working directory.

Note that the change of the current working directory is effective only in the current event loop.

```javascript
process.cwd(); //=> /Users/shinnn/example

runInDir('fixtures', () => {
  process.cwd(); //=> /Users/shinnn/example/fixtures

  process.nextTick(() => {
    process.cwd(); //=> /Users/shinnn/example (not '/Users/shinnn/example/fixtures')
  });
});
```

## License

[ISC License](./LICENSE) © 2019 Shinnosuke Watanabe
