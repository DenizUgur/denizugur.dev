/**
 * Gulp file to automate the various tasks
 */
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var csscomb = require('gulp-csscomb');
var cleanCss = require('gulp-clean-css');
var del = require('del');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var wait = require('gulp-wait');

// Define paths
var paths = {
    dist: {
        base: 'dist'
    },
    base: {
        base: './',
        node: 'node_modules'
    },
    src: {
        base: './',
        css:  'assets/css',
        js: 'assets/js',
        html: '**/*.html',
        top_html: '*.html',
        img:  'assets/images/**/*.+(png|jpg|jpeg|gif|svg)',
        fonts: 'assets/fonts/*',
        scss: 'assets/sass/**/*.scss'
    }
}

// Compile SCSS
gulp.task('scss', function() {
  return gulp.src(paths.src.scss)
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([require('postcss-flexbugs-fixes')]))
    /*.pipe(autoprefixer({
        browsers: ['> 1%']
    }))*/
    .pipe(csscomb())
    .pipe(gulp.dest(paths.src.css))
    .pipe(browserSync.reload({
        stream: true
    }));
});

// Minify CSS
gulp.task('minify:css', function () {
  return gulp.src([
        paths.src.css + '/*.css', '!' + paths.src.css + '/*.min.css'])
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.base + '/css'));
});

// Minify JS
gulp.task('minify:js', function(cb) {
    return gulp.src([
            paths.src.js + '/**/*.js', '!' + paths.src.js + '/**/*.min.js'])
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dist.base + '/js'));
});

// Copy already minified files
gulp.task('copy:min.css', function () {
    return gulp.src([
            paths.src.css + '/*.min.css'
        ])
        .pipe(gulp.dest(paths.dist.base + '/css'));
});

gulp.task('copy:min.js', function () {
    return gulp.src([
            paths.src.js + "/**/*.min.js"
        ])
        .pipe(gulp.dest(paths.dist.base + '/js'));
});

// Minify Starter
gulp.task('minify', function (callback) {
    runSequence(['minify:css', 'minify:js', 'copy:min.css', 'copy:min.js'],
        callback
    );
});

// Live reload
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: [paths.src.base, paths.base.base]
        },
    });
});

// Watch for changes
gulp.task('watch', ['browserSync', 'scss', 'minify'], function() {
    gulp.watch(paths.src.scss, function(){ runSequence('scss', 'minify', browserSync.reload); });
    gulp.watch(paths.src.js + '**/*.js', function(){ runSequence('clean:dist:js', 'minify', browserSync.reload); });
    gulp.watch(paths.src.html, browserSync.reload);
});

// Clean
gulp.task('clean:dist', function() {
    return del.sync(paths.dist.base);
});

gulp.task('clean:dist:js', function () {
    return del.sync(paths.dist.base + '/js');
});

// Copy Others
gulp.task('copy:img', function () {
    return gulp.src([
            paths.src.img
        ])
        .pipe(gulp.dest(paths.dist.base + '/images'));
});

gulp.task('copy:fonts', function () {
    return gulp.src([
            paths.src.fonts
        ])
        .pipe(gulp.dest(paths.dist.base + '/fonts'));
});

// Build
gulp.task('build', function(callback) {
    runSequence('clean:dist', 'scss', 'minify', 'copy:img', 'copy:fonts',
        callback);
});

// Default
gulp.task('default', function(callback) {
    runSequence(['build', 'browserSync', 'watch'],
        callback
    );
});
