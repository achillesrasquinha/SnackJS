var gulp     = require('gulp')
  , ts       = require('gulp-typescript')
  , project  = ts.createProject('tsconfig.json')
  , uglify   = require('gulp-uglify')
  , sass     = require('gulp-sass')
  , csscomb  = require('gulp-csscomb')
  , cleanCSS = require('gulp-clean-css')
  , rename   = require('gulp-rename')
  , src      = __dirname + '/src'
  , dist     = __dirname + '/dist'
  , docs     = __dirname + '/docs';

gulp.task('js' , function ( ) {
  return project.src()
                .pipe(ts(project))
                .js
                .pipe(gulp.dest(dist + '/js'))
                .pipe(uglify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(dist + '/js'))
                .pipe(gulp.dest(docs + '/assets/js/vendor'));
});

gulp.task('css', function ( ) {
  return gulp.src (src + '/scss/snackjs.scss')
             .pipe(sass())
             .pipe(gulp.dest(dist + '/css'))
             .pipe(csscomb())
             .pipe(gulp.dest(dist + '/css'))
             .pipe(cleanCSS())
             .pipe(rename({ suffix: '.min' }))
             .pipe(gulp.dest(dist + '/css'))
             .pipe(gulp.dest(docs + '/assets/css/vendor'));
});

gulp.task('build'  , ['js', 'css']);
gulp.task('default', ['build']);