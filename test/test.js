var pkg = require('../package');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gulpFilelist = require('..');
var assert = require('assert');

var source = 'test/fixtures/*.txt';

describe('gulp-filelist', function(done) {

  it('should return an error, if used with a stream', function (done) {
    var out = 'filelist-dest-row-template-function.txt';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(source, {buffer: false})
      .pipe(gulpFilelist(out)
        .on('error', function(error) {
          error.plugin.should.equal(pkg.name);
          error.message.should.equal('Streams not supported');
          done();
        }))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        fs.unlinkSync(filelistPath);
        assert.fail('there should have been an error');
      });
  });

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


  it('should work with the destRowTemplate option set to some value', function (done) {
    var out = 'filelist-dest-row-template.txt';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(source)
      .pipe(gulpFilelist(out, { destRowTemplate: "@filePath@ - @filePath@\r\n" }))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        var filelist = fs.readFileSync(filelistPath, 'UTF-8');
        var fileRows = filelist.split('\r\n');
        fileRows.should.containEql('test/fixtures/file1.txt - test/fixtures/file1.txt');
        fileRows.should.containEql('test/fixtures/file2.txt - test/fixtures/file2.txt');
        fs.unlinkSync(filelistPath);
        done();
      });
  });

  it('should work with the destRowTemplate option set to a function', function (done) {
    function formatter(filePath) {
      return filePath.substring(filePath.lastIndexOf('/') + 1) + ': ' + filePath + '\r\n';
    }

    var out = 'filelist-dest-row-template-function.txt';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(source)
      .pipe(gulpFilelist(out, { destRowTemplate: formatter }))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        var filelist = fs.readFileSync(filelistPath, 'UTF-8');
        var fileRows = filelist.split('\r\n');
        fileRows.should.containEql('file1.txt: test/fixtures/file1.txt');
        fileRows.should.containEql('file2.txt: test/fixtures/file2.txt');
        fs.unlinkSync(filelistPath);
        done();
      });
  });

  it('should work with the destRowTemplate option containing the token twice', function (done) {
    var out = 'filelist-dest-row-template-2.txt';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(source)
      .pipe(gulpFilelist(out, { destRowTemplate: "@filePath@ - @filePath@\r\n" }))
      .pipe(gulp.dest('test'))
      .on('end', function(file) {
        var filelist = fs.readFileSync(filelistPath, 'UTF-8');
        var fileRows = filelist.split('\r\n');
        fileRows.should.containEql('test/fixtures/file1.txt - test/fixtures/file1.txt');
        fileRows.should.containEql('test/fixtures/file2.txt - test/fixtures/file2.txt');
        fs.unlinkSync(filelistPath);
        done();
      });
  });


  it('should output relative file paths when the relative option is true', function(done) {
    var out = 'filelist-relative.json';
    var filelistPath = path.join(__dirname, out);
    gulp
      .src(source)
      .pipe(gulpFilelist(out, { relative: true }))
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
