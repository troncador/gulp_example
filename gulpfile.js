var gulp = require('gulp')
  , fs = require('fs')
  , typescript = require('gulp-typescript')
  , concat = require('gulp-concat')
  , less = require('gulp-less')
  , sourcemaps = require('gulp-sourcemaps')
  , newer = require('gulp-newer')
  , clean = require('gulp-clean')
  , connect = require('gulp-connect')
  ;

var typescriptConfiguration =
  typescript.createProject('dev-config/typescript.json');

var srcFilesStatic = ['src/**/*', '!src/less{,/**}', '!src/ts{,/**}']
  , srcFileIndex = 'index.html'
  , dstFileIndex = 'dist/'
  , srcFilesTypescript = ['src/ts/**/*.ts']
  , srcFilesLess = ['src/less/style.less']
  , srcFilesJS = ['dist/assets/debug/js/**/*.js']
  , dstFilesJS = 'dist/assets/debug/js'
  , srcFilesJSThirdParty = ['dist/assets/debug/js-thirdParty/**/*.js']
  , dstFilesJSThirdParty = 'dist/assets/debug/js-thirdParty'
  , dstFilesFont = 'dist/assets/font'
  , dstFilesLess = 'dist/assets/debug/less'
  , dstStatic = 'dist/assets/'
  , appLib = 'app.js'
  , libLib = 'lib.js'
  , configExternalFont = 'dev-config/externalFont.json'
  , configExternalLibraries = 'dev-config/externalLibraries.json'
  ;


  gulp.task('server', function() {
    connect.server({
      name: 'Dev App',
      root: 'dist',
      port: 8000,
      livereload: true
    });
  });

  gulp.task('refresh-html', function () {
    gulp.src('dist/index.html')
      .pipe(connect.reload());
  });

/**
*   convierte de src/ts/ .ts -> dist/js/src/ .js
*/
gulp.task('typescript', function() {
  var tsPipe = typescript(typescriptConfiguration)
    , destPipe = gulp.dest(dstFilesJS)
    ;

   return gulp.src(srcFilesTypescript)
              .pipe(tsPipe)
              .pipe(destPipe)
              ;
});

/**
*   concatena js
*/
gulp.task('concat', ['typescript'],  function() {
  var concatPipe = concat(appLib)
    , destPipe = gulp.dest(dstStatic)
    ;

  gulp.src(srcFilesJS)
      .pipe(sourcemaps.init())
      .pipe(concatPipe)
      .pipe(sourcemaps.write( '.', {includeContent :true}))
      .pipe(destPipe);
});

/**
*   copy static files
*/
gulp.task('copy-static', function() {
  return gulp.src(srcFilesStatic)
      .pipe(newer(dstStatic))
      .pipe(gulp.dest(dstStatic));
});

/**
*   copy static files
*/
gulp.task('copy-index', function() {
  return gulp.src(srcFileIndex)
      .pipe(newer(dstFileIndex))
      .pipe(gulp.dest(dstFileIndex));
});

/**
*   copy fonts files
*/
gulp.task('copy-font', function() {
  var conf = JSON.parse(fs.readFileSync(configExternalFont));

  return gulp.src(conf)
      .pipe(newer(dstFilesFont))
      .pipe(gulp.dest(dstFilesFont));
});

/**
*   concat js
*/
gulp.task('concat-lib', ['copy-lib'],  function() {
  var concatPipe = concat(libLib)
    , destPipe = gulp.dest(dstStatic)
    ;

  gulp.src(srcFilesJSThirdParty)
      .pipe(sourcemaps.init())
      .pipe(concatPipe)
      .pipe(sourcemaps.write( '.', {includeContent :true}))
      .pipe(destPipe);
});

/**
*   copy external libraries
*/
gulp.task('copy-lib', function() {
  var conf = JSON.parse(fs.readFileSync(configExternalLibraries));

  return gulp.src(conf)
      .pipe(newer(dstFilesJSThirdParty))
      .pipe(gulp.dest(dstFilesJSThirdParty));
});

/**
*   from de src/ts/ .less -> dist/css/src/ .css
*/
gulp.task('less', ['copy-less'], function () {
  gulp.src(srcFilesLess)
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(sourcemaps.write('.', {includeContent :true}))
      .pipe(gulp.dest(dstStatic));
});

gulp.task('copy-less',  function () {
  return gulp.src(srcFilesLess)
             .pipe(newer(dstFilesLess))
             .pipe(gulp.dest(dstFilesLess));
});

gulp.task('default', ['copy-font', 'copy-index', 'typescript', 'concat', 'copy-less', 'less', 'copy-static', 'copy-lib', 'concat-lib'], function () {
  return gulp.src(
    ['dist/assets/debug/', 'dist/assets/*.map'], {read: false})
    .pipe(clean());
});

gulp.task('dev', ['copy-font','typescript', 'concat', 'copy-less', 'less', 'copy-static', 'copy-lib', 'concat-lib', 'copy-index', 'server'], function() {
  gulp.watch(srcFilesTypescript, ['typescript', 'concat']);
  gulp.watch('src/less/**/*.less', ['copy-less', 'less']);
  gulp.watch(configExternalLibraries, ['copy-lib', 'concat-lib']);
  gulp.watch(configExternalFont, ['copy-font']);
  gulp.watch(srcFileIndex, ['copy-index']);
  gulp.watch(srcFilesStatic, ['copy-static']);

  gulp.watch(['dist/*.html'], ['server']);
});
