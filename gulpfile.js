var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/*.scss', './scss/partials/*.scss'],
  js: ['src/js/app.js', 'src/js/routes.js', 'src/js/init.js', 'src/js/controllers/*.js']
};

gulp.task('default', ['sass', 'concat', 'concat-angular']);

gulp.task('sass', function(done) {
  gulp.src('./scss/**/*.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('concat', function() {
  return gulp.src(['src/js/app.js', 'src/js/routes.js', 'src/js/init.js', 'src/js/controllers/*.js'])
    .pipe(concat('starter.js'))
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('concat-angular', function() {
  return gulp.src(['bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-sanatize/angular-sanatize.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/ionic/js/ionic-angular.js',
    'bower_components/ngCordova/dist/ng-cordova.js',
    'bower_components/ngCordova/dist/ng-cordova-mocks.js'])
    .pipe(concat('angular.js'))
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['concat']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
