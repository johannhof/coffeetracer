$ = jQuery
$ ->
  $("#goButton").click ->
    parseData()
    render()
  canvas = document.getElementById("mainCanvas")
  ctx = canvas.getContext("2d")
  ctx.fillStyle = "white"
  width = canvas.width
  height = canvas.height
  ctx.fillRect(0, 0, width, height)
  imgData = ctx.getImageData(0, 0, width, height)
  lights = [new PointLight(new Color(1, 1, 1), false, new Point3(0, 6, 6))]
  objects = [new Node(Transform.Scaling(1, 1, 1), [new Sphere(new PhongMaterial(new Color(1, 0, 0), new Color(1, 1, 1), 20))], null)]
  cam = new PerspectiveCamera(new Point3(5, 5, 5), new Vector3(-1, -1, -1), new Vector3(0, 1, 0), Math.PI / 4)
  world = new World(new Color(0, 0, 0), objects, lights, new Color(0.1, 0.1, 0.1), 1)
  parseData = ->
    lights = parseLights()
    objects = [new Node(Transform.Scaling(1, 1, 1), [new Sphere(new PhongMaterial(new Color(1, 0, 0), new Color(1, 1, 1), 20))], null)]
    cam = new PerspectiveCamera(new Point3(5, 5, 5), new Vector3(-1, -1, -1), new Vector3(0, 1, 0), Math.PI / 4)
    world = new World(new Color(0, 0, 0), objects, lights, new Color(0.1, 0.1, 0.1), 1)
  parseLights = ->
    lights = []
    #$(lightsDiv)
    lights
  render = ->
    tracer = new Tracer(world)
    for x in [0..width] by 1
      for y in [0..height] by 1
        c = tracer.colorFor((cam.rayFor(width, height, x, y)))
        imgData.data[(x * height + y) * 4 + 0] = c.r * 255.0
        imgData.data[(x * height + y) * 4 + 1] = c.g * 255.0
        imgData.data[(x * height + y) * 4 + 2] = c.b * 255.0
    ctx.putImageData(imgData, 0, 0)
  #document.getElementById("loadDiv").style.display = "none"
  render()