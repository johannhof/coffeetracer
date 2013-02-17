class @SingleColorMaterial
  constructor: (@color) ->
  colorFor: (hit, world, tracer) ->
    for l in world.lights
      if l.illuminates(hit.ray.at(hit.t), world) then return @color
    world.backgroundColor

class @LambertMaterial
  constructor: (@color) ->
  colorFor: (hit, world, tracer) ->
    returnColor = @color.mulColor(world.ambient)
    for l in world.lights
      if l.illuminates(hit.ray.at(hit.t), world)
        returnColor = returnColor.add(@color.mulColor(l.color.mulNumber(Math.max(l.directionFrom(hit.ray.at(hit.t)).dot(hit.normal), 0))))
    returnColor

class @PhongMaterial
  constructor: (@diffuse, @specular, @exponent) ->
  colorFor: (hit, world, tracer) ->
    returnColor = @diffuse.mulColor(world.ambient)
    pointOnRay = hit.ray.at hit.t
    for l in world.lights
      if l.illuminates(pointOnRay, world)
        spec = @specular.mulColor(l.color.mulNumber(Math.pow(Math.max(hit.ray.d.dot(l.directionFrom(pointOnRay).reflectedOn(hit.normal).mul(-1.0)), 0), @exponent)))
        returnColor = returnColor.add(@diffuse.mulColor(l.color.mulNumber(Math.max(l.directionFrom(pointOnRay).dot(hit.normal), 0))).add(spec))
    returnColor