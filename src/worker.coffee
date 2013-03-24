restoreCam = (cam) ->
  e = restorePoint(cam.e)
  g = restoreVector(cam.g)
  t = restoreVector(cam.t)
  if cam.angle
    new PerspectiveCamera(e, g, t, parseFloat(cam.angle))
  else
    new OrthographicCamera(e, g, t, parseFloat(cam.s))

restoreWorld = (world) ->
  new World(restoreColor(world.backgroundColor), restoreObjects(world.elements), restoreLights(world.lights),
            restoreColor(world.ambient), parseFloat(world.indexOfRefraction))

restoreObjects = (objects) ->
  (restoreObject object for object in objects)

restoreObject = (object) ->
  if object.a and object.n
    return new Plane(restoreMaterial(object.material), restorePoint(object.a), restoreNormal(object.n))
  if object.lbf
    return new AxisAlignedBox(restoreMaterial(object.material), restorePoint(object.lbf), restorePoint(object.run))
  if object.c and object.r
    return new Sphere(restoreMaterial(object.material), restorePoint(object.c), parseFloat(object.r))
  if object.geometries
    return new Node(restoreTransformation(object.transformation), restoreObjects(object.geometries))

restoreTransformation = (transformation) ->
  new Transform(restoreMat4x4(transformation.m), restoreMat4x4(transformation.i))


restoreMat4x4 = (matrix) ->
  new Mat4x4(matrix.m11, matrix.m12, matrix.m13, matrix.m14, matrix.m21, matrix.m22, matrix.m23, matrix.m24, matrix.m31,
             matrix.m32, matrix.m33, matrix.m34, matrix.m41, matrix.m42, matrix.m43, matrix.m44)

restoreMaterial = (material) ->
  if material.indexOfRefraction
    return new TransparentMaterial(parseFloat(material.indexOfRefraction))
  if material.reflection
    return new ReflectiveMaterial(restoreColor(material.diffuse), restoreColor(material.specular),
                                  parseFloat(material.exponent), restoreColor(material.reflection))
  if material.diffuse
    return new PhongMaterial(restoreColor(material.diffuse), restoreColor(material.specular),
                             parseFloat(material.exponent))
  if material.singleColorIndicator
    return new SingleColorMaterial(restoreColor(material.color))
  new LambertMaterial(restoreColor(material.color))


restoreColor = (color) ->
  new Color(parseFloat(color.r), parseFloat(color.g), parseFloat(color.b))

restorePoint = (point) ->
  new Point3(parseFloat(point.x), parseFloat(point.y), parseFloat(point.z))

restoreVector = (vector) ->
  new Vector3(parseFloat(vector.x), parseFloat(vector.y), parseFloat(vector.z))

restoreNormal = (normal) ->
  new Normal3(parseFloat(normal.x), parseFloat(normal.y), parseFloat(normal.z))

restoreLights = (lights) ->
  returnLights = []
  for light in lights
    color = restoreColor(light.color)
    shadows = light.castsShadows
    position = null
    direction = null
    if light.position
      position = restorePoint(light.position)
    if light.direction
      direction = restoreVector(light.direction)
    if position and direction and light.halfAngle
      returnLights.push(new SpotLight(color, shadows, position, direction, parseFloat(light.halfAngle)))
    else if direction
      returnLights.push(new DirectionalLight(color, shadows, direction))
    else if position
      returnLights.push(new PointLight(color, shadows, position))
  returnLights

initialize = (e) ->
  data = JSON.parse(e.data)
  render(data.startW, data.endW, data.width, data.height, restoreCam(data.cam),
         restoreWorld(data.world))

self.addEventListener('message', initialize, false)

render = (startW, endW, width, height, cam, world) ->
  imgData = []
  tracer = new Tracer(world)
  for x in [startW..endW] by 1
    for y in [0..height] by 1
      c = tracer.colorFor((cam.rayFor(width, height, y, width - x - 1)))
      imgData[(x * height + y) * 4 + 0] = c.r * 255.0
      imgData[(x * height + y) * 4 + 1] = c.g * 255.0
      imgData[(x * height + y) * 4 + 2] = c.b * 255.0
  self.postMessage({imgData})