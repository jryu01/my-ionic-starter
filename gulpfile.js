'use strict';
/*jshint node: true */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    bower = require('bower'),
    // concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),
    sh = require('shelljs');

var paths = {
  sass: ['./www/app/**/*.scss'],
  scripts: {
    app: ['./www/app/**/*.js'] 
  }
};

gulp.task('default', ['sass', 'index', 'lint']);

gulp.task('sass', function () {
  return gulp.src('./www/app/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'));
});

gulp.task('index', function () {
  var target = gulp.src('./www/index.html'),
      sources = gulp.src('./www/app/**/*.js', { read: false });
  return target
    .pipe(inject(sources, { relative: true }))
    .pipe(gulp.dest('./www'));
});

gulp.task('lint', function() {
  return gulp.src('./www/app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts.app, ['index', 'lint']);
});

gulp.task('install', ['ionic-check', 'bower-install', 'cordova-plugin-install']);

gulp.task('bower-install', function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('cordova-plugin-install', function () {
  require('./plugins.json').forEach(function (plugin) {
    sh.exec('cordova plugin add ' + plugin);
  });
});

gulp.task('ionic-check', function (done) {
  if (!sh.which('ionic') || !sh.which('cordova')) {
    console.log(
      '  ' + gutil.colors.red('Ionic or Cordova is not installed.'),
      '\n  Ionic and Cordova is required to build',
      '\n  Install Ionic and cordova: ',
      gutil.colors.cyan('npm install -g cordova ionic'),
      '\n  Once installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});