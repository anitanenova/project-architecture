const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create(); //reload browser
const postcss = require('gulp-postcss'); //gulp plugin to pipe CSS through several plugins
const sourcemaps = require('gulp-sourcemaps'); // if we use plugins we have to use it

const cssnano = require('gulp-cssnano'); // minify css files
const rename = require('gulp-rename');
const sassLint = require('gulp-sass-lint'); 
const uglifyJS = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat'); // Concatenates files
const imagemin = require('gulp-imagemin');


const paths = {
	source: {
		scripts: "src/scripts/",
		sass: "src/sass/",
		images: "src/images/",
	},
	destination: {
		scripts: "dist/scripts/",
		css: "dist/css/",
		images: "dist/images/",
	},
};

/* start task for scss */
gulp.task('sass', function(){
  return gulp.src(paths.source.sass + 'master.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass     
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.destination.css)))
});
/* end task for scss */

/* start task for css min */
gulp.task('cssmin', function(){
  return gulp.src(paths.destination.css + 'master.css')
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.destination.css))
});
/* end task for css min */

/* start task for scripts */
gulp.task('scripts', function(){
  return gulp.src([paths.source.scripts + '/vendor/sample-library.js', paths.source.scripts + 'vendor/sample-library2.js'])
    .pipe(babel({presets: ['@babel/preset-env'] })) 
    .pipe(concat('bundle.js'))
    .pipe(uglifyJS())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.destination.scripts))
});
/* ent task for scripts */

/* start task for images */

function img() {
  return gulp.src(paths.source.images + "*")
  .pipe(imagemin())
  .pipe(gulp.dest(paths.destination.images));
}

gulp.task('img', img);

gulp.task('watch', () => {
  gulp.watch('./src/images/*', img);
});

/* end task for images */


gulp.task('watch', function(){
  browserSync.init({
    server: {
    baseDir: './'
    },
});

gulp.watch(paths.source.sass + '**/*.scss', gulp.series('sass')).on("change", browserSync.reload);
gulp.watch(paths.destination.css + 'master.css', gulp.series('cssmin')).on("change", browserSync.reload);
gulp.watch(paths.source.scripts + '**/*.js', gulp.series('scripts')).on("change", browserSync.reload); 
});

gulp.task("default", gulp.series('img', 'watch'));



 
 

