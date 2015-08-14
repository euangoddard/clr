// Regular NPM dependencies
var argv = require('minimist')(process.argv.slice(2));
var browserSync = require('browser-sync');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var source = require('vinyl-source-stream');
var stylish = require('jshint-stylish');

// Gulp dependencies
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// Gulp helpers
var svg = require('./gulp/svg');


var CONFIG = {
  is_release: !!argv.release
};

var reload = browserSync.reload;


gulp.task('clean', function () {
  del.sync(['./dist']);
});


gulp.task('build-js', function () {
  var b = browserify({
    entries: ['./src/js/main.js'],
    debug: false
  });
  return b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.if(CONFIG.is_release, $.uglify()))
    .pipe(gulp.dest('./dist/js'));
});


gulp.task('sass', function () {
  var output_style = CONFIG.is_release ? 'compressed' : 'expanded';

  return gulp.src('./src/scss/**/*.scss')
    .pipe($.sass({
      outputStyle: output_style
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: [
    	'last 2 versions'
    ]}))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('build-html', ['build-js', 'sass'], function () {
  var target = gulp.src('./src/index.html');
  var sources = gulp.src([
    './dist/js/**/*.js',
    './dist/css/**/*.css'
  ], {read: false});

  return target
    .pipe($.inject(sources, {ignorePath: '/dist/'}))
    .pipe($.inject(svg(), {
      transform: function (file_path, file) {
        return file.contents.toString('utf8');
      }
    }))
    .pipe($.if(CONFIG.is_release, $.minifyHtml()))
    .pipe(gulp.dest('./dist'));
});


gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js', '../server.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish));
});


gulp.task('build', ['build-html']);


gulp.task('serve', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'clr',
    server: 'dist',
    baseDir: 'dist'
  });

  gulp.watch(['./src/**/*', './gulpfile.js'], ['build', reload]);
});


gulp.task('default', ['build']);
