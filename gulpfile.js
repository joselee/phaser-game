var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var less = require('gulp-less');
var ts = require('gulp-typescript');
var tsLint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');
var listFiles = require('gulp-filesize'); /* .pipe(listFiles()) to see files in stream*/
var gutil = require('gulp-util');
var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });

gulp.task('default', ['build'], function () {
	gulp.watch(['public/styles/**/*.less'], ['styles']);
	gulp.watch(['public/scripts/**/*.ts'], ['scripts']);
});

gulp.task('build', ['libs', 'styles', 'scripts']);

gulp.task('styles', function () {
	del.sync('public/build/*.css');
	gulp.src(['public/styles/**/*.less'])
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(concat('app.css'))
		.pipe(sourcemaps.write())
		.on('error', gutil.log)
		.pipe(gulp.dest('public/build'));
});

gulp.task('scripts', function () {
	del.sync(['public/build/*.js', 'public/build/*.map']);
	var scripts = [
		'typings/browser.d.ts',
		'node_modules/phaser/typescript/phaser.d.ts',
		'public/scripts/**/*Module.ts',
		'public/scripts/**/*.ts'
	];
	gulp.src(scripts)
		.pipe(sourcemaps.init())
		.pipe(ts(tsProject))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/build'));
});

gulp.task('libs', function () {
	del.sync(['public/build/libs/**/*.*']);

	var libs = {
		js: [
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/lodash/lodash.min.js',
			'node_modules/bootstrap/dist/bootstrap.min.js',
			'node_modules/angular/angular.min.js',
			'node_modules/angular-bootstrap/ui-bootstrap-tpls.min.js',
			'node_modules/angular-ui-router/release/angular-ui-router.min.js'
		],
		styles: [
			'node_modules/bootstrap/less/bootstrap.less'
		],
		fonts: [
			'node_modules/bootstrap/fonts/*.*'
		]
	};

	gulp.src(libs.js)
		.pipe(concat('libs.js'))
		.pipe(gulp.dest('public/build/libs'));
	gulp.src(libs.styles)
		.pipe(less())
		.pipe(concat('libs.css'))
		.pipe(gulp.dest('public/build/libs'));
	gulp.src(libs.fonts)
		.pipe(gulp.dest('public/build/fonts'));
});