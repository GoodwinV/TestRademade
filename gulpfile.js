var gulp = require('gulp'),                      // Gulp JS
    imagemin = require('gulp-imagemin'),         // Minify images
    include = require('gulp-include'),           // HTML Templates
    csso = require('gulp-csso'),                 // Minify CSS
    autoprefixer = require('gulp-autoprefixer'), // Gulp autoprefixer
    sass = require("gulp-sass"),                 // Sass compiler
    rename = require("gulp-rename"),             // Rename files
    sourcemaps = require("gulp-sourcemaps"),     // Add sourcemaps
    pug = require('gulp-pug'),                   // Jade
    del = require("del"),                        // Clean folder

    browserSync = require('browser-sync').create(); // Browser reload on changes

/*---------------------------------------------------------------------------------*/
/*------------------------------ COMPRESS IMAGES ----------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task('compressImages', function(){
    gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});
/*---------------------------------------------------------------------------------*/
/*----------------------------- CSS PREPROCESSORS ---------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task('cssPreprocessor', function() {
    return gulp.src(['src/scss/style.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 15 versions']}))
        .pipe(csso())
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload ({
            stream: true
        }))
});

/*---------------------------------------------------------------------------------*/
/*----------------------------------- HTML ----------------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task('html', function buildHTML() {
    return gulp.src('src/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({
            stream:true
        }));
});

/*---------------------------------------------------------------------------------*/
/*------------------------------- HTML INCLUDES RELOAD ----------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task("includes", function() {
    gulp.src('src/*.pug')
        .pipe(include())
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.reload({
            stream:true
        }));
});

/*---------------------------------------------------------------------------------*/
/*------------------------------- SERVER RELOAD -----------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task("browserSync", function () {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    })
});

/*---------------------------------------------------------------------------------*/
/*------------------------------- CLEAN DIST FOLDER -------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task("clean:dist", function () {
    return del.sync(['dist/**/*']);
});

/*---------------------------------------------------------------------------------*/
/*---------------------------------- DEFAULT --------------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task("watch",['browserSync', 'html','includes', 'cssPreprocessor'], function(){
    gulp.watch("src/scss/**/*.scss", ["cssPreprocessor"]);
    gulp.watch("src/**/*.pug", ['html']);

});

gulp.task("mainTask", function () {
    gulp.run('html', 'cssPreprocessor', 'browserSync', 'watch');
});

gulp.task('default', function(){
    gulp.run('browserSync', 'html','compressImages', 'cssPreprocessor', 'includes');
});
