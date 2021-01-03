const gulp = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');

gulp.task('clean', () => {
	return gulp.src('build/**/*', { read: false })
		.pipe(rm());
});

gulp.task('html', () => {
	return gulp.src('src/html/index.html')
		.pipe(fileinclude())
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }));
});
gulp.task('scss', () => {
	return gulp.src('src/scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: true
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('copy:images', () => {
	return gulp.src('./src/images/**/*.*')
		.pipe(gulp.dest('./build/images/'))
});

gulp.task('copy:fonts', () => {
	return gulp.src('./src/fonts/**/*.*')
		.pipe(gulp.dest('./build/fonts/'))
});
gulp.task('copy:bootstrap', () => {
	return gulp.src('./src/bootstrap/**/*.*')
		.pipe(gulp.dest('./build/bootstrap/'))
});

gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: './build'
		}
	});
});

gulp.watch(
	[
		'./build/index.html',
		'./build/main.css'
	],
	gulp.parallel(browserSync.reload)
);
gulp.watch('./src/html/**/*.html', gulp.parallel('html'));
gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'));
gulp.watch('./src/bootstrap/**/*.scss', gulp.parallel('copy:bootstrap'));
// gulp.watch('./src/bootstrap/popperjs/**/*.js', gulp.parallel('copy:popperjs'));
// gulp.watch('./src/bootstrap/jquery/**/*.js', gulp.parallel('copy:jquery'));
gulp.watch('./src/images/**/*.*', gulp.parallel('copy:images'));
gulp.watch('./src/fonts/**/*.*', gulp.parallel('copy:fonts'));

gulp.task(
	'default',
	gulp.series('clean',
		gulp.parallel('html', 'scss', 'copy:bootstrap', 'copy:fonts', 'copy:images'), 'server')
);

// 'copy:popperjs', 'copy:jquery',