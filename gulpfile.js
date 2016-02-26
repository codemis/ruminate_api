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
 * Files to lint
 *
 * @type {Array}
 */
var lintFiles = ['./index.js', './routes/**/*.js'];
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
 * Setup all the watchers
 */
gulp.task('watch', ['prepare:docs', 'lint'], function() {
  /**
   * Watch the documentation
   */
  gulp.watch('./docs/**/*.md', ['prepare:docs']);
  /**
   * Watch files for linting
   */
   gulp.watch(lintFiles, ['lint']);
});
