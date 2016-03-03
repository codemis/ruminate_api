/**
 * Include Gulp
 *
 * @type {Object}
 */
var gulp = require('gulp');
/**
 * The plumber for allowing errors to pass through
 *
 * @type {Object}
 */
var plumber = require('gulp-plumber');
/**
 * Notify the user
 *
 * @type {Object}
 */
var notify = require('gulp-notify');
/**
 * Utilities for logging output
 *
 * @type {Object}
 */
var utils = require('gulp-util');
/**
 * Utilities for generating the documentation html
 *
 * @type {Object}
 */
var aglio = require('gulp-aglio');
/**
 * Utilities for linting the code
 *
 * @type {Object}
 */
var eslint = require('gulp-eslint');
/**
 * Utilities for starting servers
 *
 * @type {Object}
 */
var nodemon = require('gulp-nodemon');
/**
 * Include Gulp mocha
 *
 * @type {Object}
 */
var mocha  = require('gulp-mocha');
/**
 * The Mocha reporter using node-notify
 *
 * @type {Object}
 */
var notifierReporter = require('mocha-notifier-reporter');
/**
 * Files to lint
 *
 * @type {Array}
 */
var lintFiles = ['./config.js', './index.js', './routes/**/*.js'];
/**
 * An array of file locations for the test files to be run
 *
 * @type {Array}
 */
var testFiles = ['./tests/**/*.js'];
/**
 * Prepare our documentation file with aglio
 */
gulp.task('prepare:docs', function() {
  utils.log('Preparing documentation files.');
  return gulp.src('docs/api-endpoints.md')
          .pipe(aglio({ template: 'default', themeFullWidth: true, themeTemplate: 'triple'}))
          .pipe(gulp.dest('docs/html'))
          .pipe(notify({title: 'Docs Refreshed', message: 'We have refreshed the docs!'}));
});
/**
 * Lint the code
 */
gulp.task('lint', function() {
  return gulp.src(lintFiles)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError())
            .on('error', notify.onError({message: 'Linting Failed!'}))
            .on('error', function() {
              this.emit('end');
            });
});
/**
 * Add a task for running the tests
 */
gulp.task('test', function() {
  return gulp
    .src(testFiles)
    .pipe(mocha({reporter: notifierReporter.decorate('spec')}))
    .on('error', function() {
      this.emit('end');
    });
});
/**
 * Run the Development server
 */
gulp.task('run', function () {
  nodemon({
    script: 'index.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  });
});
/**
 * Testing Environment
 */
gulp.task('run:test-server', function () {
  nodemon({
    script: 'index.js',
    ext: 'js',
    env: { 'NODE_ENV': 'testing' }
  }).on('start', ['test']);
});
/**
 * Setup all the watchers
 */
gulp.task('watch', ['run:test-server', 'prepare:docs', 'lint'], function() {
  /**
   * Watch the documentation
   */
  gulp.watch('./docs/**/*.md', ['prepare:docs']);
  /**
   * Watch files for linting
   */
   gulp.watch(lintFiles, ['lint']);
});
