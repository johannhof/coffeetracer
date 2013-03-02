self.addEventListener('message', (
  (e) ->
    args = JSON.parse(e.data)
    self.postMessage(JSON.stringify(render(args.world,args.cam,args.width,args.height)))
  ), false)
render = (w, c, width, height) ->
  data = []
  world = new World(w.backgroundColor,w.elements,w.lights,w.ambient,w.indexOfRefraction)
  cam = new PerspectiveCamera(c.e,c.g,c.t,c.angle)
  tracer = new Tracer(world)
  for x in [0..width] by 1
    for y in [0..height] by 1
      c = tracer.colorFor((cam.rayFor(width, height, x, y)))
      data[(x * height + y) * 4 + 0] = c.r * 255.0
      data[(x * height + y) * 4 + 1] = c.g * 255.0
      data[(x * height + y) * 4 + 2] = c.b * 255.0
  data