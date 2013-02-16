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