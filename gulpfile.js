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

    //Watch js files and restart Electron if they change
    gulp.watch('./*.js', () => {
        electron.restart();
    });
    //watch css files, but only reload (no restart necessary)
    gulp.watch(['./app/style/sass/**/*.scss'], () => {
        refreshSass();

        electron.reload();
    });
    //watch html
    gulp.watch(['.app/index.html'], electron.reload());
});

gulp.task('sass', function () {
    return refreshSass()
});