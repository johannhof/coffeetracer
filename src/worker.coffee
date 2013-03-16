restoreCam = (cam) ->
  e = new Point3(parseFloat(cam.e.x), parseFloat(cam.e.y), parseFloat(cam.e.z))
  g = new Vector3(parseFloat(cam.g.x), parseFloat(cam.g.y), parseFloat(cam.g.z))
  t = new Vector3(parseFloat(cam.t.x), parseFloat(cam.t.y), parseFloat(cam.t.z))
  if cam.angle
    new PerspectiveCamera(e, g, t, parseFloat(cam.angle))
  else
    new OrthographicCamera(e, g, t, parseFloat(cam.s))

restoreLights = (lights) ->
  returnLights = []
  for light in lights
    color = new Color(parseFloat(light.color.r), parseFloat(light.color.g), parseFloat(light.color.b))
    shadows = light.castsShadows
    position = null
    direction = null
    if light.position
      position = new Point3(parseFloat(light.position.x), parseFloat(light.position.y), parseFloat(light.position.z))
    if light.direction
      direction = new Vector3(parseFloat(light.direction.x), parseFloat(light.direction.y),
                              parseFloat(light.direction.z))
    if position and direction and light.halfAngle
      returnLights.push(new SpotLight(color, shadows, position, direction, parseFloat(light.halfAngle)))
    else if direction
      returnLights.push(new DirectionalLight(color, shadows, direction))
    else if position
      returnLights.push(new PointLight(color, shadows, position))
  returnLights

self.addEventListener('message', (e) ->
  data = JSON.parse(e.data)
  render(data.startW, data.endW, data.startH, data.endH, data.width, data.height, restoreCam(data.cam),
         restoreLights(data.lights))
, false)

render = (startW, endW, startH, endH, width, height, cam, lights) ->
  imgData = []
  objects = [new Node(Transform.Scaling(1, 1, 1),
                      [new Sphere(new PhongMaterial(new Color(1, 0, 0), new Color(1, 1, 1), 20))], null)]
  world = new World(new Color(0, 0, 0), objects, lights, new Color(0.3, 0.3, 0.3), 1)
  tracer = new Tracer(world)
  for x in [startW..endW] by 1
    for y in [startH..endH] by 1
      c = tracer.colorFor((cam.rayFor(width, height, x, y)))
      imgData[(x * width + y) * 4 + 0] = c.r * 255.0
      imgData[(x * width + y) * 4 + 1] = c.g * 255.0
      imgData[(x * width + y) * 4 + 2] = c.b * 255.0
  self.postMessage({imgData})