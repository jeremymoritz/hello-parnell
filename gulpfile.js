/*
	gulpfile.js
	===========
	Rather than manage one giant configuration file responsible
	for creating multiple tasks, each task has been broken out into
	its own file in gulp/tasks. Any file in that folder gets automatically
	required by the loop in ./gulp/index.js (required below).

	To add a new task, simply add a new task file to gulp/tasks.
*/

// require('./gulp');	//	this is the ONLY line in use at ULX (see comment above)


// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var fs = require('fs');
var del = require('del');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var sass = require('gulp-sass');
var react = require('gulp-react');

// var notify = require('gulp-notify');
// function handleErrors(args) {
//     // Send error to notification center with gulp-notify
//     notify.onError({
//         title: 'Compile Error',
//         message: '<%= error.message %>'
//     }).apply(this, args);

//     // Keep gulp from hanging on this task
//     this.emit('end');
// };

//  Delete all files (not folders) in the dist directory
gulp.task('clean-dist', function taskCleanDist() {
	del(['dist/**/*.*'], function createFolders() {
		// fs.mkdirSync('dist/js');
		// fs.mkdirSync('dist/css');
		// fs.mkdirSync('dist/lib');
		// fs.mkdirSync('dist/resources');
		// fs.mkdirSync('dist/img');
	});
});

//  Turn Jade into HTML
gulp.task('template', function taskTemplate() {
	return gulp.src('src/jade/index.jade')
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest('dist'));
});

// Compile Our Sass
gulp.task('sass', function taskSass() {
	return gulp.src('src/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('transpile-jsx', function taskTranspileJSX() {
  return gulp.src('src/js/*.jsx')
		.pipe(react({harmony: true}))   //  convert to .js files
		.pipe(gulp.dest('dist/js'));
});

// Lint and JSCS our scripts
gulp.task('scripts', function taskScripts() {
	return gulp.src('src/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jscs())
		.pipe(gulp.dest('dist/js'));
});

// Copy static directory without changes
gulp.task('copy-static', function taskCopyStatic() {
	gulp.src('src/static/lib/*')
		.pipe(gulp.dest('dist/lib'));
	gulp.src('src/static/img/*')
		.pipe(gulp.dest('dist/img'));

	return gulp.src('src/static/resources/*')
		.pipe(gulp.dest('dist/resources'));
});

// Watch Files For Changes
gulp.task('watch', function taskWatchSrcAndUpdateDist() {
	// gulp.watch('gulpfile.js', ['default']);
	gulp.watch('src/jade/*.jade', ['template']);
	gulp.watch('src/js/*', ['transpile-jsx', 'scripts']);
	gulp.watch('src/scss/*.scss', ['sass']);
	gulp.watch('src/static/**/*', ['copy-static']);
});

// Default Task (perform these tasks in order)
gulp.task('default', [
	'clean-dist',
	'template',
	'transpile-jsx',
	'sass',
	'scripts',
	'copy-static',
	'watch'
], function showWatching() {
	console.log('Gulp is watching...');
});
