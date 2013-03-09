self.addEventListener('message', (e) ->
  render(e.data.startW, e.data.endW, e.data.startH, e.data.endH, e.data.width, e.data.height)
, false)

render = (startW, endW, startH, endH, width, height) ->
  imgData = []
  objects = [new Node(Transform.Scaling(1, 1, 1), [new Sphere(new PhongMaterial(new Color(1, 0, 0), new Color(1, 1, 1), 20))], null)]
  cam = new PerspectiveCamera(new Point3(5, 5, 5), new Vector3(-1, -1, -1), new Vector3(0, 1, 0), Math.PI / 4)
  world = new World(new Color(0, 0, 0), objects, [new PointLight(new Color(1, 1, 1), true, new Point3(1, 1, 1))], new Color(0.3, 0.3, 0.3), 1)
  tracer = new Tracer(world)
  for x in [startW..endW] by 1
    for y in [startH..endH] by 1
      c = tracer.colorFor((cam.rayFor(width, height, x, y)))
      imgData[(x * height + y) * 4 + 0] = c.r * 255.0
      imgData[(x * height + y) * 4 + 1] = c.g * 255.0
      imgData[(x * height + y) * 4 + 2] = c.b * 255.0
  self.postMessage({imgData})