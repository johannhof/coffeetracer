class @DirectionalLight
  constructor: (@color, @castsShadows, @direction) ->
  illuminates: (point, world) ->
    if not @castsShadows then return true
    ray = new Ray(point.subVector(@direction.normalized().mul(50)), @direction.normalized())
    hit = world.hit(ray)
    if hit is null or Math.round(hit.t * 100000.0) / 100000.0 >= Math.round(ray.tOf(point) * 100000) / 100000.0
      return true
    false
  directionFrom: (point) ->
    @direction.mul(-1)

class @PointLight
  constructor: (@color, @castsShadows, @position) ->
  illuminates: (point, world) ->
    if not @castsShadows then return true
    ray = new Ray(@position, point.subPoint(@position).normalized())
    hit = world.hit(ray)
    if hit is null or Math.round(hit.t * 100000.0) / 100000.0 >= Math.round(ray.tOf(point) * 100000) / 100000.0
      return true
    false
  directionFrom: (point) ->
    @position.subPoint(point).normalized()

class @Spotlight
  constructor: (@color, @castsShadows, @position, @direction, @halfAngle) ->
  illuminates: (point, world) ->
    ray = new Ray(@position, point.subPoint(@position).normalized())
    hit = world.hit(ray)
    alpha = Math.acos(@direction.dot(point.subPoint(@position)) / (@direction.magnitude * point.subPoint(@position).magnitude))
    if alpha <= @halfAngle and (@castsShadows is false or hit == null or Math.round(hit.t * 100000) / 100000 >= Math.round(ray.tOf(point) * 100000) / 100000)
      return true
    false
  directionFrom: (point) ->
    @position.subPoint(point).normalized()
