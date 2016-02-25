var aglio, gulp, plumber, notify, utils;

/**
 * Include Gulp
 *
 * @type {Object}
 */
gulp = require('gulp');
/**
 * The plumber for allowing errors to pass through
 *
 * @type {Object}
 */
plumber = require('gulp-plumber');
/**
 * Notify the user
 *
 * @type {Object}
 */
notify = require('gulp-notify');
/**
 * Utilities for logging output
 *
 * @type {Object}
 */
utils = require('gulp-util');
/**
 * Utilities for generating the documentation html
 *
 * @type {Object}
 */
aglio = require('gulp-aglio');
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
 * Setup all the watchers
 */
gulp.task('watch', function() {
  /**
   * Watch the documentation
   */
  gulp.watch(['./docs/**/*.md'], function() {
    gulp.run('prepare:docs');
  });
});
