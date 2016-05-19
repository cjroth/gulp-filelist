var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gulpFilelist = require('..');

var source = 'test/fixtures/*.txt';

describe('gulp-filelist', function(done) {

  it('should output a json file with a list of the files currently in the stream', function(done) {
    var out = 'filelist.json';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(source)
      .pipe(gulpFilelist(out))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        var filelist = require(filelistPath);
        filelist[0].should.equal('test/fixtures/file1.txt');
        filelist[1].should.equal('test/fixtures/file2.txt');
        fs.unlinkSync(filelistPath);
        done();
      });

  });

  it('should output absolute file paths when the absolute option is true', function(done) {
    var out = 'filelist-absolute.json';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(source)
      .pipe(gulpFilelist(out, { absolute: true }))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        var filelist = require(filelistPath);
        filelist[0].should.equal(__dirname.replace(/\\/g, '/') + '/fixtures/file1.txt');
        filelist[1].should.equal(__dirname.replace(/\\/g, '/') + '/fixtures/file2.txt');
        fs.unlinkSync(filelistPath);
        done();
      });
  });

  it('should output flattened file paths when the flatten option is true', function(done) {
    var out = 'filelist-flatten.json';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(source)
      .pipe(gulpFilelist(out, { flatten: true }))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        var filelist = require(filelistPath);
        filelist[0].should.equal('file1.txt');
        filelist[1].should.equal('file2.txt');
        fs.unlinkSync(filelistPath);
        done();
      });
  });

  describe('removeExtensions option', function () {

    it('should work without additional options', function(done) {
      var out = 'filelist-remove.json';
      var filelistPath = path.join(__dirname, out);
      gulp
        .src(source)
        .pipe(gulpFilelist(out, { removeExtensions: true }))
        .pipe(gulp.dest('test'))
        .on('end', function(file) {
          var filelist = require(filelistPath);
          filelist[0].should.equal('test/fixtures/file1');
          filelist[1].should.equal('test/fixtures/file2');
          fs.unlinkSync(filelistPath);
          done();
        });
    });

    it('should work with the flatten option', function (done) {
      var out = 'filelist-remove-flatten.json';
      var filelistPath = path.join(__dirname, out);
      gulp
        .src(source)
        .pipe(gulpFilelist(out, { removeExtensions: true, flatten: true }))
        .pipe(gulp.dest('test'))
        .on('end', function(file) {
          var filelist = require(filelistPath);
          filelist[0].should.equal('file1');
          filelist[1].should.equal('file2');
          fs.unlinkSync(filelistPath);
          done();
        });
    });

    it('should work with the absolute option', function (done) {
      var out = 'filelist-remove-absolute.json';
      var filelistPath = path.join(__dirname, out);
      gulp
        .src(source)
        .pipe(gulpFilelist(out, { removeExtensions: true, absolute: true }))
        .pipe(gulp.dest('test'))
        .on('end', function(file) {
          var filelist = require(filelistPath);
          filelist[0].should.equal(__dirname.replace(/\\/g, '/') + '/fixtures/file1');
          filelist[1].should.equal(__dirname.replace(/\\/g, '/') + '/fixtures/file2');
          fs.unlinkSync(filelistPath);
          done();
        });
    });

  });

  describe('cwd option when building the stream', function(done) {
    it("should be honoured", function(done) {
      var out = 'filelist-cwd.json';
      var filelistPath = path.join(__dirname, out);
      gulp
        .src('test.file', { cwd: 'test/' })
        .pipe(gulpFilelist(out))
        .pipe(gulp.dest('test'))
        .on('end', function() {
          var filelist = require(filelistPath);
          filelist[0].should.equal('test.file');
          fs.unlinkSync(filelistPath);
          done();
        });
    })
  });

});
