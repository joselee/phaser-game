var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var less = require('gulp-less');
var ts = require('gulp-typescript');
var tsLint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var listFiles = require('gulp-filesize'); /* .pipe(listFiles()) to see files in stream*/
var gutil = require('gulp-util');
var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });
var dev = (process.env.NODE_ENV !== 'production');

gulp.task('default', ['fastbuild'], function () {
    gulp.watch(['public/styles/**/*.less'], ['styles']);
    gulp.watch(['public/scripts/**/*.ts'], ['scripts']);
});

gulp.task('build', ['clean', 'libs', 'styles', 'scripts']);
gulp.task('fastbuild', ['styles', 'scripts']);

gulp.task('clean', function () {
    del.sync('public/build/**/*');
    del.sync('public/build');
});

gulp.task('styles', function () {
    del.sync('public/build/*.css');
    return gulp.src(['public/styles/**/*.less'])
        .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(gulpif(dev, sourcemaps.write()))
        .on('error', gutil.log)
        .pipe(gulp.dest('public/build'));
});

gulp.task('scripts', function () {
    del.sync(['public/build/*.js', 'public/build/*.map']);
    var scripts = [
        'typings/browser.d.ts',
        'public/scripts/**/*Module.ts',
        'public/scripts/**/*.ts'
    ];
    return gulp.src(scripts)
        .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(ts(tsProject))
        .pipe(uglify())
        .pipe(gulpif(dev, sourcemaps.write()))
        .pipe(gulp.dest('public/build'));
});

gulp.task('libs', function () {
    del.sync(['public/build/libs/**/*.*']);

    var libs = {
        js: [
            'node_modules/jquery/dist/jquery.slim.js',
            'node_modules/angular/angular.js',
            'node_modules/phaser/dist/phaser.js',
            'node_modules/socket.io/node_modules/socket.io-client/socket.io.js',
            'node_modules/socket.io-client/socket.io.js'
        ],
        styles: [
            'node_modules/bootstrap/less/bootstrap.less'
        ],
        fonts: [
            'node_modules/bootstrap/fonts/*.*'
        ]
    };

    var libsJS = gulp.src(libs.js)
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/build/libs'));
    var libsCSS = gulp.src(libs.styles)
        .pipe(less())
        .pipe(concat('libs.css'))
        .pipe(gulp.dest('public/build/libs'));
    var libsFonts = gulp.src(libs.fonts)
        .pipe(gulp.dest('public/build/fonts'));
        
    return merge(libsJS, libsCSS, libsFonts);
});