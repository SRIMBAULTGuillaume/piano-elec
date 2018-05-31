const gulp = require('gulp');
const sass = require('gulp-sass');
const electron = require('electron-connect').server.create();

var refreshSass = function() {
    return gulp.src('./app/style/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/style'));
}

gulp.task('start', () => {

    refreshSass();

    electron.start();

    gulp.watch('./app/*.html', () => {
        electron.restart();
    });
    gulp.watch('./app/js/*.js', () => {
        electron.restart();
    });
    gulp.watch('./app.js', () => {
        electron.restart();
    });

    gulp.watch(['./app/style/sass/**/*.scss'], () => {
        refreshSass();

        electron.reload();
    });
});

gulp.task('sass', function () {
    return refreshSass()
});