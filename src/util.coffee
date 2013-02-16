@epsilon = 0.0001

class @Color
  constructor: (@r, @g, @b) ->
  add: (c) =>
    new Color(@r + c.r, @g + c.g, @b + c.b)
  sub: (c) =>
    new Color(@r - c.r, @g - c.g, @b - c.b)
  mulColor: (c) =>
    new Color(@r * c.r, @g * c.g, @b * c.b)
  mulNumber: (d) =>
    new Color(@r * d, @g * d, @b * d)

class @Ray
  constructor: (@o, @d) ->
  at: (t) =>
    @o.add(@d.mul(t))
  tOf: (p) =>
    @o.sub(p).magnitude

class @World
  constructor: (@backgroundColor, @elements, @lights, @ambient, @indexOfRefraction) ->
  hit: (ray) =>
    temp = null;
    for element in @elements
      h = element.hit(ray)
      if temp is null
        temp = h
      if temp isnt null and h isnt null and temp.t > h.t
        temp = h
    temp

class @Hit
  constructor: (@t, @ray, @geo, @normal) ->

class @Tracer
  @maxDepth: 6
  constructor: (@world) ->
    @recursionCounter = @maxDepth
  colorFor: (ray) =>
    @recursionCounter--
    if @recursionCounter > 0
      hit = @world.hit ray
      if hit isnt null
        color = hit.geo.material.colorFor(hit, @world, this)
        @recursionCounter = maxDepth
        color
    @recursionCounter = @maxDepth
    @world.backgroundColor

class @Node extends Geometry
  constructor: (@transformation, @geometries, material) ->
    super material
  hit: (ray) =>
    r = new Ray(@transformation.i.x(ray.o), @transformation.i.x(ray.d))
    temp = null
    for element in @geometries
      h = element.hit(ray)
      if temp is null
        temp = h
      if temp isnt null and h isnt null and temp.t > h.t
        temp = h
    if temp isnt null
      return new Hit(temp.t, ray, temp.geo, @transformation.i.transpond().cross(new Vector3(temp.normal.x, temp.normal.y, temp.normal.z)).asNormal())