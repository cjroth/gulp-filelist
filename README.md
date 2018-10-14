# gulp-filelist

[![NPM Version](https://img.shields.io/npm/v/gulp-filelist.svg?style=flat)](https://www.npmjs.org/package/gulp-filelist)
[![NPM Downloads](https://img.shields.io/npm/dm/gulp-filelist.svg?style=flat)](https://www.npmjs.org/package/gulp-filelist)
[![Node.js Version](https://img.shields.io/badge/node.js->=_0.8-brightgreen.svg?style=flat)](http://nodejs.org/download/)
[![Build Status](https://travis-ci.com/cjroth/gulp-filelist.svg?branch=master)](https://travis-ci.org/cjroth/gulp-filelist)

#### Output list of files in current stream to JSON file or custom format.

Add it to your gulp file:

```js
gulp
  .src(['awesome.file', 'lame.file'])
  .pipe(require('gulp-filelist')('filelist.json'))
  .pipe(gulp.dest('out'))
```

Outputs `out/filelist.json`:

```json
[
  "awesome.file",
  "lame.file"
]
```

## Installation

```bash
$ npm install gulp-filelist
```

## Options

#### Absolute Paths: `{ absolute: true }`

```
gulp
  .src(['awesome.file', 'lame.file'])
  .pipe(require('gulp-filelist')('filelist.json', { absolute: true }))
  .pipe(gulp.dest('out'))
```
Outputs:
```
[
  "/Users/chris/my-project/out/awesome.file",
  "/Users/chris/my-project/out/lame.file"
]
```

#### Relative Paths: `{ relative: true }`

```
gulp
  .src(['awesome.file', 'lame.file'])
  .pipe(require('gulp-rename')(function(path) { path.dirname = 'foo' }))
  .pipe(require('gulp-filelist')('filelist.json', { relative: true }))
  .pipe(gulp.dest('out'))
```
Outputs:
```
[
  "foo/awesome.file",
  "foo/lame.file"
]
```

#### Flattened Paths: `{ flatten: true }`

```
gulp
  .src(['awesome.file', 'lame.file'])
  .pipe(require('gulp-filelist')('filelist.json', { flatten: true }))
  .pipe(gulp.dest('out'))
```
Outputs:
```
[
  "awesome.file",
  "lame.file"
]
```

#### Paths without Extensions: `{ removeExtensions: true }`

```
gulp
  .src(['directory/awesome.file', 'directory/lame.file'])
  .pipe(require('gulp-filelist')('filelist.json', { removeExtensions: true }))
  .pipe(gulp.dest('out'))
```
Outputs:
```
[
  "directory/awesome",
  "directory/lame"
]
```

#### Output file with custom template: `{ destRowTemplate: <rowStringTemplate | function> }`

usage with string template
```
gulp
  .src(['directory/awesome.file', 'directory/lame.file'])
  .pipe(require('gulp-filelist')('filelist.json', { destRowTemplate: "/// <amd dependency='@filePath@'/>" }))
  .pipe(gulp.dest('out'))
```
Outputs:
```
[
  "/// <amd dependency='directory/awesome'/>",
  "/// <amd dependency='directory/lame'/>"
]
```

usage with formatter function

```
function formatter(filePath) {
  return filePath.substring(filePath.lastIndexOf('/') + 1) + ': ' + filePath + '\r\n';
}

gulp
  .src(['directory/awesome.file', 'directory/lame.file'])
  .pipe(require('gulp-filelist')('filelist.json', { destRowTemplate: formatter }))
  .pipe(gulp.dest('out'))
```
Outputs:
```
[
  "awesome: directory/awesome",
  "lame: directory/lame"
]
```
## [MIT Licensed](LICENSE)
