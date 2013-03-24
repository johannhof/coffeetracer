class @Geometry
  constructor: (@material) ->

class @Plane extends Geometry
  constructor: (material, @a = new Point3(0, 0, 0), @n = new Normal3(0, 1, 0)) ->
    super material
  hit: (ray) =>
    t = @a.subPoint(ray.o).dot(@n) / ray.d.dot(@n)
    if t > epsilon then new Hit(t, ray, this, @n) else null

class @AxisAlignedBox extends Geometry
  constructor: (material, @lbf = new Point3(-0.5, -0.5, -0.5), @run = new Point3(0.5, 0.5, 0.5)) ->
    super material
  hit: (ray) =>
    a = 1.0 / ray.d.x
    if a >= epsilon
      tx_min = (@lbf.x - ray.o.x) * a
      tx_max = (@run.x - ray.o.x) * a
    else
      tx_max = (@lbf.x - ray.o.x) * a
      tx_min = (@run.x - ray.o.x) * a
    b = 1.0 / ray.d.y;
    if b >= epsilon
      ty_min = (@lbf.y - ray.o.y) * b
      ty_max = (@run.y - ray.o.y) * b
    else
      ty_max = (@lbf.y - ray.o.y) * b
      ty_min = (@run.y - ray.o.y) * b
    c = 1.0 / ray.d.z;
    if c >= epsilon
      tz_min = (@lbf.z - ray.o.z) * c
      tz_max = (@run.z - ray.o.z) * c
    else
      tz_max = (@lbf.z - ray.o.z) * c
      tz_min = (@run.z - ray.o.z) * c

    if tx_min > ty_min
      t0 = tx_min
      face_in = if a >= 0.0 then 3 else 0
    else
      t0 = ty_min
      face_in = if b >= 0.0 then 1 else 4
    if tz_min > t0
      t0 = tz_min
      face_in = if c >= 0.0 then 2 else 5
    if tx_max < ty_max
      t1 = tx_max
      face_out = if a >= 0.0 then 3 else 0
    else
      t1 = ty_max
      face_out = if b >= 0.0 then 4 else 1
    if tz_max < t1
      t1 = tz_max
      face_out = if c >= 0.0 then 5 else 2
    if t0 < t1 and t1 > epsilon
      if t0 > epsilon
        return new Hit(t0, ray, this, AxisAlignedBox.getNormal(face_in))
      else
        return new Hit(t1, ray, this, AxisAlignedBox.getNormal(face_out))
    null

  @getNormal = (face) ->
    switch face
      when 0 then new Normal3(-1, 0, 0)
      when 1 then new Normal3(0, -1, 0)
      when 2 then new Normal3(0, 0, -1)
      when 3 then new Normal3(1, 0, 0)
      when 4 then new Normal3(0, 1, 0)
      when 5 then new Normal3(0, 0, 1)
      else null

class @Sphere extends Geometry
  constructor: (material, @c = new Point3(0, 0, 0), @r = 1) ->
    super material
  hit: (ray) =>
    a = ray.d.dot(ray.d)
    b = ray.d.dot((ray.o.subPoint(@c)).mul(2));
    cn = (ray.o.subPoint(@c).dot(ray.o.subPoint(@c)) - (@r * @r));
    d = (b * b) - 4.0 * a * cn;
    t = (-b - Math.sqrt(d)) / (2.0 * a);
    if d > epsilon
      if t > epsilon
        return new Hit(t, ray, this, (ray.o.subPoint(@c).add(ray.d.mul(t)).mul(1.0 / @r).asNormal()))
      t = (-b + Math.sqrt(d)) / (2.0 * a)
      if t > epsilon
        return new Hit(t, ray, this, (ray.o.subPoint(@c).add(ray.d.mul(t)).mul(1.0 / @r).asNormal()))
    null