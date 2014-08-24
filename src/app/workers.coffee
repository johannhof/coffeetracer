class WorkerManager
  constructor : (@numberOfWorkers, @height, @width, @cam, @world, @imgData) ->

  workers: []

  finished: 0

  extractImageData: (part, sx, sy, ex, ey) ->
    for x in [sx..ex] by 1
      for y in [sy..ey] by 1
        @imgData.data[(x + (@height - y - 1) * @width) * 4 + 0] = part[(x + (@height - y - 1) * @width) * 4 + 0]
        @imgData.data[(x + (@height - y - 1) * @width) * 4 + 1] = part[(x + (@height - y - 1) * @width) * 4 + 1]
        @imgData.data[(x + (@height - y - 1) * @width) * 4 + 2] = part[(x + (@height - y - 1) * @width) * 4 + 2]

  startWorker: (number, cb) ->
    startW = @width / @numberOfWorkers * number
    endW = startW + @width / @numberOfWorkers
    @workers[number] = new Worker('build/js/engine.js')
    @workers[number].addEventListener('message', (e) =>
      @extractImageData(e.data.imgData, startW, 0, endW, @height)
      if @numberOfWorkers is ++@finished
        cb(@imgData)
    , false)
    @workers[number].postMessage(JSON.stringify({startW, endW, @width, @height, @cam, @world}))

  start: (cb) ->
    @finished = 0
    for number in [0..@numberOfWorkers - 1]
      @startWorker(number, cb)
    # return true to avoid coffeescript making an array of results to return
    true

  stopWorkers: ->
    for i in [0..this.workers.length - 1]
      this.workers[i].terminate()
    $("#loadDiv").toggle()

