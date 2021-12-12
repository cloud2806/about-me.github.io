const {src, dest, series, watch, parallel} = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const sync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');
const nodemon = require('gulp-nodemon');

function generateHTML() {
    return src('./views/pages/*.ejs').pipe(ejs({title: 'title'})).pipe(rename({
        extname: '.html',
    })).pipe(dest('dist/views/pages'));
}

function generateJs() {
    return src('src/*.js').
        pipe(babel()).
        pipe(uglify()).
        pipe(rename({extname: '.min.js'})).
        pipe(dest('dist/src/'));
}

function watchFiles(cb) {
    watch('./views/**/*.ejs', generateHTML);
    watch('./src/**/*.js', generateJs);
    cb();
}

function browserSync() {
    sync.init(null, {proxy: 'http://localhost:8080'});

    watch('./dist/views/**/*.html').on('change', sync.reload);

    watch('./dist/src/**/*.js').on('change', sync.reload);
}

function clean() {
    return del('dist/**', {force: true});
}

function nodemonTask(cb) {
    let callbackCalled = false;
    return nodemon({script: './dist/src/server.min.js'}).on('start', function() {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    });
}

exports.html = generateHTML;
exports.watch = watchFiles;
exports.js = generateJs;
exports.clean = clean;

exports.default = series(clean, parallel(generateHTML, generateJs));
exports.sync = series(watchFiles, nodemonTask, browserSync);
