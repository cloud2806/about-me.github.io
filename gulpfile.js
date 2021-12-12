const {src, dest, series, watch, parallel} = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const sync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');

function generateHTML(cb) {
    return src('./views/pages/*.ejs').pipe(ejs({title: 'title'})).pipe(rename({
        extname: '.html',
    })).pipe(dest('dist/views/pages'));
}

function watchFiles(cb) {
    watch('./views/**.ejs', generateHTML);
}

function browserSync() {
    sync.init({
        server: {
            baseDir: './public',
        },
    });

    watch('./views/**/*.ejs', generateHTML);
    watch('./dist/**/*.html').on('change', sync.reload);
}

function generateJs(cb) {
    return src('src/*.js').
        pipe(babel()).
        pipe(uglify()).
        pipe(rename({extname: '.min.js'})).
        pipe(dest('dist/src/'));
}

function clean() {
    return del('dist/**', {force: true});
}

exports.html = generateHTML;
exports.watch = watchFiles;
exports.sync = browserSync;
exports.js = generateJs;
exports.clean = clean;

exports.default = series(clean, parallel(generateHTML, generateJs));
