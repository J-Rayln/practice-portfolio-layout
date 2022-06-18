const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// /**
//  * Template for banner to add to file headers
//  */
// 
//  var banner = {
// 	main:
// 		'/*!' +
// 		' <%= package.name %> v<%= package.version %>' +
// 		' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
// 		' | <%= package.license %> License' +
// 		' | <%= package.repository.url %>' +
// 		' */\n'
// };

// Sass Task
function scssTask(){
    return src('src/scss/main.scss', { sourcemaps: true })
      .pipe(sass({
        outputStyle: 'expanded',
        sourceComments: true
      }))
      // .pipe(postcss([cssnano()]))
      .pipe(dest('assets/css', { sourcemaps: '.'}));
}

// JavaScript Tasks
function jsTask(){
  return src('src/js/script.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('assets/js', { sourcemaps: '.'}));
}

// BrowserSync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('*.html', browsersyncReload);
  watch(['src/scss/**/*.scss', 'src/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask
);