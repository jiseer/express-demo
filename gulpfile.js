const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const fs = require('fs');
const path = require('path');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const gulpIf = require('gulp-if')

const IS_DEV = process.env.NODE_ENV === 'development';

const jsAssetsPath = 'gulp-assets/js/**/*.js';
const scssAssetsPath = 'gulp-assets/scss/**/*.scss';
const destJsAssetsPath = 'public/js';
const destScssAssetsPath = 'public/css';

function rmTask(cb) {
  fs.rmSync(path.resolve(__dirname, destJsAssetsPath), { force: true, recursive: true })
  fs.rmSync(path.resolve(__dirname, destScssAssetsPath), { force: true, recursive: true })
  cb();
}

function jsTask() {
  return src(jsAssetsPath).pipe(gulpIf(IS_DEV, sourcemaps.init()))
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpIf(IS_DEV, sourcemaps.write('.')))
    .pipe(dest(destJsAssetsPath));
}

function scssTask() {
  return src(scssAssetsPath, { sourcemaps: IS_DEV })
    .pipe(plumber()).pipe(gulpIf(IS_DEV, sourcemaps.init()))
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'] }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulpIf(IS_DEV, sourcemaps.write('.')))
    .pipe(dest(destScssAssetsPath, { sourcemaps: IS_DEV }));
}

function watchTask(cb) {
  watch(jsAssetsPath, jsTask);
  watch(scssAssetsPath, scssTask);
}

exports.build = series(rmTask, parallel(jsTask, scssTask));
exports.watch = series(exports.build, watchTask);
exports.default = exports.build;