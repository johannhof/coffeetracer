class @Camera
  constructor: (@e, @g, @t) ->
    @w = @g.mul(1.0 / @g.magnitude).mul(-1)
    @u = @t.cross(@w).mul(1.0 / @t.cross(@w).magnitude)
    @v = @w.cross(@u)

#TODO: Orthographic Camera

class @PerspectiveCamera extends @Camera
  constructor: (@e, @g, @t, @angle) ->
    super(@e, @g, @t)
  rayFor: (w, h, x, y) =>
    r = @w.mul(-1).mul((h / 2.0) / Math.tan(@angle / 2.0)).add(@u.mul(x - ((w - 1) / 2.0))).add(@v.mul(y - ((h - 1) / 2.0)));
    d = r.mul(1.0 / r.magnitude)
    new Ray(@e, d)