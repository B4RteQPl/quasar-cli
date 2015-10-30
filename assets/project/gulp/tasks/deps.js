'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

/**
 * Scripts
 */

function compileJs(production) {
  return gulp.src(config.deps.js.src)
    .pipe(plugins.pipes.js.deps({
      prod: production,
      name: config.deps.name
    }))
    .pipe(gulp.dest(config.deps.js.dest));
}

gulp.task('dev:js:deps', function() {
  return compileJs(false);
});

gulp.task('prod:js:deps', function() {
  return compileJs(true);
});


/**
 * Styles
 */

function compileCss(production) {
  return gulp.src(config.deps.css.src)
    .pipe(plugins.pipes.css.deps({
      prod: production,
      name: config.deps.name
    }))
    .pipe(gulp.dest(config.deps.css.dest))
    .pipe(config.browser.stream());
}

gulp.task('dev:css:deps', function() {
  return compileCss(false);
});

gulp.task('prod:css:deps', function() {
  return compileCss(true);
});


/*
 * Main tasks
 */
gulp.task('dev:deps',  ['dev:js:deps',  'dev:css:deps']);
gulp.task('prod:deps', ['prod:js:deps', 'prod:css:deps']);
