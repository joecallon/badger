var gulp      = require('gulp'),
    sass      = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    rename    = require('gulp-rename'),
    uglify    = require('gulp-uglify'),
    cache     = require('gulp-cache'),
    plumber   = require('gulp-plumber'),
    imagemin  = require('gulp-imagemin'),
    pngquant  = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');



// Minify all images within the img folder
gulp.task('images', function () {
    return gulp.src('img/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true, use: [pngquant()] })))
        .pipe(gulp.dest('img'))
});

// Take our .scss files, sass them up, autoprefix them, minify them, rename them, place them.
gulp.task('css', function () {
    return gulp.src(['css/*.scss', 'css/*.sass'])
        .pipe(plumber())
        .pipe(sass({ errLogToConsole: false, }))
        .on('error', function(err) {
            notify().write(err);
            this.emit('end');
        })
        .pipe(autoprefixer())
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log('Original size: ' + details.stats.originalSize + 'kB');
            console.log('Minified size: ' + details.stats.minifiedSize + 'kB');
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('css'))
});


// Minify, concatenate, rename, place
// concat.js is a temporary file that Gulp converts into scripts.min.js
gulp.task('javascript',function() {
    return gulp.src(['js/*.js', '!js/*.min.js'])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('concat.js'))
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('js'))
});


// Watch any Sass files (including subfolders) and JS files for changes.
gulp.task('watch',function() {
    gulp.watch(['css/**/*.scss', 'css/**/*.sass'],['css'])
    gulp.watch(['js/*.js', '!js/*.min.js'], ['javascript']);
});


// What runs when 'gulp' is run in command line. In this case, minify images and look for any file changes, and then keep watching.
// If you want your CSS to be processed when you run 'gulp' in terminal, add 'css' to the array below. Same goes for JavaScript, just add 'javascript'.
gulp.task('default', ['images', 'watch']);