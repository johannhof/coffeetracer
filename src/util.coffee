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
    @o.subPoint(p).magnitude

class @World
  constructor: (@backgroundColor, @elements, @lights, @ambient, @indexOfRefraction) ->
  hit: (ray) =>
    temp = null;
    for element in @elements
      h = element.hit(ray)
      if temp is null
        temp = h
      if temp and h and temp.t > h.t
        temp = h
    temp

class @Hit
  constructor: (@t, @ray, @geo, @normal) ->

class @Tracer
  @maxDepth: 6
  constructor: (@world) ->
    @recursionCounter = Tracer.maxDepth
  colorFor: (ray) =>
    @recursionCounter--
    if @recursionCounter > 0
      hit = @world.hit ray
      if hit
        color = hit.geo.material.colorFor(hit, @world, this)
        @recursionCounter = maxDepth
        color
    @recursionCounter = @maxDepth
    @world.backgroundColor

class @Node extends Geometry
  constructor: (@transformation, @geometries, material) ->
    super material
  hit: (ray) =>
    r = new Ray(@transformation.i.xPoint(ray.o), @transformation.i.xVector(ray.d))
    temp = null
    for element in @geometries
      h = element.hit(r)
      if temp is null
        temp = h
      if temp isnt null and h isnt null and temp.t > h.t
        temp = h
    if temp isnt null
      return new Hit(temp.t, ray, temp.geo, @transformation.i.transpond().cross(new Vector3(temp.normal.x, temp.normal.y, temp.normal.z)).asNormal())

class @Transform
  constructor: (@m, @i) ->
  @Translation: (x, y, z) ->
    new Transform(new Mat4x4(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1), new Mat4x4(1, 0, 0, -x, 0, 1, 0, -y, 0, 0, 1, -z, 0, 0, 0, 1))
  @Scaling: (sx, sy, sz) ->
    new Transform(new Mat4x4(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1), new Mat4x4(1 / sx, 0, 0, 0, 0, 1 / sy, 0, 0, 0, 0, 1 / sz, 0, 0, 0, 0, 1))
  @XRotation: (angle) ->
    new Transform(new Mat4x4(1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1), new Mat4x4(1, 0, 0, 0, 0, Math.cos(angle), Math.sin(angle), 0, 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1))
  @YRotation: (angle) ->
    new Transform(new Mat4x4(Math.cos(angle), 0, Math.sin(angle), 0, 0, 1, 0, 0, -Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 1), new Mat4x4(Math.cos(angle), 0, -Math.sin(angle), 0, 0, 1, 0, 0, Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 1))
  @ZRotation: (angle) ->
    new Transform(new Mat4x4(Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), new Mat4x4(Math.cos(angle), Math.sin(angle), 0, 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1))
  translate: (x, y, z) ->
    new Transform(@m.xMat(new Mat4x4(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1)), @i.xMat(new Mat4x4(1, 0, 0, -x, 0, 1, 0, -y, 0, 0, 1, -z, 0, 0, 0, 1)))
  scale: (sx, sy, sz) ->
    new Transform(@m.xMat(new Mat4x4(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1)), @i.xMat(new Mat4x4(1 / sx, 0, 0, 0, 0, 1 / sy, 0, 0, 0, 0, 1 / sz, 0, 0, 0, 0, 1)))
  xRotate: (angle) ->
    new Transform(@m.xMat(new Mat4x4(1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1)), @i.xMat(new Mat4x4(1, 0, 0, 0, 0, Math.cos(angle), Math.sin(angle), 0, 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1)))
  yRotate: (angle) ->
    new Transform(@m.xMat(new Mat4x4(Math.cos(angle), 0, Math.sin(angle), 0, 0, 1, 0, 0, -Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 1)), @i.xMat(new Mat4x4(Math.cos(angle), 0, -Math.sin(angle), 0, 0, 1, 0, 0, Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 1)))
  zRotate: (angle) ->
    new Transform(@m.xMat(new Mat4x4(Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)), @i.xMat(new Mat4x4(Math.cos(angle), Math.sin(angle), 0, 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)))
