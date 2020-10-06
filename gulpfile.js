const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
// top level functions: src(), dest(), watch()
const { src, series, parallel, dest, watch } = require('gulp');

//styles plugins
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass');
const rename = require('gulp-rename');

//js plugins
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');

const jsSRC = 'src/js/**/*.js'; //* * stands for all the folders in js, *.js stands for all the files that end with .js in these folders
const jsDIST = 'dist/js/'; //* * stands for all the folders in js, *.js stands for all the files that end with .js in these folders

const styleSRC = 'src/scss/**/*.scss'; //* * stands for all the folders in css, *.css stands for all the files that end with .css in these folders
const styleDIST = 'dist/css/'; //* * stands for all the folders in css, *.css stands for all the files that end with .css in these folders

const browserSync = require("browser-sync").create();

function styleTask() {
    return src(styleSRC) // takes the source
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed' // compress the scss 
        }))
        .on('error', console.error.bind(console))
        .pipe(sourcemaps.init()) // initiates the sourcemap
        .pipe(concat('styles.css')) //concatinates the files into one file with all the files from the folder > see cssSRC
        .pipe(postcss([autoprefixer(), cssnano()])) // minifies the css
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.')) // write the sourcemap in the same folder
        .pipe(dest(styleDIST)) // outputs the new files there
        .pipe(browserSync.stream());
}

function jsTask() {
    return src(jsSRC) // takes the source
        .on('error', console.error.bind(console))
        .pipe(sourcemaps.init()) // initiates the sourcemap
        .pipe(concat('all.js')) //concatinates the files into one file with all the files from the folder > see jsSRC
        .pipe(terser()) // minifies the js
        .pipe(sourcemaps.write('.')) // wrote the sourcemap in the same folder
        .pipe(dest(jsDIST)) // outputs the new files there
        .pipe(browserSync.stream())
}

function imgTask() {
    return src('./src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}

function watchTask() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "./index.html"
        }
    });
    gulp.watch(styleSRC, styleTask);
    gulp.watch('./*.html').on('change', browserSync.reload);
    //gulp.watch(jsSRC).on('change', browserSync.reload);
    gulp.watch(jsSRC, jsTask);
}

exports.imgTask = imgTask;
exports.styleTask = styleTask;
exports.jsTask = jsTask;
exports.watch = watchTask;

exports.default = series(parallel(imgTask, styleTask, jsTask), watchTask);

