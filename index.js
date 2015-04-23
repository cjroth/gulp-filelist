var through = require('through');
var File = require('vinyl');

module.exports = function(out, options) {

  options = options || {};

  var files = [];
  var filePaths = [];

  var onFile = function(file) {
    files.push(file);
    var path = options.absolute ? file.path : file.relative;
    filePaths.push(path.replace(/\\/g, '/'));
  };

  var onEnd = function() {

    var file = new File({
      path: out,
      contents: new Buffer(JSON.stringify(filePaths, null, '  '))
    });

    this.emit('data', file);
    this.emit('end');

  };

  return through(onFile, onEnd);

};
