const gulp = require('gulp'); // одключаем галп
const rigger = require('gulp-rigger');//cклеивает файлы
const uglify = require('gulp-uglify'); // минифицироваине
const concat = require('gulp-concat'); //склеивает файлы 
const order = require('gulp-order'); //управляет порядком
const minifyCss = require('gulp-minify-css'); // сжимает ss
const imagemin =require('gulp-imagemin'); //сжфтие картинок
const cache = require('gulp-cache');//кэширует файлы
const pngquant = require('imagemin-pngquant');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const shell = require('gulp-shell');
const runSequence = require('run-sequence');
const clean = require('gulp-clean');

const path = {
	src: {
		html: './src/index.html',
		styles: [
			'./src/css/tools/reset.css',
			'./src/css/vendors/**/*.css',
			'./src/css/*.css'
		],
		js: [
			'./src/js/vendors/**/*.js',
			'./src/js/main.js'
		],
		images: './src/images/',
		fonts: './src/fonts/**/*'
	},
	build: {
		html: './build/',
		css: './build/css/',
		js: './build/js/',
		images: './build/images/',
		fonts: './build/fonts/'
	},
	watch: {
		html: './src/*.html',
		css: './src/css/**/*.css',
		js:'./src/js/**/*.js',
		images: './src/images/**/*',
		fonts: './src/fonts/**/*'

	},
	clean: './build'
}

gulp.task('html', function () {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('js', function () {
	return gulp.src(path.src.js)
		.pipe(order(['jquery-3.3.1.min.js', "!main.js"]))
		.pipe(uglify())
		.pipe(concat('main.js'))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));

})

gulp.task('css', function () {
	return gulp.src(path.src.styles)
		.pipe(minifyCss())
		.pipe(concat('main.css'))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
	return gulp.src(path.src.fonts)
	.pipe(gulp.dest(path.build.fonts))
	.pipe(reload({stream: true}));
})


gulp.task('images', function(){
    return gulp.src(path.src.images + '**/*')
        .pipe(cache(imagemin([
                imagemin.gifsicle({interlaced: true}), //сжатие .gif
                imagemin.jpegtran({progressive: true}), //сжатие .jpeg
                imagemin.optipng({optimizationLevel: 5}), //сжатие .png
                imagemin.svgo({                         // сжатие .svg
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ], {
                verbose: true  //отображает инфо о сжатии изображения
            })
        ))
        .pipe(gulp.dest(path.src.images))
        .pipe(gulp.dest(path.build.images))
        .pipe(reload({stream: true}));
});

gulp.task("clean", function () {
	gulp.src(path.build.html)
	.pipe(clean())
} );
	

gulp.task('build', shell.task([
	'gulp clean',
	'gulp images',
	'gulp fonts',
	'gulp html',
	'gulp css',
	'gulp js'

]));

gulp.task("watch", function() {
	gulp.watch(path.watch.html, ['html']);
	gulp.watch(path.watch.styles, ['css']);
	gulp.watch(path.watch.js, ['js']);
	gulp.watch(path.watch.images, ['images']);
});

gulp.task('browser-sync', function () {
	browserSync({
		startPath: '/',
		server: {
			baseDir: 'build'
		},
		notify: false
	})
});

gulp.task('server', function () {
	runSequence('build', 'browser-sync', 'watch');
});

gulp.task('default', ['build']);

gulp.task('clear-cache', function() {
	cache.clearAll();
})


