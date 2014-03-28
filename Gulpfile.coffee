gulp = require 'gulp'
gutil = require 'gulp-util'

coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'

connect = require 'connect'
path = require 'path'

SERVER_PORT = 4000

src =
  engine: ['src/**/*.coffee'],
  app: ['app.coffee']

out = 'build'

gulp.task 'server', ->
  connect().use(connect.static(path.resolve("./"))).listen(SERVER_PORT)
  console.log "Server running on http://localhost:" + SERVER_PORT

gulp.task 'app', ->
  gulp.src(src.app)
    .pipe(coffee()).on('error', gutil.log)
    .pipe(uglify())
    .pipe(gulp.dest(out))

gulp.task 'engine', ->
  gulp.src(src.engine)
    .pipe(concat('engine.coffee'))
    .pipe(coffee()).on('error', gutil.log)
    .pipe(uglify())
    .pipe(gulp.dest(out))

gulp.task 'watch', ->
  gulp.watch(src.engine.concat(src.app), ['build'])

gulp.task 'build', ['engine', 'app']

gulp.task 'default', ['server', 'build', 'watch']
