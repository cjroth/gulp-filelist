var through = require('through');
var File = require('vinyl');

module.exports = function(out, options) {

  options = options || {};

  var files = [];
  var filePaths = [];

  var onFile = function(file) {
    files.push(file);
    var path
	if (options.absolute) {
	  path = file.path;
	}
	else {
	  path = file.path.replace(process.cwd(), '');
	  path = path.replace(new RegExp('^[/\\\\]'), '');
	}
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
