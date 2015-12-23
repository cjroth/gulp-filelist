var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gulpFilelist = require('..');

describe('gulp-filelist', function(done) {

  it('should output a json file with a list of the files currently in the stream', function(done) {
    var out = 'filelist.json';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src('test/test.file')
      .pipe(gulpFilelist(out))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        var filelist = require(filelistPath);
        filelist[0].should.equal('test/test.file');
        fs.unlinkSync(filelistPath);
        done();
      });

  });

  it('should output absolute file paths when the absolute option is true', function(done) {
    var out = 'filelist-absolute.json';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(__dirname + '/test.file')
      .pipe(gulpFilelist(out, { absolute: true }))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        var filelist = require(filelistPath);
        filelist[0].should.equal(__dirname.replace(/\\/g, '/') + '/test.file');
        fs.unlinkSync(filelistPath);
        done();
      });
  });

  it('should output flattened file paths when the flatten option is true', function(done) {
    var out = 'filelist-flatten.json';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(__dirname + '/test.file')
      .pipe(gulpFilelist(out, { flatten: true }))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        var filelist = require(filelistPath);
        filelist[0].should.equal('test.file');
        fs.unlinkSync(filelistPath);
        done();
      });
  });

});
