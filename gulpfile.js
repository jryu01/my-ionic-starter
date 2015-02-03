'use strict';
/*jshint node: true */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
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

gulp.task('default', ['sass', 'index']);

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

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts.app, ['index']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:',
      gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});