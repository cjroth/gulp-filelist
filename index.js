'use strict';
var pkg = require('./package');
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var File = require('vinyl');

// consts
module.exports = function(out, options) {

  options = options || {};

  var fileList = [];

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(pkg.name, 'Streams not supported'));
      return;
    }

    var filePath;
    if (options.absolute) {
      filePath = path.normalize(file.path);
    } else if (options.flatten) {
      filePath = path.basename(file.path);
    } else {
      filePath = path.relative(file.cwd, file.path);
    }
    if (options.removeExtensions) {
      var extension = path.extname(filePath);
      if (extension.length) {
        filePath = filePath.slice(0, -extension.length);
      }
    }
    filePath = filePath.replace(/\\/g, '/');
    fileList.push(filePath);
    
    cb();
  }, function(cb) {
    var fileListFile = new File({
      path: out,
      contents: new Buffer(JSON.stringify(fileList, null, '  '))
    });

    this.push(fileListFile);
    cb();
  });
};
