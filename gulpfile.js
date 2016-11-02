var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');

// Gulp Dependencies
var rename = require('gulp-rename');
var st = require('st');

// Build Dependencies
var preprocess = require('gulp-preprocess');
var browserify = require('browserify');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var resolutions = require('browserify-resolutions');
var uglify = require('gulp-uglify');
var uglifyjs = require('gulp-uglifyjs');
var extractor    = require('gulp-extract-sourcemap');

var copy = require('gulp-copy');
var clean = require('gulp-clean');
var replace = require('gulp-replace');

// Style Dependencies
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var sass = require('gulp-sass');



/**
 * DEV ENVIRONMENT
 */
gulp.task('browserify-client', function() {
  var b = browserify({
    entries : 'app/scripts/Index.js',
    options: {
      transform: ['reactify'],
      external: ['react/addons']
    },
    debug: true,
  });

  return b
    .transform("reactify", {})
   // .plugin(resolutions, ['react'])
    .bundle()
    .on('error', function(err){
      // print the error (can replace with gulp-util)
      console.log(err.message);
      // end this stream
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(rename('scripts.js'))
    .pipe(gulp.dest('app/public/scripts'))
    .pipe(livereload());
});

gulp.task('uglify', ['browserify-client'], function() {
  return gulp.src('app/public/scripts/scripts_big.js')
    .pipe(uglify())
    .on('error', console.error.bind(console))
    .pipe(rename('scripts.js'))
    .pipe(gulp.dest('app/public/scripts'));
});

gulp.task('styles', function() {
  return gulp.src('app/sass/main.scss')
    .pipe(sass())
    .pipe(prefix({ cascade: true }))
    .on('error', function (err) {
            console.log(err.toString());
            this.emit("end");
        })
    .pipe(rename('styles.css'))
    //.pipe(gulp.dest('build'))
    .pipe(gulp.dest('app/public/styles'))
    .pipe(livereload());
});



gulp.task('html',function(){
    return gulp.src('app/index.html')
    .pipe(livereload());
});



gulp.task('watch', function() {
    livereload.listen();
	  gulp.watch(['app/**/*.js',  '!app/public/scripts/scripts.js'], ['browserify-client']);
	  gulp.watch(['app/**/*.scss', '!app/public/styles/styles.css'], ['styles']);
    gulp.watch('app/index.html', ['html']);
});


gulp.task('server',function(){
    nodemon({
        'script': 'server.js',
        'ignore': 'public/**/*'
    });
});

gulp.task('serve', ['server','watch']);

/**
 * PRODUCTION ENV
 */

gulp.task('prepare-build',['clean','uglify','minify'], function(){
  return gulp.src(["./server.js", "app/public/fonts/**","app/public/images/**"])
    .pipe(copy("./dist"));
});




gulp.task('build', ['prepare-build'], function(){
  var num = new Date().getTime();
  gulp.src('./dist/public/scripts/scripts.min.js')
    .pipe(rename("scripts.min"+num.toString()+".js"))
    .pipe(gulp.dest("./dist/public/scripts"));

  gulp.src('./dist/public/styles/styles.min.css')
    .pipe(rename("styles.min"+num.toString()+".css"))
    .pipe(gulp.dest("./dist/public/styles"));

  gulp.src(["./dist/public/scripts/scripts.min.js", "./dist/public/styles/styles.min.css", "./dist/public/styles/styles.css"])
    .pipe(clean());

  gulp.src(['./app/index.html'])
    .pipe(preprocess())
    .pipe(replace("scripts.js","scripts.min"+num.toString()+".js"))
    .pipe(replace("styles.css","styles.min"+num.toString()+".css"))
    .pipe(gulp.dest("./dist"));
});



gulp.task('default', ['browserify-client', 'styles', 'server', 'watch']);
