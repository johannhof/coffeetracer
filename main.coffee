$ = jQuery
$ ->
  $("#loadDiv").toggle()
  #######Objects#######
  nodeHTML = $("#nodeHTMLExample").html()
  sphereHTML = $("#sphereHTMLExample").html()
  boxHTML = $("#boxHTMLExample").html()
  planeHTML = $('#planeHTMLExample').html()
  $("#objectsDiv .addButton").click ->
    $(this).parent().parent().append(getObjectHTML($(this).parent().children(".selectObject").val()))
  getObjectHTML = (className) ->
    switch className
      when "Node" then return nodeHTML
      when "Sphere" then return sphereHTML
      when "Box" then return boxHTML
      when "Plane" then return planeHTML
      else
        className + "not valid"

  #######Lights#######
  pointLightHTML = $("#pointLightExample").html()
  spotLightHTML = $("#spotLightExample").html()
  directionalLightHTML = $("#directionalLightExample").html()
  $("#lightsDiv .addButton").click ->
    $(this).parent().parent().append(getLightHTML($(this).parent().children(".selectLight").val()))
  getLightHTML = (lightName) ->
    switch lightName
      when "PointLight" then pointLightHTML
      when "SpotLight" then spotLightHTML
      when "DirectionalLight" then directionalLightHTML
      else
        lightName + "not valid"

  #######Cameras#######
  $("#selectCamera").change ->
    if this.value is "PerspectiveCamera"
      $("#cameraSpec").html '<label for="camera_alpha">alpha = PI / </label><input id="camera_alpha" value="4" size="2">'
    else if this.value is "OrthographicCamera"
      $("#cameraSpec").html '<label for="camera_s">s = </label><input id="camera_s" value="5" size="2">'
    else alert "Fail"

  parseCameraDiv = ->
    e = new Point3($("#camera_e_x").val(), $("#camera_e_y").val(), $("#camera_e_z").val())
    g = new Vector3($("#camera_g_x").val(), $("#camera_g_y").val(), $("#camera_g_z").val())
    t = new Vector3($("#camera_t_x").val(), $("#camera_t_y").val(), $("#camera_t_z").val())
    aOrS = $("#cameraSpec input")[0].value
    if $("#selectCamera")[0].value is "PerspectiveCamera"
      return new PerspectiveCamera(e, g, t, Math.PI / aOrS)
    else if $("#selectCamera")[0].value is "OrthographicCamera"
      return new OrthographicCamera(e, g, t, aOrS)

  #######Canvas Setup########
  canvas = document.getElementById "mainCanvas"
  ctx = canvas.getContext "2d"
  ctx.fillStyle = "white"
  width = canvas.width
  height = canvas.height
  ctx.fillRect(0, 0, width, height)
  imgData = ctx.getImageData(0, 0, width, height)

  #######Render Setup########
  numberOfFinishedWorkers = 0
  startTime = 0

  #######Parsing#######
  cam = null;
  world = null;
  parseAmbientLight = ->
    ambientDiv = $("#ambientLight")
    new Color(parseFloat($(ambientDiv).children(".redInput").val()), parseFloat($(ambientDiv).children(".greenInput").val()), parseFloat($(ambientDiv).children(".blueInput").val()))

  parseBackgroundColor = ->
    worldDiv = $("#worldDiv")
    new Color(parseFloat($(worldDiv).children(".redInput").val()), parseFloat($(worldDiv).children(".greenInput").val()), parseFloat($(worldDiv).children(".blueInput").val()))

  parseLights = ->
    lightDivs = $("#lightsDiv").children("div")
    (parseLightDiv lightDiv for lightDiv in lightDivs when $(lightDiv).children(".lightCheck").is ":checked")

  parseLightDiv = (lightDiv) ->
    lightClass = $(lightDiv).attr "class"
    color = new Color(parseFloat($(lightDiv).children(".redInput").val()), parseFloat($(lightDiv).children(".greenInput").val()), parseFloat($(lightDiv).children(".blueInput").val()))
    shadows = $(lightDiv).children(".lightCheck").is ":checked"
    position = new Point3(parseFloat($(lightDiv).children(".posX").val()), parseFloat($(lightDiv).children(".posY").val()), parseFloat($(lightDiv).children(".posZ").val()))
    if lightClass is "pointLight" then return new PointLight(color, shadows, position)
    direction = new Vector3(parseFloat($(lightDiv).children(".dirX").val()), parseFloat($(lightDiv).children(".dirY").val()), parseFloat($(lightDiv).children(".dirZ").val()))
    if lightClass is "directionalLight" then return new DirectionalLight(color, shadows, direction)
    new SpotLight(color, shadows, position, direction, Math.PI / parseFloat($(lightDiv).children(".halfAngle").val()))

  parseData = ->
    objects = [new Node(Transform.Scaling(1, 1, 1), [new Sphere(new PhongMaterial(new Color(1, 0, 0), new Color(1, 1, 1), 20))], null)]
    cam = parseCameraDiv()
    world = new World(parseBackgroundColor(), objects, parseLights(), parseAmbientLight(), parseFloat($("#worldDiv").children(".indexOfRefraction").val()))

  startWorker = (number, numberOfWorkers)->
    startH = width / numberOfWorkers * number
    endH = startH + width / numberOfWorkers
    worker = new Worker('engine.js')
    worker.addEventListener('message', (e) ->
      extractImageData(e.data.imgData, 0, startH, 500, endH)
      if numberOfWorkers is ++numberOfFinishedWorkers
        ctx.putImageData(imgData, 0, 0)
        $("#loadDiv").toggle()
        alert("Time: " + (Date.now() - startTime) / 1000)
    , false)
    worker.postMessage(JSON.stringify({startH, startW: 0, endH, endW: 500, width, height, cam}))

  render = (webWorkers) ->
    startTime = Date.now()
    if webWorkers
      $("#loadDiv").toggle()
      numberOfFinishedWorkers = 0
      for i in [0..1]
        startWorker(i, 2)
    else
      tracer = new Tracer(world)
      for x in [0..width] by 1
        for y in [0..height] by 1
          c = tracer.colorFor((cam.rayFor(width, height, x, y)))
          imgData.data[(x * height + height - y - 1) * 4 + 0] = c.r * 255.0
          imgData.data[(x * height + height - y - 1) * 4 + 1] = c.g * 255.0
          imgData.data[(x * height + height - y - 1) * 4 + 2] = c.b * 255.0
      ctx.putImageData(imgData, 0, 0)
      alert("Time: " + (Date.now() - startTime) / 1000)

  extractImageData = (newImgData, sx, sy, ex, ey) ->
    for x in [sx..ex] by 1
      for y in [sy..ey] by 1
        imgData.data[(x * height + y) * 4 + 0] = newImgData[(x * height + y) * 4 + 0]
        imgData.data[(x * height + y) * 4 + 1] = newImgData[(x * height + y) * 4 + 1]
        imgData.data[(x * height + y) * 4 + 2] = newImgData[(x * height + y) * 4 + 2]

  $("#goButton").click ->
    parseData()
    render($("#webworkers")[0].checked)