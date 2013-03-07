// Generated by CoffeeScript 1.4.0
(function() {
  var $;

  $ = jQuery;

  $(function() {
    var boxHTML, cam, canvas, ctx, directionalLightHTML, getLightHTML, getObjectHTML, height, imgData, nodeHTML, parseAmbientLight, parseBackgroundColor, parseData, parseLightDiv, parseLights, planeHTML, pointLightHTML, render, sphereHTML, spotLightHTML, width, world;
    nodeHTML = $("#nodeHTMLExample").html();
    sphereHTML = $("#sphereHTMLExample").html();
    boxHTML = $("#boxHTMLExample").html();
    planeHTML = $('#planeHTMLExample').html();
    $("#objectsDiv .addButton").click(function() {
      var temp;
      return temp = $(this).parent().parent().append(getObjectHTML($(this).parent().children(".selectObject").val()));
    });
    getObjectHTML = function(className) {
      switch (className) {
        case "Node":
          return nodeHTML;
        case "Sphere":
          return sphereHTML;
        case "Box":
          return boxHTML;
        case "Plane":
          return planeHTML;
      }
    };
    pointLightHTML = $("#pointLightExample").html();
    spotLightHTML = $("#spotLightExample").html();
    directionalLightHTML = $("#directionalLightExample").html();
    $("#lightsDiv .addButton").click(function() {
      var temp;
      return temp = $(this).parent().parent().append(getLightHTML($(this).parent().children(".selectLight").val()));
    });
    getLightHTML = function(lightName) {
      switch (lightName) {
        case "PointLight":
          return pointLightHTML;
        case "SpotLight":
          return spotLightHTML;
        case "DirectionalLight":
          return directionalLightHTML;
      }
    };
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    width = canvas.width;
    height = canvas.height;
    ctx.fillRect(0, 0, width, height);
    imgData = ctx.getImageData(0, 0, width, height);
    cam = null;
    world = null;
    parseAmbientLight = function() {
      var ambientDiv;
      ambientDiv = $("#ambientLight");
      return new Color(parseFloat($(ambientDiv).children(".redInput").val()), parseFloat($(ambientDiv).children(".greenInput").val()), parseFloat($(ambientDiv).children(".blueInput").val()));
    };
    parseBackgroundColor = function() {
      var worldDiv;
      worldDiv = $("#worldDiv");
      return new Color(parseFloat($(worldDiv).children(".redInput").val()), parseFloat($(worldDiv).children(".greenInput").val()), parseFloat($(worldDiv).children(".blueInput").val()));
    };
    parseLights = function() {
      var lightDiv, lightDivs, lights;
      lightDivs = $("#lightsDiv").children("div");
      lights = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = lightDivs.length; _i < _len; _i++) {
          lightDiv = lightDivs[_i];
          if ($(lightDiv).children(".lightCheck").is(":checked")) {
            _results.push(parseLightDiv(lightDiv));
          }
        }
        return _results;
      })();
      return lights;
    };
    parseLightDiv = function(lightDiv) {
      var color, direction, lightClass, position, shadows;
      lightClass = $(lightDiv).attr("class");
      color = new Color(parseFloat($(lightDiv).children(".redInput").val()), parseFloat($(lightDiv).children(".greenInput").val()), parseFloat($(lightDiv).children(".blueInput").val()));
      shadows = $(lightDiv).children(".lightCheck").is(":checked");
      position = new Point3(parseFloat($(lightDiv).children(".posX").val()), parseFloat($(lightDiv).children(".posY").val()), parseFloat($(lightDiv).children(".posZ").val()));
      if (lightClass === "pointLight") {
        return new PointLight(color, shadows, position);
      }
      direction = new Vector3(parseFloat($(lightDiv).children(".dirX").val()), parseFloat($(lightDiv).children(".dirY").val()), parseFloat($(lightDiv).children(".dirZ").val()));
      if (lightClass === "directionalLight") {
        return new DirectionalLight(color, shadows, direction);
      }
      return new SpotLight(color, shadows, position, direction, Math.PI / parseFloat($(lightDiv).children(".halfAngle").val()));
    };
    parseData = function() {
      var objects;
      objects = [new Node(Transform.Scaling(1, 1, 1), [new Sphere(new PhongMaterial(new Color(1, 0, 0), new Color(1, 1, 1), 20))], null)];
      cam = new PerspectiveCamera(new Point3(5, 5, 5), new Vector3(-1, -1, -1), new Vector3(0, 1, 0), Math.PI / 4);
      return world = new World(parseBackgroundColor(), objects, parseLights(), parseAmbientLight(), parseFloat($("#worldDiv").children(".indexOfRefraction").val()));
    };
    render = function() {
      var c, tracer, x, y, _i, _j;
      tracer = new Tracer(world);
      for (x = _i = 0; _i <= width; x = _i += 1) {
        for (y = _j = 0; _j <= height; y = _j += 1) {
          c = tracer.colorFor(cam.rayFor(width, height, x, y));
          imgData.data[(x * height + height - y - 1) * 4 + 0] = c.r * 255.0;
          imgData.data[(x * height + height - y - 1) * 4 + 1] = c.g * 255.0;
          imgData.data[(x * height + height - y - 1) * 4 + 2] = c.b * 255.0;
        }
      }
      return ctx.putImageData(imgData, 0, 0);
    };
    return $("#goButton").click(function() {
      parseData();
      return render();
    });
  });

}).call(this);