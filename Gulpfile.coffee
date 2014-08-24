gulp = require 'gulp'
gutil = require 'gulp-util'

coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
react = require 'gulp-react'
header = require 'gulp-header'
less = require 'gulp-less'

connect = require 'connect'
path = require 'path'

SERVER_PORT = 4000

src =
  engine: ['src/engine/**/*.coffee']
  app: ['src/app/**/*.coffee']
  style : ['style/**/*.less']

out =
  js : 'build/js'
  css : 'build/css'

gulp.task 'server', ->
  connect().use(connect.static(path.resolve("./"))).listen(SERVER_PORT)
  console.log "Server running on http://localhost:" + SERVER_PORT

gulp.task 'app', ->
  gulp.src(src.app)
    .pipe(concat('app.coffee'))
    .pipe(coffee()).on('error', gutil.log)
    .pipe(header('/** @jsx React.DOM */'))
    .pipe(react()).on('error', gutil.log)
    #.pipe(uglify())
    .pipe(gulp.dest(out.js))

gulp.task 'engine', ->
  gulp.src(src.engine)
    .pipe(concat('engine.coffee'))
    .pipe(coffee()).on('error', gutil.log)
    .pipe(uglify())
    .pipe(gulp.dest(out.js))

gulp.task 'style', ->
  gulp.src(src.style)
    .pipe(less()).on('error', gutil.log)
    .pipe(gulp.dest(out.css))

gulp.task 'watch', ->
  gulp.watch(src.engine.concat(src.app).concat(src.style), ['build'])

gulp.task 'build', ['engine', 'app', 'style']

gulp.task 'default', ['server', 'build', 'watch']
