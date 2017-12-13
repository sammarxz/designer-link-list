const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const data = require('gulp-data');
const htmlmin = require("gulp-htmlmin");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();


// HTML things
gulp.task('compileNunjucks', function(){
    gulp.src('src/nunjucks/index.nunjucks')
      .pipe(data(function() {
          return require('./data/data.json')
      }))
      .pipe(nunjucks({
          path: ['./src/nunjucks/templates', 'src/nunjucks/partials']
      }))
      .pipe(gulp.dest('./'));
});

gulp.task('minifyHtml', function() {
  gulp.src('./*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('./'));
});


// Stylesheet things
gulp.task('compileSass', function() {
    gulp.src('./src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('./assets/css/'))
});

gulp.task('minifyCss', function() {
    gulp.src('./assets/css/*.css')
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
    .pipe(gulp.dest('./assets/css/'))
});


// Browser-Sync things
gulp.task('server', ['compileSass', 'compileNunjucks'], function() {
    browserSync.init({
        server: {
            baseDir: ''
        }
    });

    gulp.watch('./src/scss/**/*.scss', ['compileSass']);
    gulp.watch(['./src/nunjucks/**/*.nunjucks', './data/data.json'], ['compileNunjucks']);
    gulp.watch('*.html').on('change', browserSync.reload);
});


// Build things
gulp.task('build', ['minifyHtml', 'minifyCss'], function() {
    gulp.src(['./assets/css/main.css'], { base: 'src' })
        .pipe(gulp.dest('./'));
});




