let gulp = require('gulp')
let concat = require('gulp-concat')
let less = require('gulp-less')
let path = require('path')

gulp.task('script', function() {
    return gulp.src(['./src/muMultiInherit.js',
                     './src/muPaginator.js',
                     './src/muCss.js',
                     './src/muDom.js',
                     './src/muNodeManager.js',
                     './src/muPage.js',
                     './src/muEvent.js',
                     './src/muObservableObject.js',
                     './src/muCollection.js',
                     './src/muStateMachine.js',
                     './src/muPageManager.js',
                     './src/muManager.js',
                     './src/muTagen.js',
                     './src/muView.js',
                     './src/muSelects.js',
                     './src/muTable.js'])
        .pipe(concat('mu.js'))
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
    let watcher = gulp.watch('./src/*.js',['script','muDom'])
    gulp.watch('./src/*.less',['css'])
    watcher.on('change',()=>{
        console.log('Change detected')
    })
})
