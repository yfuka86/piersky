var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var through2 = require('through2');
var source = require('vinyl-source-stream')
var gutil = require('gulp-util');
var chalk = require('chalk');
var _ = require('lodash');

function map_error(err) {
  if (err.fileName) {
    // regular error
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': '
      + 'Line '
      + chalk.magenta(err.lineNumber)
      + ' & '
      + 'Column '
      + chalk.magenta(err.columnNumber || err.column)
      + ': '
      + chalk.blue(err.description))
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message))
  }

  if (_.isFunction(this.end)) this.end();
}
/* */

var assetsPath = {
  src: ['app/assets/javascripts/src/application.js', 'app/assets/javascripts/src/graph.js'],
  dest:'app/assets/javascripts/dist/'
};

var watching = false;
gulp.task('enable-watch-mode', function() { watching = true });

var debug = true;
gulp.task('disable-debug-mode', function() { debug = false });

gulp.task('browserify', function() {
  return gulp.src(assetsPath.src)
    .pipe(through2.obj(function (file, enc, next){
      var b = watching ? watchify(browserify(file.path, { debug: debug })).transform(babelify)
                       : browserify(file.path, { debug: debug }).transform(babelify);

      b.on('log', gutil.log);

      var addr = _.clone(file.path); // 一括マッピングの際に変更されてしまうのでクローンする
      b.on('update', function () {
        gutil.log('Updated', gutil.colors.magenta(addr));
        b.bundle()
        .on('error', map_error)
        .pipe(
          source(assetsPath.dest + '/' + _.last(addr.split('/')))
        )
        .pipe(gulp.dest('./'));
      });

      b.bundle(function (err, res) {
        if (err) {
          map_error(err);
          return;
        }
        file.contents = res;
        next(null, file);
      });
    }))
    .pipe(gulp.dest(assetsPath.dest));
});

gulp.task('build', ['browserify']);
gulp.task('watch', ['enable-watch-mode', 'browserify']);
gulp.task('build-production', ['disable-debug-mode', 'browserify']);

gulp.task('default', ['watch']);
