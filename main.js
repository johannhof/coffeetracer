// Generated by CoffeeScript 1.6.1
(function() {
  var $;

  $ = jQuery;

  $(function() {
    var addRemoveButtonHandler, boxHTML, cam, canvas, createLightDiv, createNodeDiv, createObjectDiv, createTransformationDiv, ctx, directionalLightHTML, extractImageData, getLightHTML, getMaterialHTML, getObjectHTML, getTransformHTML, height, imgData, lambertMaterialHTML, nodeHTML, numberOfFinishedWorkers, parseAmbientLight, parseBackgroundColor, parseCameraDiv, parseData, parseLightDiv, parseLights, parseMaterial, parseObjectDiv, parseObjects, parseTransformations, phongMaterialHTML, planeHTML, pointLightHTML, reflectiveMaterialHTML, render, scalingHTML, singleColorMaterialHTML, sphereHTML, spotLightHTML, startTime, startWorker, translationHTML, transparentMaterialHTML, width, world, xRotationHTML, yRotationHTML, zRotationHTML;
    $("#loadDiv").toggle();
    nodeHTML = $("#nodeHTMLExample").html();
    sphereHTML = $("#sphereHTMLExample").html();
    boxHTML = $("#boxHTMLExample").html();
    planeHTML = $("#planeHTMLExample").html();
    singleColorMaterialHTML = $("#SingleColorMaterialHTMLExample").html();
    lambertMaterialHTML = $("#LambertMaterialHTMLExample").html();
    phongMaterialHTML = $("#PhongMaterialHTMLExample").html();
    reflectiveMaterialHTML = $("#ReflectiveMaterialHTMLExample").html();
    transparentMaterialHTML = $("#TransparentMaterialHTMLExample").html();
    scalingHTML = $("#ScalingHTMLExample").html();
    translationHTML = $("#TranslationHTMLExample").html();
    xRotationHTML = $("#X-RotationHTMLExample").html();
    yRotationHTML = $("#Y-RotationHTMLExample").html();
    zRotationHTML = $("#Z-RotationHTMLExample").html();
    $("#addObjectButton").click(function() {
      return $("#objects").append(getObjectHTML($("#selectObject").val()));
    });
    getObjectHTML = function(className, isNodeObject) {
      if (isNodeObject == null) {
        isNodeObject = false;
      }
      switch (className) {
        case "Node":
          return createNodeDiv;
        case "Sphere":
          return createObjectDiv("sphere", sphereHTML, isNodeObject);
        case "Box":
          return createObjectDiv("box", boxHTML, isNodeObject);
        case "Plane":
          return createObjectDiv("plane", planeHTML, isNodeObject);
        default:
          return className + "not valid";
      }
    };
    addRemoveButtonHandler = function(div) {
      return $(div).children(".removeButton").click(function() {
        return $(div).remove();
      });
    };
    createObjectDiv = function(objectName, propertyHtml, isNodeObject) {
      var div;
      div = document.createElement("div");
      div.setAttribute("class", objectName);
      $(div).css("background-color", "lightgrey").append($("#objectHTMLExample").html());
      if (!isNodeObject) {
        $(div).append(propertyHtml);
      }
      addRemoveButtonHandler(div);
      $(div).children(".selectMaterial").change(function() {
        return $(div).children(".materialContainer").html(getMaterialHTML(this.value));
      });
      return div;
    };
    createLightDiv = function(lightName, lightHTML) {
      var div;
      div = document.createElement("div");
      div.setAttribute("class", lightName);
      $(div).css("background-color", "lightgrey").append(lightHTML);
      addRemoveButtonHandler(div);
      return div;
    };
    createNodeDiv = function() {
      var div;
      div = document.createElement("div");
      div.setAttribute("class", "node");
      $(div).css("background-color", "lightgrey").append(nodeHTML);
      addRemoveButtonHandler(div);
      $(div).children(".input-append").children(".addNodeObject").click(function() {
        return $(div).children(".nodeContainer").append(getObjectHTML($(div).children(".input-append").children(".nodeSelectObject").val(), true));
      });
      $(div).children(".input-append").children(".addTransformation").click(function() {
        return $(div).children(".transformationContainer").append(getTransformHTML($(div).children(".input-append").children(".nodeSelectTransformation").val()));
      });
      return div;
    };
    createTransformationDiv = function(name, transformationHTML) {
      var div;
      div = document.createElement("div");
      div.setAttribute("class", name);
      $(div).css("background-color", "lightgrey").append(transformationHTML);
      addRemoveButtonHandler(div);
      return div;
    };
    getTransformHTML = function(transformationName) {
      switch (transformationName) {
        case "Scaling":
          return createTransformationDiv("scaling", scalingHTML);
        case "Translation":
          return createTransformationDiv("translation", translationHTML);
        case "X-Rotation":
          return createTransformationDiv("xRotation", xRotationHTML);
        case "Y-Rotation":
          return createTransformationDiv("yRotation", yRotationHTML);
        case "Z-Rotation":
          return createTransformationDiv("zRotation", zRotationHTML);
        default:
          return null;
      }
    };
    getMaterialHTML = function(materialName) {
      switch (materialName) {
        case "SingleColorMaterial":
          return singleColorMaterialHTML;
        case "LambertMaterial":
          return lambertMaterialHTML;
        case "PhongMaterial":
          return phongMaterialHTML;
        case "ReflectiveMaterial":
          return reflectiveMaterialHTML;
        case "TransparentMaterial":
          return transparentMaterialHTML;
        default:
          return null;
      }
    };
    pointLightHTML = $("#pointLightExample").html();
    spotLightHTML = $("#spotLightExample").html();
    directionalLightHTML = $("#directionalLightExample").html();
    $("#addLightButton").click(function() {
      return $("#lightsDiv").append(getLightHTML($("#selectLight").val()));
    });
    getLightHTML = function(lightName) {
      switch (lightName) {
        case "PointLight":
          return createLightDiv("pointLight", pointLightHTML);
        case "SpotLight":
          return createLightDiv("spotLight", spotLightHTML);
        case "DirectionalLight":
          return createLightDiv("directionalLight", directionalLightHTML);
        default:
          return lightName + "not valid";
      }
    };
    $("#selectCamera").change(function() {
      if (this.value === "PerspectiveCamera") {
        return $("#cameraSpec").html('<label for="camera_alpha">alpha = PI / </label><input type="text" id="camera_alpha" value="4" size="2">');
      } else if (this.value === "OrthographicCamera") {
        return $("#cameraSpec").html('<label for="camera_s">s = </label><input type="text" id="camera_s" value="5" size="2">');
      } else {
        return alert("Fail");
      }
    });
    parseCameraDiv = function() {
      var aOrS, e, g, t;
      e = new Point3(parseFloat($("#camera_e_x").val()), parseFloat($("#camera_e_y").val()), parseFloat($("#camera_e_z").val()));
      g = new Vector3(parseFloat($("#camera_g_x").val()), parseFloat($("#camera_g_y").val()), parseFloat($("#camera_g_z").val()));
      t = new Vector3(parseFloat($("#camera_t_x").val()), parseFloat($("#camera_t_y").val()), parseFloat($("#camera_t_z").val()));
      aOrS = $("#cameraSpec input")[0].value;
      if ($("#selectCamera")[0].value === "PerspectiveCamera") {
        return new PerspectiveCamera(e, g, t, Math.PI / aOrS);
      } else if ($("#selectCamera")[0].value === "OrthographicCamera") {
        return new OrthographicCamera(e, g, t, aOrS);
      }
    };
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    width = canvas.width;
    height = canvas.height;
    ctx.fillRect(0, 0, width, height);
    imgData = ctx.getImageData(0, 0, width, height);
    numberOfFinishedWorkers = 0;
    startTime = 0;
    cam = null;
    world = null;
    parseAmbientLight = function() {
      var ambientDiv;
      ambientDiv = $("#ambientLight");
      return new Color(parseFloat($(ambientDiv).children(".redInput").val()), parseFloat($(ambientDiv).children(".greenInput").val()), parseFloat($(ambientDiv).children(".blueInput").val()));
    };
    parseObjects = function(objectDivs) {
      var objectDiv, _i, _len, _results;
      if (objectDivs == null) {
        objectDivs = $("#objects").children("div");
      }
      _results = [];
      for (_i = 0, _len = objectDivs.length; _i < _len; _i++) {
        objectDiv = objectDivs[_i];
        _results.push(parseObjectDiv(objectDiv));
      }
      return _results;
    };
    parseObjectDiv = function(objectDiv) {
      var a, c, lbf, material, n, objectClass, objectContainer, r, run;
      objectClass = $(objectDiv).attr("class");
      material = parseMaterial(objectDiv);
      objectContainer = $(objectDiv).children(".objectContainer")[0];
      if (!objectContainer) {
        switch (objectClass) {
          case "plane":
            return new Plane(material);
          case "box":
            return new AxisAlignedBox(material);
          case "sphere":
            return new Sphere(material);
          case "node":
            return new Node(parseTransformations($(objectDiv).children(".transformationContainer")), parseObjects($(objectDiv).children(".nodeContainer").children("div")));
          default:
            return null;
        }
      } else {
        switch (objectClass) {
          case "plane":
            a = new Point3(parseFloat($(objectContainer).children(".planeAX").val()), parseFloat($(objectContainer).children(".planeAY").val()), parseFloat($(objectContainer).children(".planeAZ").val()));
            n = new Normal3(parseFloat($(objectContainer).children(".planeNX").val()), parseFloat($(objectContainer).children(".planeNY").val()), parseFloat($(objectContainer).children(".planeNZ").val()));
            return new Plane(material, a, n);
          case "box":
            lbf = new Point3(parseFloat($(objectContainer).children(".boxLBFX").val()), parseFloat($(objectContainer).children(".boxLBFY").val()), parseFloat($(objectContainer).children(".boxLBFZ").val()));
            run = new Point3(parseFloat($(objectContainer).children(".boxRUNX").val()), parseFloat($(objectContainer).children(".boxRUNY").val()), parseFloat($(objectContainer).children(".boxRUNZ").val()));
            return new AxisAlignedBox(material, lbf, run);
          case "sphere":
            c = new Point3(parseFloat($(objectContainer).children(".sphereCenterX").val()), parseFloat($(objectContainer).children(".sphereCenterY").val()), parseFloat($(objectContainer).children(".sphereCenterZ").val()));
            r = parseFloat($(objectContainer).children(".sphereRadius").val());
            return new Sphere(material, c, r);
          default:
            return null;
        }
      }
    };
    parseMaterial = function(objectDiv) {
      var materialClass, materialContainer;
      materialClass = $(objectDiv).children(".selectMaterial").val();
      materialContainer = $(objectDiv).children(".materialContainer");
      switch (materialClass) {
        case "SingleColorMaterial":
          return new SingleColorMaterial(new Color(parseFloat($(materialContainer).children(".redInput").val()), parseFloat($(materialContainer).children(".greenInput").val()), parseFloat($(materialContainer).children(".blueInput").val())));
        case "LambertMaterial":
          return new LambertMaterial(new Color(parseFloat($(materialContainer).children(".redInput").val()), parseFloat($(materialContainer).children(".greenInput").val()), parseFloat($(materialContainer).children(".blueInput").val())));
        case "PhongMaterial":
          return new PhongMaterial(new Color(parseFloat($(materialContainer).children(".diffuse.redInput").val()), parseFloat($(materialContainer).children(".diffuse.greenInput").val()), parseFloat($(materialContainer).children(".diffuse.blueInput").val())), new Color(parseFloat($(materialContainer).children(".specular.redInput").val()), parseFloat($(materialContainer).children(".specular.greenInput").val()), parseFloat($(materialContainer).children(".specular.blueInput").val())), parseFloat($(materialContainer).children(".exponent").val()));
        case "ReflectiveMaterial":
          return new ReflectiveMaterial(new Color(parseFloat($(materialContainer).children(".diffuse.redInput").val()), parseFloat($(materialContainer).children(".diffuse.greenInput").val()), parseFloat($(materialContainer).children(".diffuse.blueInput").val())), new Color(parseFloat($(materialContainer).children(".specular.redInput").val()), parseFloat($(materialContainer).children(".specular.greenInput").val()), parseFloat($(materialContainer).children(".specular.blueInput").val())), parseFloat($(materialContainer).children(".exponent").val()), new Color(parseFloat($(materialContainer).children(".reflection.redInput").val()), parseFloat($(materialContainer).children(".reflection.greenInput").val()), parseFloat($(materialContainer).children(".reflection.blueInput").val())));
        case "TransparentMaterial":
          return new TransparentMaterial(parseFloat($(materialContainer).children(".indexOfRefraction").val()));
        default:
          return null;
      }
    };
    parseTransformations = function(transformationContainer) {
      var firstTransformation, transformation, transformationDiv, transformationDivs, _i, _len;
      firstTransformation = $(transformationContainer).children("div")[0];
      transformation = (function() {
        switch ($(firstTransformation).attr("class")) {
          case "scaling":
            return Transform.Scaling(parseFloat($(firstTransformation).children(".scalingX").val()), parseFloat($(firstTransformation).children(".scalingY").val()), parseFloat($(firstTransformation).children(".scalingZ").val()));
          case "translation":
            return Transform.Translation(parseFloat($(firstTransformation).children(".translationX").val()), parseFloat($(firstTransformation).children(".translationY").val()), parseFloat($(firstTransformation).children(".translationZ").val()));
          case "xRotation":
            return Transform.XRotation(parseFloat($(firstTransformation).children(".rotationAngle").val()) / 180 * Math.PI);
          case "yRotation":
            return Transform.YRotation(parseFloat($(firstTransformation).children(".rotationAngle").val()) / 180 * Math.PI);
          case "zRotation":
            return Transform.ZRotation(parseFloat($(firstTransformation).children(".rotationAngle").val()) / 180 * Math.PI);
          default:
            return Transform.Scaling(1, 1, 1);
        }
      })();
      transformationDivs = $(transformationContainer).children("div").slice(1);
      for (_i = 0, _len = transformationDivs.length; _i < _len; _i++) {
        transformationDiv = transformationDivs[_i];
        transformation = (function() {
          switch ($(transformationDiv).attr("class")) {
            case "scaling":
              return transformation.scale(parseFloat($(transformationDiv).children(".scalingX").val()), parseFloat($(transformationDiv).children(".scalingY").val()), parseFloat($(transformationDiv).children(".scalingZ").val()));
            case "translation":
              return transformation.translate(parseFloat($(transformationDiv).children(".translationX").val()), parseFloat($(transformationDiv).children(".translationY").val()), parseFloat($(transformationDiv).children(".translationZ").val()));
            case "xRotation":
              return transformation.xRotate(parseFloat($(transformationDiv).children(".rotationAngle").val()) / 180 * Math.PI);
            case "yRotation":
              return transformation.yRotate(parseFloat($(transformationDiv).children(".rotationAngle").val()) / 180 * Math.PI);
            case "zRotation":
              return transformation.zRotate(parseFloat($(transformationDiv).children(".rotationAngle").val()) / 180 * Math.PI);
            default:
              return transformation;
          }
        })();
      }
      return transformation;
    };
    parseBackgroundColor = function() {
      var worldDiv;
      worldDiv = $("#worldDiv");
      return new Color(parseFloat($(worldDiv).children(".redInput").val()), parseFloat($(worldDiv).children(".greenInput").val()), parseFloat($(worldDiv).children(".blueInput").val()));
    };
    parseLights = function() {
      var lightDiv, lightDivs, _i, _len, _results;
      lightDivs = $("#lightsDiv").children("div");
      _results = [];
      for (_i = 0, _len = lightDivs.length; _i < _len; _i++) {
        lightDiv = lightDivs[_i];
        if ($(lightDiv).children(".lightCheck").is(":checked")) {
          _results.push(parseLightDiv(lightDiv));
        }
      }
      return _results;
    };
    parseLightDiv = function(lightDiv) {
      var color, direction, lightClass, position, shadows;
      lightClass = $(lightDiv).attr("class");
      color = new Color(parseFloat($(lightDiv).children(".redInput").val()), parseFloat($(lightDiv).children(".greenInput").val()), parseFloat($(lightDiv).children(".blueInput").val()));
      shadows = $(lightDiv).children(".shadowCheck").is(":checked");
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
      cam = parseCameraDiv();
      return world = new World(parseBackgroundColor(), parseObjects(), parseLights(), parseAmbientLight(), parseFloat($("#worldDiv").children(".indexOfRefraction").val()));
    };
    startWorker = function(number, numberOfWorkers) {
      var endW, startW, worker;
      startW = width / numberOfWorkers * number;
      endW = startW + width / numberOfWorkers;
      worker = new Worker('engine.js');
      worker.addEventListener('message', function(e) {
        extractImageData(e.data.imgData, startW, 0, endW, height);
        if (numberOfWorkers === ++numberOfFinishedWorkers) {
          ctx.putImageData(imgData, 0, 0);
          $("#loadDiv").toggle();
          return $("#timeDiv").html("Rendered with " + numberOfWorkers + " workers in " + (Date.now() - startTime) / 1000 + " Seconds");
        }
      }, false);
      return worker.postMessage(JSON.stringify({
        startW: startW,
        endW: endW,
        width: width,
        height: height,
        cam: cam,
        world: world
      }));
    };
    render = function(webWorkers) {
      var c, i, tracer, x, y, _i, _j, _k, _results;
      startTime = Date.now();
      if (webWorkers) {
        $("#loadDiv").toggle();
        numberOfFinishedWorkers = 0;
        _results = [];
        for (i = _i = 0; _i <= 1; i = ++_i) {
          _results.push(startWorker(i, 2));
        }
        return _results;
      } else {
        tracer = new Tracer(world);
        for (x = _j = 0; _j <= width; x = _j += 1) {
          for (y = _k = 0; _k <= height; y = _k += 1) {
            c = tracer.colorFor(cam.rayFor(width, height, y, width - x - 1));
            imgData.data[(x * height + y) * 4 + 0] = c.r * 255.0;
            imgData.data[(x * height + y) * 4 + 1] = c.g * 255.0;
            imgData.data[(x * height + y) * 4 + 2] = c.b * 255.0;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        return $("#timeDiv").html("Rendered in " + (Date.now() - startTime) / 1000 + " Seconds");
      }
    };
    extractImageData = function(newImgData, sx, sy, ex, ey) {
      var x, y, _i, _results;
      _results = [];
      for (x = _i = sx; _i <= ex; x = _i += 1) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (y = _j = sy; _j <= ey; y = _j += 1) {
            imgData.data[(x * height + y) * 4 + 0] = newImgData[(x * height + y) * 4 + 0];
            imgData.data[(x * height + y) * 4 + 1] = newImgData[(x * height + y) * 4 + 1];
            _results1.push(imgData.data[(x * height + y) * 4 + 2] = newImgData[(x * height + y) * 4 + 2]);
          }
          return _results1;
        })());
      }
      return _results;
    };
    return $("#goButton").click(function() {
      parseData();
      return render($("#webworkers")[0].checked);
    });
  });

}).call(this);
