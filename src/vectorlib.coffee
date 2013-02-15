class @Vector3
  constructor: (@x, @y, @z) ->
    @magnitude = Math.sqrt((Math.pow(@x, 2)) + (Math.pow(@y, 2)) + (Math.pow(@z, 2)))
  add: (v) =>
    new Vector3(@x + v.x, @y + v.y, @z + v.z)
  sub: (n) =>
    new Vector3(@x - n.x, @y - n.y, @z - n.z)
  mul: (c) =>
    new Vector3(@x * c, @y * c, @z * c)
  dot: (v) =>
    @x * v.x + @y * v.y + @z * v.z
  cross: (v) =>
    new Vector3((@y * v.z) - (@z * v.y), (@z * v.x) - (@x * v.z), (@x * v.y) - (@y * v.x))
  normalized: =>
    @mul(1 / Math.sqrt(@x * @x + @y * @y + @z * @z))
  asNormal: =>
    v = @normalized()
    new Normal3(v.x, v.y, v.z)

class @Normal3
  constructor: (@x, @y, @z) ->
  mul: (c) =>
    new Normal3(@x * c, @y * c, @z * c)
  add: (n) =>
    new Normal3(@x + n.x, @y + n.y, @z + n.z)
  dot: (v) =>
    @x * v.x + @y * v.y + @z * v.z

class @Point3
  constructor: (@x, @y, @z) ->
  add: (v) =>
    new Point3(@x + v.x, @y + v.y, @z + v.z)
  subPoint: (p) =>
    new Vector3(@x - p.x, @y - p.y, @z - p.z)
  subVector: (v) =>
    new Point3(@x - v.x, @y - v.y, @z - v.z)

class @Mat3x3
  constructor: (@m11, @m12, @m13, @m21, @m22, @m23, @m31, @m32, @m33) ->
    @determinant = (@m11 * @m22 * @m33) + (@m12 * @m23 * @m31) + (@m13 * @m21 * @m32) - (@m13 * @m22 * @m31) - (@m12 * @m21 * @m33) - (@m11 * @m23 * @m32)
  mulMat: (m) ->
    new Mat3x3(@m11 * m.m11 + @m12 * m.m21 + @m13 * m.m31, @m11 * m.m12 + @m12 * m.m22 + @m13 * m.m32, @m11 * m.m13 + @m12 * m.m23 + @m13 * m.m33, @m21 * m.m11 + @m22 * m.m21 + @m23 * m.m31, @m21 * m.m12 + @m22 * m.m22 + @m23 * m.m32, @m21 * m.m13 + @m22 * m.m23 + @m23 * m.m33, @m31 * m.m11 + @m32 * m.m21 + @m33 * m.m31, @m31 * m.m12 + @m32 * m.m22 + @m33 * m.m32, @m31 * m.m13 + @m32 * m.m23 + @m33 * m.m33)
  mulVec: (v) ->
    new Vector3(@m11 * v.x + @m12 * v.y + @m13 * v.z, @m21 * v.x + @m22 * v.y + @m23 * v.z, @m31 * v.x + @m32 * v.y + @m33 * v.z)
  changeCol1: (v) ->
    new Mat3x3(v.x, @m12, @m13, v.y, @m22, @m23, v.z, @m32, @m33)
  changeCol2: (v) ->
    new Mat3x3(@m11, v.x, @m13, @m21, v.y, @m23, @m31, v.z, @m33)
  changeCol3: (v) ->
    new Mat3x3(@m11, @m12, v.x, @m21, @m22, v.y, @m31, @m32, v.z)
