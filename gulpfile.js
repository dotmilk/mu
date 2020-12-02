let gulp = require('gulp')
let concat = require('gulp-concat')
let less = require('gulp-less')
let path = require('path')
let strip = require('gulp-strip-comments')
let removeEmptyLines = require('gulp-remove-empty-lines')
let order = require('gulp-order')

gulp.task('script', function() {
    return gulp.src('./src/**/*.js',{ base: './src'})
        .pipe(concat('mu.js'))
        .pipe(strip())
        .pipe(removeEmptyLines())
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./example/js/'))
})

gulp.task('muDom',function(){
    return gulp.src(['./src/dom/muCss.js','./src/dom/muDom.js','./src/dom/muTagen.js'])
        .pipe(concat('muDom.js'))
        .pipe(gulp.dest('./dist/muDom/'))
})

gulp.task('css', function() {
    return gulp.src('./src/styles.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(gulp.dest('./example/'))
        .pipe(gulp.dest('../conflux/gui/css'))
})

gulp.task('watch', function() {
    let watcher = gulp.watch('./src/**/*.js',gulp.series('script','muDom','docs'))
    gulp.watch('./src/*.less',gulp.series('css'))
    watcher.on('change',()=>{
        console.log('Change detected')
    })
})

gulp.task('docs', function () {
    const fs = require('fs-then-native')
    const jsdoc2md = require('jsdoc-to-markdown')

    return jsdoc2md.render({ files: './src/**/*.js',
                             template: fs.readFileSync('README.hbs','utf8')})
        .then(output => fs.writeFile('./README.md', output))
})
