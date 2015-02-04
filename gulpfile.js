'use strict';
/*jshint node: true */

var _ = require('lodash'),
    fs = require('fs'),
    sh = require('shelljs'),
    argv = require('yargs').argv,
    sass = require('gulp-sass'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),
    stylish = require('jshint-stylish'),
    minifyCss = require('gulp-minify-css'),
    // concat = require('gulp-concat'),
    runSequence = require('run-sequence');

var paths = {
  sass: ['./www/app/**/*.scss'],
  scripts: {
    app: ['./www/app/**/*.js'] 
  }
};

gulp.task('default',['build']);

gulp.task('build', function (callback) {
  runSequence('config', ['sass', 'index'], 'lint', callback);
});


gulp.task('config', function (done) {
  var config = require('./www/app/config.json');
  var compiled = _.template(
    '\'use strict\';\n' +
    '/* jshint quotmark: false */\n\n' +
    'angular.module(\'<%= moduleName %>\', [])\n\n' +
    '.constant(\'config\', <%= config %>);'
  );
  var env = (argv.production && 'production') || (argv.test && 'test');
  var newFile = compiled({
    'config': JSON.stringify(config[env ||'development'], null, 2),
    'moduleName': config.configModuleName
  });
  fs.writeFile('./www/app/components/config/config.js', newFile, function () {
    gutil.log('Running  \'' + 
      gutil.colors.cyan('config') +'\' with ' + 
      gutil.colors.magenta(env || 'development')
      );
    done();
  });
});

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

gulp.task('install', ['bower-install', 'cordova-plugin-install', 'config']);

gulp.task('bower-install', function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('cordova-plugin-install', ['ionic-check'], function () {
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