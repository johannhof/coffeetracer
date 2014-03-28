$ = jQuery
$ ->
  $("#loadDiv").toggle()
  #######Objects#######
  #Get the templates for for all divs that can be added/removed
  nodeHTML = $("#nodeHTMLExample").html()
  sphereHTML = $("#sphereHTMLExample").html()
  boxHTML = $("#boxHTMLExample").html()
  planeHTML = $("#planeHTMLExample").html()
  triangleHTML = $("#triangleHTMLExample").html()
  singleColorMaterialHTML = $("#SingleColorMaterialHTMLExample").html()
  lambertMaterialHTML = $("#LambertMaterialHTMLExample").html()
  phongMaterialHTML = $("#PhongMaterialHTMLExample").html()
  reflectiveMaterialHTML = $("#ReflectiveMaterialHTMLExample").html()
  transparentMaterialHTML = $("#TransparentMaterialHTMLExample").html()
  scalingHTML = $("#ScalingHTMLExample").html()
  translationHTML = $("#TranslationHTMLExample").html()
  xRotationHTML = $("#X-RotationHTMLExample").html()
  yRotationHTML = $("#Y-RotationHTMLExample").html()
  zRotationHTML = $("#Z-RotationHTMLExample").html()

  $("#addObjectButton").click ->
    $("#objects").append(getObjectHTML($("#selectObject").val()))

  getObjectHTML = (className, isNodeObject = false) ->
    switch className
      when "Node" then createNodeDiv
      when "Sphere" then createObjectDiv "sphere", sphereHTML, isNodeObject
      when "Box" then createObjectDiv "box", boxHTML, isNodeObject
      when "Plane" then createObjectDiv "plane", planeHTML, isNodeObject
      when "Triangle" then createObjectDiv "triangle", triangleHTML, isNodeObject
      else
        className + "not valid"

  addRemoveButtonHandler = (div) ->
    $(div).children(".removeButton").click ->
      $(div).remove()

  createObjectDiv = (objectName, propertyHtml, isNodeObject) ->
    div = document.createElement "div"
    div.setAttribute("class", objectName)
    $(div).css("border", "1px solid lightgrey").css("margin-bottom", "5px").css("padding",
                                                                                "10px").append($("#objectHTMLExample").html())
    $(div).children("b").html(objectName + ":")
    if not isNodeObject then $(div).append(propertyHtml)
    addRemoveButtonHandler(div)
    $(div).children(".selectMaterial").change ->
      $(div).children(".materialContainer").html(getMaterialHTML(this.value))
    div

  createLightDiv = (lightName, lightHTML) ->
    div = document.createElement "div"
    div.setAttribute("class", lightName)
    $(div).css("border", "1px solid lightgrey").css("margin-bottom", "5px").css("padding", "10px").append(lightHTML)
    addRemoveButtonHandler(div)
    div

  createNodeDiv = ->
    div = document.createElement "div"
    div.setAttribute("class", "node")
    $(div).css("border", "1px solid lightgrey").css("margin-bottom", "5px").css("padding", "10px").append(nodeHTML)
    addRemoveButtonHandler(div)
    $(div).children(".input-append").children(".addNodeObject").click ->
      $(div).children(".nodeContainer").append(getObjectHTML($(div).children(".input-append").children(".nodeSelectObject").val(),
                                                             true))
    $(div).children(".input-append").children(".addTransformation").click ->
      $(div).children(".transformationContainer").append(getTransformHTML($(div).children(".input-append").children(".nodeSelectTransformation").val()))
    div

  createTransformationDiv = (name, transformationHTML) ->
    div = document.createElement "div"
    div.setAttribute("class", name)
    $(div).append(transformationHTML)
    addRemoveButtonHandler(div)
    div

  getTransformHTML = (transformationName) ->
    switch transformationName
      when "Scaling" then createTransformationDiv "scaling", scalingHTML
      when "Translation" then createTransformationDiv "translation", translationHTML
      when "X-Rotation" then createTransformationDiv "xRotation", xRotationHTML
      when "Y-Rotation" then createTransformationDiv "yRotation", yRotationHTML
      when "Z-Rotation" then createTransformationDiv "zRotation", zRotationHTML
      else
        null

  getMaterialHTML = (materialName) ->
    switch materialName
      when "SingleColorMaterial" then singleColorMaterialHTML
      when "LambertMaterial" then lambertMaterialHTML
      when "PhongMaterial" then phongMaterialHTML
      when "ReflectiveMaterial" then reflectiveMaterialHTML
      when "TransparentMaterial" then transparentMaterialHTML
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
      when "PointLight" then createLightDiv "pointLight", pointLightHTML
      when "SpotLight" then createLightDiv "spotLight", spotLightHTML
      when "DirectionalLight" then createLightDiv "directionalLight", directionalLightHTML
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
      new PerspectiveCamera(e, g, t, Math.PI / aOrS)
    else if $("#selectCamera")[0].value is "OrthographicCamera"
      new OrthographicCamera(e, g, t, aOrS)

  #######Canvas Setup########
  canvas = document.getElementById "mainCanvas"
  ctx = canvas.getContext "2d"
  ctx.fillStyle = "white"
  width = canvas.width
  height = canvas.height
  ctx.fillRect(0, 0, width, height)
  imgData = ctx.getImageData(0, 0, width, height)

  $("#resizeCanvasButton").click ->
    canvas.width = parseFloat($("#widthInput").val())
    canvas.height = parseFloat($("#heightInput").val())
    ctx = canvas.getContext "2d"
    ctx.fillStyle = "white"
    width = canvas.width
    height = canvas.height
    ctx.fillRect(0, 0, width, height)
    imgData = ctx.getImageData(0, 0, width, height)

  #######Render Setup########
  startTime = 0

  #######Parsing#######
  cam = null
  world = null
  parseAmbientLight = ->
    ambientDiv = $("#ambientLight")
    new Color(parseFloat($(ambientDiv).children(".redInput").val()),
              parseFloat($(ambientDiv).children(".greenInput").val()),
              parseFloat($(ambientDiv).children(".blueInput").val()))

  parseObjects = (objectDivs = $("#objects").children("div")) ->
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
        when "triangle" then return new Triangle(material)
        when "node" then return new Node(parseTransformations($(objectDiv).children(".transformationContainer")),
                                         parseObjects($(objectDiv).children(".nodeContainer").children("div")))
        else
          null
    else
      switch objectClass
        when "plane"
          a = new Point3(parseFloat($(objectContainer).children(".planeAX").val()),
                         parseFloat($(objectContainer).children(".planeAY").val()),
                         parseFloat($(objectContainer).children(".planeAZ").val()))
          n = new Normal3(parseFloat($(objectContainer).children(".planeNX").val()),
                          parseFloat($(objectContainer).children(".planeNY").val()),
                          parseFloat($(objectContainer).children(".planeNZ").val()))
          new Plane(material, a, n)
        when "box"
          lbf = new Point3(parseFloat($(objectContainer).children(".boxLBFX").val()),
                           parseFloat($(objectContainer).children(".boxLBFY").val()),
                           parseFloat($(objectContainer).children(".boxLBFZ").val()))
          run = new Point3(parseFloat($(objectContainer).children(".boxRUNX").val()),
                           parseFloat($(objectContainer).children(".boxRUNY").val()),
                           parseFloat($(objectContainer).children(".boxRUNZ").val()))
          new AxisAlignedBox(material, lbf, run)
        when "sphere"
          c = new Point3(parseFloat($(objectContainer).children(".sphereCenterX").val()),
                         parseFloat($(objectContainer).children(".sphereCenterY").val()),
                         parseFloat($(objectContainer).children(".sphereCenterZ").val()))
          r = parseFloat($(objectContainer).children(".sphereRadius").val())
          new Sphere(material, c, r)
        when "triangle"
          a = new Point3(parseFloat($(objectContainer).children(".triangleAX").val()),
                         parseFloat($(objectContainer).children(".triangleAY").val()),
                         parseFloat($(objectContainer).children(".triangleAZ").val()))
          b = new Point3(parseFloat($(objectContainer).children(".triangleBX").val()),
                         parseFloat($(objectContainer).children(".triangleBY").val()),
                         parseFloat($(objectContainer).children(".triangleBZ").val()))
          c = new Point3(parseFloat($(objectContainer).children(".triangleCX").val()),
                         parseFloat($(objectContainer).children(".triangleCY").val()),
                         parseFloat($(objectContainer).children(".triangleCZ").val()))
          new Triangle(material, a, b, c)
        else
          null

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
      else
        null

  parseTransformations = (transformationContainer) ->
    firstTransformation = $(transformationContainer).children("div")[0]
    transformation = (->
      switch $(firstTransformation).attr "class"
        when "scaling"
          Transform.Scaling(parseFloat($(firstTransformation).children(".scalingX").val()),
                            parseFloat($(firstTransformation).children(".scalingY").val()),
                            parseFloat($(firstTransformation).children(".scalingZ").val()))
        when "translation"
          Transform.Translation(parseFloat($(firstTransformation).children(".translationX").val()),
                                parseFloat($(firstTransformation).children(".translationY").val()),
                                parseFloat($(firstTransformation).children(".translationZ").val()))
        when "xRotation"
          Transform.XRotation(parseFloat($(firstTransformation).children(".rotationAngle").val()) / 180 * Math.PI)
        when "yRotation"
          Transform.YRotation(parseFloat($(firstTransformation).children(".rotationAngle").val()) / 180 * Math.PI)
        when "zRotation"
          Transform.ZRotation(parseFloat($(firstTransformation).children(".rotationAngle").val()) / 180 * Math.PI)
        else
          Transform.Scaling(1, 1, 1)
    )()
    transformationDivs = $(transformationContainer).children("div")[1..]
    for transformationDiv in transformationDivs
      transformation = (->
        switch $(transformationDiv).attr "class"
          when "scaling"
            transformation.scale(parseFloat($(transformationDiv).children(".scalingX").val()),
                                 parseFloat($(transformationDiv).children(".scalingY").val()),
                                 parseFloat($(transformationDiv).children(".scalingZ").val()))
          when "translation"
            transformation.translate(parseFloat($(transformationDiv).children(".translationX").val()),
                                     parseFloat($(transformationDiv).children(".translationY").val()),
                                     parseFloat($(transformationDiv).children(".translationZ").val()))
          when "xRotation"
            transformation.xRotate(parseFloat($(transformationDiv).children(".rotationAngle").val()) / 180 * Math.PI)
          when "yRotation"
            transformation.yRotate(parseFloat($(transformationDiv).children(".rotationAngle").val()) / 180 * Math.PI)
          when "zRotation"
            transformation.zRotate(parseFloat($(transformationDiv).children(".rotationAngle").val()) / 180 * Math.PI)
          else
            transformation
      )()
    transformation


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

  workerManager = {
  workers:
    []

  numberOfFinishedWorkers: 0

  startWorker: (number, numberOfWorkers) ->
    startW = width / numberOfWorkers * number
    endW = startW + width / numberOfWorkers
    this.workers[number] = new Worker('build/engine.js')
    this.workers[number].addEventListener('message', (e) ->
      extractImageData(e.data.imgData, startW, 0, endW, height)
      if numberOfWorkers is ++workerManager.numberOfFinishedWorkers
        ctx.putImageData(imgData, 0, 0)
        $("#loadDiv").toggle()
        $("#timeDiv").html("Rendered with " + workerManager.numberOfFinishedWorkers + " workers in " + (Date.now() - startTime) / 1000 + " Seconds")
    , false)
    this.workers[number].postMessage(JSON.stringify({startW, endW, width, height, cam, world}))

  startWorkers: (numberOfWorkers) ->
    workerManager.numberOfFinishedWorkers = 0
    for number in [0..numberOfWorkers - 1]
      this.startWorker(number, numberOfWorkers)
    # return true to avoid coffeescript making an array of results to return
    true

  stopWorkers: ->
    for i in [0..this.workers.length - 1]
      this.workers[i].terminate()
    $("#loadDiv").toggle()
  }

  $("#cancelButton").click ->
    workerManager.stopWorkers()

  render = (webWorkers) ->
    startTime = Date.now()
    if webWorkers
      $("#loadDiv").toggle()
      numberOfWorkers = parseInt($("#numberOfWorkers").val(), 10)
      workerManager.startWorkers(numberOfWorkers)
    else
      tracer = new Tracer(world)
      for x in [0..width] by 1
        for y in [0..height] by 1
          c = tracer.colorFor((cam.rayFor(width, height, x, y)))
          imgData.data[(x + (height - y - 1) * width) * 4 + 0] = c.r * 255.0
          imgData.data[(x + (height - y - 1) * width) * 4 + 1] = c.g * 255.0
          imgData.data[(x + (height - y - 1) * width) * 4 + 2] = c.b * 255.0
      ctx.putImageData(imgData, 0, 0)
      $("#timeDiv").html("Rendered in " + (Date.now() - startTime) / 1000 + " Seconds")

  extractImageData = (newImgData, sx, sy, ex, ey) ->
    for x in [sx..ex] by 1
      for y in [sy..ey] by 1
        imgData.data[(x + (height - y - 1) * width) * 4 + 0] = newImgData[(x + (height - y - 1) * width) * 4 + 0]
        imgData.data[(x + (height - y - 1) * width) * 4 + 1] = newImgData[(x + (height - y - 1) * width) * 4 + 1]
        imgData.data[(x + (height - y - 1) * width) * 4 + 2] = newImgData[(x + (height - y - 1) * width) * 4 + 2]

  $("#goButton").click ->
    parseData()
    render($("#webworkers")[0].checked)
