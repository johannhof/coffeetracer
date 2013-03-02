$ = jQuery
$ ->
  worker = new Worker('engine.js');

  worker.addEventListener('message',
  ((e) ->
    console.log(e.data)
    data = JSON.parse(e.data)
    for x in data
      imgData.data[data.indexOf(x)] = x
    ctx.putImageData(imgData,0,0)
  ), false)

  #######Objects#######
  nodeHTML = $("#nodeHTMLExample").html()
  sphereHTML = $("#sphereHTMLExample").html()
  boxHTML = $("#boxHTMLExample").html()
  planeHTML = $('#planeHTMLExample').html()
  $("#objectsDiv .addButton").click ->
    temp = $(this).parent().parent().append(getObjectHTML($(this).parent().children(".selectObject").val()))
  getObjectHTML = (className) ->
    switch className
      when "Node" then return nodeHTML
      when "Sphere" then return sphereHTML
      when "Box" then return boxHTML
      when "Plane" then return planeHTML

  #######Lights#######
  pointLightHTML = $("#pointLightExample").html()
  spotLightHTML = $("#spotLightExample").html()
  directionalLightHTML = $("#directionalLightExample").html()
  $("#lightsDiv .addButton").click ->
    temp = $(this).parent().parent().append(getLightHTML($(this).parent().children(".selectLight").val()))
  getLightHTML = (lightName) ->
    switch lightName
      when "PointLight" then pointLightHTML
      when "SpotLight" then spotLightHTML
      when "DirectionalLight" then directionalLightHTML

  #######Canvas Setup########
  canvas = document.getElementById "mainCanvas"
  ctx = canvas.getContext "2d"
  ctx.fillStyle = "white"
  width = canvas.width
  height = canvas.height
  ctx.fillRect(0, 0, width, height)
  imgData = ctx.getImageData(0, 0, width, height)

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
    lights = (parseLightDiv lightDiv for lightDiv in lightDivs when $(lightDiv).children(".lightCheck").is ":checked")
    lights

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
    cam = new PerspectiveCamera(new Point3(5, 5, 5), new Vector3(-1, -1, -1), new Vector3(0, 1, 0), Math.PI / 4)
    world = new World(parseBackgroundColor(), objects, parseLights(), parseAmbientLight(), parseFloat($("#worldDiv").children(".indexOfRefraction").val()))

  $("#goButton").click ->
    parseData()
    setup = {
    cam: cam
    world: world
    width: width
    height: height
    }
    worker.postMessage(JSON.stringify(setup))