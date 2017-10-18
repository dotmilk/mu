let gulp = require('gulp')
let concat = require('gulp-concat')
let less = require('gulp-less')
let path = require('path')
let strip = require('gulp-strip-comments')
let removeEmptyLines = require('gulp-remove-empty-lines')
let order = require('gulp-order')

gulp.task('script', function() {
    return gulp.src('./src/**/*.js')
        .pipe(order(['dom/*.js',
                     'util/*.js',
                     'app/*.js',
                     'core/muView.js',
                     'widgets/*.js']))
        .pipe(concat('mu.js'))
        .pipe(strip())
        .pipe(removeEmptyLines())
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./example/'))
        .pipe(gulp.dest('../conflux/gui/js'))
})

gulp.task('muDom',function(){
    return gulp.src(['./src/muCss.js','./src/muDom.js'])
        .pipe(concat('muDom.js'))
        .pipe(gulp.dest('./dist/muDom/'))
})

gulp.task('css', function() {
    return gulp.src('./src/styles.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./example/'))
        .pipe(gulp.dest('../conflux/gui/css'))
})

gulp.task('watch', function() {
    let watcher = gulp.watch('./src/**/*.js',['script','muDom','docs'])
    gulp.watch('./src/*.less',['css'])
    watcher.on('change',()=>{
        console.log('Change detected')
    })
})

gulp.task('docs', function () {
    const fs = require('fs-then-native')
    const jsdoc2md = require('jsdoc-to-markdown')

    return jsdoc2md.render({ files: './src/**/*.js' })
        .then(output => fs.writeFile('./README.md', output))
})
