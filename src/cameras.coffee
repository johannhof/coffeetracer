class @Camera
  constructor: (@e, @g, @t) ->
    @w = @g.mul(1.0 / @g.magnitude).mul(-1)
    @u = @t.cross(@w).mul(1.0 / @t.cross(@w).magnitude)
    @v = @w.cross(@u)

class @OrthographicCamera extends Camera
  constructor: (@e, @g, @t, @s) ->
    super(@e, @g, @t)
  rayFor: (w, h, x, y) =>
    a = w / h
    o = @e.add(@u.mul(a * @s * ((x - ((w - 1) / 2.0)) / (w - 1)))).add(@v.mul(@s * ((y - ((h - 1) / 2.0)) / (h - 1))))
    new Ray(o, @w.mul(-1))

class @PerspectiveCamera extends Camera
  constructor: (@e, @g, @t, @angle) ->
    super(@e, @g, @t)
  rayFor: (w, h, x, y) =>
    r = @w.mul(-1).mul((h / 2.0) / Math.tan(@angle / 2.0)).add(@u.mul(x - ((w - 1) / 2.0))).add(@v.mul(y - ((h - 1) / 2.0)))
    d = r.mul(1.0 / r.magnitude)
    new Ray(@e, d)