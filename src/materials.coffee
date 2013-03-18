class @SingleColorMaterial
  constructor: (@color) ->
    @singleColorIndicator = true
  colorFor: (hit, world, tracer) =>
    for l in world.lights
      if l.illuminates(hit.ray.at(hit.t), world) then return @color
    world.backgroundColor

class @LambertMaterial
  constructor: (@color) ->
  colorFor: (hit, world, tracer) =>
    returnColor = @color.mulColor(world.ambient)
    for l in world.lights
      if l.illuminates(hit.ray.at(hit.t), world)
        returnColor = returnColor.add(@color.mulColor(l.color.mulNumber(Math.max(l.directionFrom(hit.ray.at(hit.t)).dot(hit.normal),
                                                                                 0))))
    returnColor

class @PhongMaterial
  constructor: (@diffuse, @specular, @exponent) ->
  colorFor: (hit, world, tracer) =>
    returnColor = @diffuse.mulColor(world.ambient)
    pointOnRay = hit.ray.at hit.t
    for l in world.lights
      if l.illuminates(pointOnRay, world)
        spec = @specular.mulColor(l.color.mulNumber(Math.pow(Math.max(hit.ray.d.dot(l.directionFrom(pointOnRay).reflectedOn(hit.normal).mul(-1.0)),
                                                                      0), @exponent)))
        returnColor = returnColor.add(@diffuse.mulColor(l.color.mulNumber(Math.max(l.directionFrom(pointOnRay).dot(hit.normal),
                                                                                   0))).add(spec))
    returnColor

class @ReflectiveMaterial
  constructor: (@diffuse, @specular, @exponent, @reflection) ->
  colorFor: (hit, world, tracer) =>
    returnColor = @diffuse.mulColor(world.ambient)
    pointOnRay = hit.ray.at(hit.t)
    for l in world.lights
      if l.illuminates(pointOnRay, world)
        spec = @specular.mulColor(l.color.mulNumber(Math.pow(Math.max(hit.ray.d.dot(l.directionFrom(pointOnRay).reflectedOn(hit.normal).mul(-1.0)),
                                                           0), @exponent)))
        returnColor = returnColor.add(@diffuse.mulColor(l.color.mulNumber(Math.max(l.directionFrom(pointOnRay).dot(hit.normal),
                                                                        0))).add(spec))
    reflec = @reflection.mulColor(tracer.colorFor(new Ray(pointOnRay,
                                                     hit.ray.d.add(hit.normal.mul(hit.ray.d.mul(-1).dot(hit.normal) * 2)))))
    returnColor.add(reflec)

class @TransparentMaterial
  @maxDepth = 4
  constructor: (@indexOfRefraction) ->
    @recursionCounter = @maxDepth
  colorFor: (hit, world, tracer) =>
    if @recursionCounter-- <= 0 then return world.backgroundColor
    normal = hit.normal
    cosI = hit.ray.d.mul(-1).dot(normal)
    n1 = world.indexOfRefraction
    n2 = @indexOfRefraction
    if Math.acos(cosI) > 1.57079633
      normal = hit.normal.mul(-1)
      cosI = hit.ray.d.mul(-1).dot(normal)
      n1 = @indexOfRefraction
      n2 = world.indexOfRefraction
    cosT = Math.sqrt(1 - ((n1 / n2) * (n1 / n2)) * (1 - cosI * cosI))
    tir = n1 > n2 and (n1 / n2) * (n1 / n2) * (1 - cosI * cosI) > 1
    R0 = Math.pow(((n1 - n2) / (n1 + n2)), 2)
    R = 1
    if n1 <= n2
      R = R0 + (1 - R0) * Math.pow(1 - cosI, 5)
    else if n1 > n2 && tir == false
      R = R0 + (1 - R0) * Math.pow(1 - cosT, 5)
    if R != 1
      t = hit.ray.d.mul(n1 / n2).add(normal.mul(cosI * (n1 / n2) - cosT))
      color = (tracer.colorFor(new Ray(hit.ray.at(hit.t),
                                       hit.ray.d.add(normal.mul(cosI * 2)))).mulNumber(R)).add(tracer.colorFor(new Ray(hit.ray.at(hit.t),
                                                                                                                 t)).mulNumber(1 - R))
      @recursionCounter = @maxDepth
      return color
    else
      color = tracer.colorFor(new Ray(hit.ray.at(hit.t), hit.ray.d.add(normal.mul(cosI * 2))))
      @recursionCounter = @maxDepth
      return color