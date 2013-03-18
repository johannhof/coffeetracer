$ = jQuery
$ ->
  $("#loadDiv").toggle()
  #######Objects#######
  nodeHTML = $("#nodeHTMLExample").html()
  sphereHTML = $("#sphereHTMLExample").html()
  boxHTML = $("#boxHTMLExample").html()
  planeHTML = $("#planeHTMLExample").html()
  SingleColorMaterialHTML = $("#SingleColorMaterialHTMLExample").html()
  LambertMaterialHTML = $("#LambertMaterialHTMLExample").html()
  PhongMaterialHTML = $("#PhongMaterialHTMLExample").html()
  ReflectiveMaterialHTML = $("#ReflectiveMaterialHTMLExample").html()
  TransparentMaterialHTML = $("#TransparentMaterialHTMLExample").html()
  $("#addObjectButton").click ->
    $("#objects").append(getObjectHTML($("#selectObject").val()))
  getObjectHTML = (className) ->
    switch className
      when "Node" then return createObjectDiv "node", nodeHTML
      when "Sphere" then createObjectDiv "sphere", sphereHTML
      when "Box" then createObjectDiv "box", boxHTML
      when "Plane" then createObjectDiv "plane", planeHTML
      else
        className + "not valid"

  createObjectDiv = (objectName, html) ->
    div = document.createElement "div"
    div.setAttribute("class", objectName)
    $(div).append html
    $(div).children(".removeButton").click ->
      $(div).remove()
    $(div).children(".selectMaterial").change ->
      $(div).children(".materialContainer").html(getMaterialHTML(this.value))
    div


  getMaterialHTML = (materialName) ->
    switch materialName
      when "SingleColorMaterial" then SingleColorMaterialHTML
      when "LambertMaterial" then LambertMaterialHTML
      when "PhongMaterial" then PhongMaterialHTML
      when "ReflectiveMaterial" then ReflectiveMaterialHTML
      when "TransparentMaterial" then TransparentMaterialHTML
      else
        null

  #######Lights#######
  pointLightHTML = $("#pointLightExample").html()
  spotLightHTML = $("#spotLightExample").html()
  directionalLightHTML = $("#directionalLightExample").html()
  $("#addLightButton").click ->
    $("#lightsDiv").append(getLightHTML($("#selectLight").val()))
  getLightHTML = (lightName) ->
    switch lightName
      when "PointLight" then createObjectDiv "pointLight", pointLightHTML
      when "SpotLight" then createObjectDiv "spotLight", spotLightHTML
      when "DirectionalLight" then createObjectDiv "directionalLight", directionalLightHTML
      else
        lightName + "not valid"

  #######Cameras#######
  $("#selectCamera").change ->
    if this.value is "PerspectiveCamera"
      $("#cameraSpec").html '<label for="camera_alpha">alpha = PI / </label><input type="text" id="camera_alpha" value="4" size="2">'
    else if this.value is "OrthographicCamera"
      $("#cameraSpec").html '<label for="camera_s">s = </label><input type="text" id="camera_s" value="5" size="2">'
    else alert "Fail"

  parseCameraDiv = ->
    e = new Point3(parseFloat($("#camera_e_x").val()), parseFloat($("#camera_e_y").val()),
                   parseFloat($("#camera_e_z").val()))
    g = new Vector3(parseFloat($("#camera_g_x").val()), parseFloat($("#camera_g_y").val()),
                    parseFloat($("#camera_g_z").val()))
    t = new Vector3(parseFloat($("#camera_t_x").val()), parseFloat($("#camera_t_y").val()),
                    parseFloat($("#camera_t_z").val()))
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
    new Color(parseFloat($(ambientDiv).children(".redInput").val()),
              parseFloat($(ambientDiv).children(".greenInput").val()),
              parseFloat($(ambientDiv).children(".blueInput").val()))

  parseObjects = ->
    objectDivs = $("#objects").children("div")
    (parseObjectDiv objectDiv for objectDiv in objectDivs)

  parseObjectDiv = (objectDiv) ->
    objectClass = $(objectDiv).attr "class"
    material = parseMaterial(objectDiv)
    objectContainer = $(objectDiv).children(".objectContainer")[0]
    if not objectContainer
      switch objectClass
        when "plane" then return new Plane(material)
        when "box" then return new AxisAlignedBox(material)
        when "sphere" then return new Sphere(material)
    else
      switch objectClass
        when "plane"
          a = new Point3(parseFloat($(objectContainer).children(".planeAX").val()),
                         parseFloat($(objectContainer).children(".planeAY").val()),
                         parseFloat($(objectContainer).children(".planeAZ").val()))
          n = new Normal3(parseFloat($(objectContainer).children(".planeNX").val()),
                          parseFloat($(objectContainer).children(".planeNY").val()),
                          parseFloat($(objectContainer).children(".planeNZ").val()))
          return new Plane(material, a, n)
        when "box"
          lbf = new Point3(parseFloat($(objectContainer).children(".boxLBFX").val()),
                           parseFloat($(objectContainer).children(".boxLBFY").val()),
                           parseFloat($(objectContainer).children(".boxLBFZ").val()))
          run = new Point3(parseFloat($(objectContainer).children(".boxRUNX").val()),
                           parseFloat($(objectContainer).children(".boxRUNY").val()),
                           parseFloat($(objectContainer).children(".boxRUNZ").val()))
          return new AxisAlignedBox(material, lbf, run)
        when "sphere"
          c = new Point3(parseFloat($(objectContainer).children(".sphereCenterX").val()),
                         parseFloat($(objectContainer).children(".sphereCenterY").val()),
                         parseFloat($(objectContainer).children(".sphereCenterZ").val()))
          r = parseFloat($(objectContainer).children(".sphereRadius").val())
          return new Sphere(material, c, r)

  parseMaterial = (objectDiv) ->
    materialClass = $(objectDiv).children(".selectMaterial").val()
    materialContainer = $(objectDiv).children(".materialContainer")
    switch materialClass
      when "SingleColorMaterial"
        new SingleColorMaterial(new Color(parseFloat($(materialContainer).children(".redInput").val()),
                                          parseFloat($(materialContainer).children(".greenInput").val()),
                                          parseFloat($(materialContainer).children(".blueInput").val())))
      when "LambertMaterial"
        new LambertMaterial(new Color(parseFloat($(materialContainer).children(".redInput").val()),
                                      parseFloat($(materialContainer).children(".greenInput").val()),
                                      parseFloat($(materialContainer).children(".blueInput").val())))
      when "PhongMaterial"
        new PhongMaterial(new Color(parseFloat($(materialContainer).children(".diffuse.redInput").val()),
                                    parseFloat($(materialContainer).children(".diffuse.greenInput").val()),
                                    parseFloat($(materialContainer).children(".diffuse.blueInput").val())),
                          new Color(parseFloat($(materialContainer).children(".specular.redInput").val()),
                                    parseFloat($(materialContainer).children(".specular.greenInput").val()),
                                    parseFloat($(materialContainer).children(".specular.blueInput").val())),
                          parseFloat($(materialContainer).children(".exponent").val()))
      when "ReflectiveMaterial"
        new ReflectiveMaterial(new Color(parseFloat($(materialContainer).children(".diffuse.redInput").val()),
                                         parseFloat($(materialContainer).children(".diffuse.greenInput").val()),
                                         parseFloat($(materialContainer).children(".diffuse.blueInput").val())),
                               new Color(parseFloat($(materialContainer).children(".specular.redInput").val()),
                                         parseFloat($(materialContainer).children(".specular.greenInput").val()),
                                         parseFloat($(materialContainer).children(".specular.blueInput").val())),
                               parseFloat($(materialContainer).children(".exponent").val()),
                               new Color(parseFloat($(materialContainer).children(".reflection.redInput").val()),
                                         parseFloat($(materialContainer).children(".reflection.greenInput").val()),
                                         parseFloat($(materialContainer).children(".reflection.blueInput").val())))
      when "TransparentMaterial"
        new TransparentMaterial(parseFloat($(materialContainer).children(".indexOfRefraction").val()))

  parseBackgroundColor = ->
    worldDiv = $("#worldDiv")
    new Color(parseFloat($(worldDiv).children(".redInput").val()),
              parseFloat($(worldDiv).children(".greenInput").val()),
              parseFloat($(worldDiv).children(".blueInput").val()))

  parseLights = ->
    lightDivs = $("#lightsDiv").children("div")
    (parseLightDiv lightDiv for lightDiv in lightDivs when $(lightDiv).children(".lightCheck").is ":checked")

  parseLightDiv = (lightDiv) ->
    lightClass = $(lightDiv).attr "class"
    color = new Color(parseFloat($(lightDiv).children(".redInput").val()),
                      parseFloat($(lightDiv).children(".greenInput").val()),
                      parseFloat($(lightDiv).children(".blueInput").val()))
    shadows = $(lightDiv).children(".shadowCheck").is ":checked"
    position = new Point3(parseFloat($(lightDiv).children(".posX").val()),
                          parseFloat($(lightDiv).children(".posY").val()),
                          parseFloat($(lightDiv).children(".posZ").val()))
    if lightClass is "pointLight" then return new PointLight(color, shadows, position)
    direction = new Vector3(parseFloat($(lightDiv).children(".dirX").val()),
                            parseFloat($(lightDiv).children(".dirY").val()),
                            parseFloat($(lightDiv).children(".dirZ").val()))
    if lightClass is "directionalLight" then return new DirectionalLight(color, shadows, direction)
    new SpotLight(color, shadows, position, direction, Math.PI / parseFloat($(lightDiv).children(".halfAngle").val()))

  parseData = ->
    cam = parseCameraDiv()
    world = new World(parseBackgroundColor(), parseObjects(), parseLights(), parseAmbientLight(),
                      parseFloat($("#worldDiv").children(".indexOfRefraction").val()))

  startWorker = (number, numberOfWorkers)->
    startW = width / numberOfWorkers * number
    endW = startW + width / numberOfWorkers
    worker = new Worker('engine.js')
    worker.addEventListener('message', (e) ->
      extractImageData(e.data.imgData, startW, 0, endW, height)
      if numberOfWorkers is ++numberOfFinishedWorkers
        ctx.putImageData(imgData, 0, 0)
        $("#loadDiv").toggle()
        $("#timeDiv").html("Rendered with " + numberOfWorkers + " workers in " + (Date.now() - startTime) / 1000 + " Seconds")
    , false)
    worker.postMessage(JSON.stringify({startW, endW, width, height, cam, world}))

  render = (webWorkers) ->
    startTime = Date.now()
    if webWorkers
      $("#loadDiv").toggle()
      numberOfFinishedWorkers = 0
      for i in [0..3]
        startWorker(i, 4)
    else
      tracer = new Tracer(world)
      for x in [0..width] by 1
        for y in [0..height] by 1
          c = tracer.colorFor((cam.rayFor(width, height, x, y)))
          imgData.data[(x * height + height - y - 1) * 4 + 0] = c.r * 255.0
          imgData.data[(x * height + height - y - 1) * 4 + 1] = c.g * 255.0
          imgData.data[(x * height + height - y - 1) * 4 + 2] = c.b * 255.0
      ctx.putImageData(imgData, 0, 0)
      $("#timeDiv").html("Rendered in " + (Date.now() - startTime) / 1000 + " Seconds")

  extractImageData = (newImgData, sx, sy, ex, ey) ->
    for x in [sx..ex] by 1
      for y in [sy..ey] by 1
        imgData.data[(x * height + y) * 4 + 0] = newImgData[(x * height + y) * 4 + 0]
        imgData.data[(x * height + y) * 4 + 1] = newImgData[(x * height + y) * 4 + 1]
        imgData.data[(x * height + y) * 4 + 2] = newImgData[(x * height + y) * 4 + 2]

  $("#goButton").click ->
    parseData()
    render($("#webworkers")[0].checked)