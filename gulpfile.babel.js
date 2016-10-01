import gulp from 'gulp'
import babel from 'gulp-babel'
import sourcemaps from 'gulp-sourcemaps'
import nodemon from 'nodemon'
import gutil from 'gulp-util'
import through from 'through2'
import Cache from 'gulp-file-cache'
import clean from 'gulp-clean'
import cleanDest from 'gulp-clean-dest'
import runSequence from 'run-sequence'
import removeLines from 'gulp-remove-lines'
import concat from 'gulp-concat'
import addsrc from 'gulp-add-src'
import merge2 from 'merge2'
import header from 'gulp-header'
import path from 'path'
import watch from 'gulp-watch'
import plumber from 'gulp-plumber'
import chokidar from 'chokidar'
import fs from 'fs'
import filter from 'gulp-filter'
import combiner from 'stream-combiner2'
import stream from 'stream'

//
// components
//

const cache = new Cache();

function logFileHelpers(prefix) {
    return through.obj((file, enc, cb) => {
        gutil.log(prefix, gutil.colors.magenta(file.path))
        cb(null, file)
    })
}

function generateDocsPaths() {
    return gulp.src(`${paths.src}/**/paths.yaml`)
        .pipe(removeLines({
            'filters': [
                /^paths:$/
            ]
        }))
        .pipe(concat('paths.yaml'))
        .pipe(header('paths:\n'))
}

function generateDocDefinitions() {
    return gulp.src(`${paths.src}/**/definitions.yaml`)
        .pipe(removeLines({
            'filters': [
                /^definitions:$/
            ]
        }))
        .pipe(concat('definitions.yaml'))
        .pipe(header('definitions:\n'))
}

function generateDoc() {
    merge2(generateDocsPaths(), generateDocDefinitions())
        .pipe(addsrc.prepend(`${paths.src}/docs/index.yaml`))
        .pipe(concat('index.yaml'))
        .pipe(gulp.dest(`${paths.tmp}/swagger-ui`))
}

function cleanWithLog(path) {
    fs.unlink(path, error => {
        if (!error) {
            gutil.log('Delete', gutil.colors.magenta(path))
        } else {
            gutil.log(gutil.colors.red('Failed to delete'), gutil.colors.magenta(path), gutil.colors.red(error))
        }
    })
}

//
// configurations
//

const paths = {
    src: 'src',
    dist: 'dist',
    tmp: 'tmp'
}

//
// tasks
//

gulp.task('clear', ['clear:dev', 'clear:dist'], cb => cb())

gulp.task('clear:dev', ['clear:tmp', 'clear:cache'], cb => cb())
gulp.task('clear:dist', () => gulp.src(paths.dist).pipe(clean({ read: false })))

gulp.task('clear:tmp', () => gulp.src(paths.tmp).pipe(clean()))
gulp.task('clear:cache', () => gulp.src('.gulp-cache').pipe(clean()))


gulp.task('compile', () => {
    return gulp.src(`${paths.src}/**/*.js`)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(logFileHelpers('compiling'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.tmp))
})

gulp.task('generateDocs', () => generateDoc())

gulp.task('serve', ['compile', 'generateDocs', 'watch'], () => {
    nodemon({
        script: paths.tmp,
        watch: paths.tmp,
        ext: 'js',
        execMap: {
            "": "node --harmony_proxies"
        },
        delay: 1
    })
})

gulp.task('watch', () => {
    let watcher = chokidar.watch(paths.src, {
        persistent: true,
        ignoreInitial: true
    })
    watcher
        .on('add', path => {
            gutil.log(
                'File',
                gutil.colors.green('added'),
                gutil.colors.magenta(path)
            )
            if (/\.js$/.test(path))
                gulp.src(path, { base: paths.src })
                    .pipe(sourcemaps.init())
                    .pipe(babel({
                        presets: ['es2015']
                    }))
                    .pipe(logFileHelpers('compiling'))
                    .pipe(sourcemaps.write('.'))
                    .pipe(gulp.dest(paths.tmp))
            if (/\.yaml$/.test(path))
                generateDoc()
        })
        .on('change', path => {
            gutil.log(
                'File',
                gutil.colors.cyan('changed'),
                gutil.colors.magenta(path)
            )
            if (/\.js$/.test(path))
                gulp.src(path, { base: paths.src })
                    .pipe(sourcemaps.init())
                    .pipe(babel({
                        presets: ['es2015']
                    }))
                    .pipe(logFileHelpers('compiling'))
                    .pipe(sourcemaps.write('.'))
                    .pipe(gulp.dest(paths.tmp))
            if (/\.yaml$/.test(path))
                generateDoc()
        })
        .on('unlink', path => {
            gutil.log(
                'File',
                gutil.colors.yellow('deleted'),
                gutil.colors.magenta(path)
            )
            let dest = path.replace(paths.src, paths.tmp)

            if (/\.js$/.test(path)) {
                try {
                    fs.unlinkSync(dest)
                    fs.unlinkSync(dest + '.map')
                    nodemon.emit('restart')
                } catch (error) { }
            }
            if (/\.yaml$/.test(path))
                generateDoc()
        })

        // More possible events. 
        .on('addDir', path => {
            gutil.log(
                'Directory',
                gutil.colors.green('added'),
                gutil.colors.magenta(path)
            )
        })
        .on('unlinkDir', path => {
            gutil.log(
                'Directory',
                gutil.colors.yellow('deleted'),
                gutil.colors.magenta(path)
            )
            try {
                fs.unlinkSync()
            } catch (error) { }
        })
})