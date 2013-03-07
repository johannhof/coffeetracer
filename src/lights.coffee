class @DirectionalLight
  constructor: (@color, @castsShadows, @direction) ->
  illuminates: (point, world) ->
    if not @castsShadows then return true
    ray = new Ray(new Point3(@direction.x,@direction.y,@direction.z), @direction.normalized())
    hit = world.hit(ray)
    if not hit or Math.round(hit.t * 100000.0) / 100000.0 >= Math.round(ray.tOf(point) * 100000) / 100000.0
      return true
    false
  directionFrom: (point) ->
    @direction.normalized()

class @PointLight
  constructor: (@color, @castsShadows, @position) ->
  illuminates: (point, world) ->
    if not @castsShadows then return true
    ray = new Ray(@position, point.subPoint(@position).normalized())
    hit = world.hit(ray)
    if not hit or Math.round(hit.t * 100000.0) / 100000.0 >= Math.round(ray.tOf(point) * 100000) / 100000.0
      return true
    false
  directionFrom: (point) ->
    @position.subPoint(point).normalized()

class @SpotLight
  constructor: (@color, @castsShadows, @position, @direction, @halfAngle) ->
  illuminates: (point, world) ->
    ray = new Ray(@position, point.subPoint(@position).normalized())
    hit = world.hit(ray)
    alpha = Math.acos(@direction.dot(point.subPoint(@position)) / (@direction.magnitude * point.subPoint(@position).magnitude))
    if alpha <= @halfAngle and (@castsShadows is false or not hit or Math.round(hit.t * 100000) / 100000 >= Math.round(ray.tOf(point) * 100000) / 100000)
      return true
    false
  directionFrom: (point) ->
    @position.subPoint(point).normalized()
