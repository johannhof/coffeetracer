// Generated by CoffeeScript 1.7.1
(function() {
  var initialize, render, restoreCam, restoreColor, restoreLights, restoreMat4x4, restoreMaterial, restoreNormal, restoreObject, restoreObjects, restorePoint, restoreTransformation, restoreVector, restoreWorld,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Camera = (function() {
    function Camera(e, g, t) {
      this.e = e;
      this.g = g;
      this.t = t;
      this.w = this.g.mul(1.0 / this.g.magnitude).mul(-1);
      this.u = this.t.cross(this.w).mul(1.0 / this.t.cross(this.w).magnitude);
      this.v = this.w.cross(this.u);
    }

    return Camera;

  })();

  this.OrthographicCamera = (function(_super) {
    __extends(OrthographicCamera, _super);

    function OrthographicCamera(e, g, t, s) {
      this.e = e;
      this.g = g;
      this.t = t;
      this.s = s;
      OrthographicCamera.__super__.constructor.call(this, this.e, this.g, this.t);
    }

    OrthographicCamera.prototype.rayFor = function(w, h, x, y) {
      var a, o;
      a = w / h;
      o = this.e.add(this.u.mul(a * this.s * ((x - ((w - 1) / 2.0)) / (w - 1)))).add(this.v.mul(this.s * ((y - ((h - 1) / 2.0)) / (h - 1))));
      return new Ray(o, this.w.mul(-1));
    };

    return OrthographicCamera;

  })(this.Camera);

  this.PerspectiveCamera = (function(_super) {
    __extends(PerspectiveCamera, _super);

    function PerspectiveCamera(e, g, t, angle) {
      this.e = e;
      this.g = g;
      this.t = t;
      this.angle = angle;
      PerspectiveCamera.__super__.constructor.call(this, this.e, this.g, this.t);
    }

    PerspectiveCamera.prototype.rayFor = function(w, h, x, y) {
      var d, r;
      r = this.w.mul(-1).mul((h / 2.0) / Math.tan(this.angle / 2.0)).add(this.u.mul(x - ((w - 1) / 2.0))).add(this.v.mul(y - ((h - 1) / 2.0)));
      d = r.mul(1.0 / r.magnitude);
      return new Ray(this.e, d);
    };

    return PerspectiveCamera;

  })(this.Camera);

  this.DirectionalLight = (function() {
    function DirectionalLight(color, castsShadows, direction) {
      this.color = color;
      this.castsShadows = castsShadows;
      this.direction = direction;
    }

    DirectionalLight.prototype.illuminates = function(point, world) {
      var hit, ray;
      if (this.castsShadows == null) {
        return true;
      }
      ray = new Ray(new Point3(this.direction.x, this.direction.y, this.direction.z), this.direction.normalized());
      hit = world.hit(ray);
      if (!hit || Math.round(hit.t * 100000.0) / 100000.0 >= Math.round(ray.tOf(point) * 100000) / 100000.0) {
        return true;
      }
      return false;
    };

    DirectionalLight.prototype.directionFrom = function(point) {
      return this.direction.normalized();
    };

    return DirectionalLight;

  })();

  this.PointLight = (function() {
    function PointLight(color, castsShadows, position) {
      this.color = color;
      this.castsShadows = castsShadows;
      this.position = position;
    }

    PointLight.prototype.illuminates = function(point, world) {
      var hit, ray;
      if (!this.castsShadows) {
        return true;
      }
      ray = new Ray(point, this.position.subPoint(point).normalized());
      hit = world.hit(ray);
      if (!hit || Math.round(hit.t * 100000.0) / 100000.0 >= Math.round(ray.tOf(point) * 100000) / 100000.0) {
        return true;
      }
      return false;
    };

    PointLight.prototype.directionFrom = function(point) {
      return this.position.subPoint(point).normalized();
    };

    return PointLight;

  })();

  this.SpotLight = (function() {
    function SpotLight(color, castsShadows, position, direction, halfAngle) {
      this.color = color;
      this.castsShadows = castsShadows;
      this.position = position;
      this.direction = direction;
      this.halfAngle = halfAngle;
    }

    SpotLight.prototype.illuminates = function(point, world) {
      var alpha, hit, ray;
      ray = new Ray(point, this.position.subPoint(point).normalized());
      hit = world.hit(ray);
      alpha = Math.acos(this.direction.dot(point.subPoint(this.position)) / (this.direction.magnitude * point.subPoint(this.position).magnitude));
      if (alpha <= this.halfAngle && (!this.castsShadows || !hit || Math.round(hit.t * 100000) / 100000 >= Math.round(ray.tOf(point) * 100000) / 100000)) {
        return true;
      }
      return false;
    };

    SpotLight.prototype.directionFrom = function(point) {
      return this.position.subPoint(point).normalized();
    };

    return SpotLight;

  })();

  this.SingleColorMaterial = (function() {
    function SingleColorMaterial(color) {
      this.color = color;
      this.singleColorIndicator = true;
    }

    SingleColorMaterial.prototype.colorFor = function(hit, world, tracer) {
      var l, _i, _len, _ref;
      _ref = world.lights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l.illuminates(hit.ray.at(hit.t), world)) {
          return this.color;
        }
      }
      return world.backgroundColor;
    };

    return SingleColorMaterial;

  })();

  this.LambertMaterial = (function() {
    function LambertMaterial(color) {
      this.color = color;
    }

    LambertMaterial.prototype.colorFor = function(hit, world, tracer) {
      var l, returnColor, _i, _len, _ref;
      returnColor = this.color.mulColor(world.ambient);
      _ref = world.lights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l.illuminates(hit.ray.at(hit.t), world)) {
          returnColor = returnColor.add(this.color.mulColor(l.color.mulNumber(Math.max(l.directionFrom(hit.ray.at(hit.t)).dot(hit.normal), 0))));
        }
      }
      return returnColor;
    };

    return LambertMaterial;

  })();

  this.PhongMaterial = (function() {
    function PhongMaterial(diffuse, specular, exponent) {
      this.diffuse = diffuse;
      this.specular = specular;
      this.exponent = exponent;
    }

    PhongMaterial.prototype.colorFor = function(hit, world, tracer) {
      var direct, l, pointOnRay, returnColor, spec, _i, _len, _ref;
      returnColor = this.diffuse.mulColor(world.ambient);
      pointOnRay = hit.ray.at(hit.t);
      _ref = world.lights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l.illuminates(pointOnRay, world)) {
          direct = l.directionFrom(pointOnRay);
          spec = this.specular.mulColor(l.color.mulNumber(Math.pow(Math.max(hit.ray.d.dot(direct.reflectedOn(hit.normal).mul(-1.0)), 0), this.exponent)));
          returnColor = returnColor.add(this.diffuse.mulColor(l.color.mulNumber(Math.max(direct.dot(hit.normal), 0))).add(spec));
        }
      }
      return returnColor;
    };

    return PhongMaterial;

  })();

  this.ReflectiveMaterial = (function() {
    function ReflectiveMaterial(diffuse, specular, exponent, reflection) {
      this.diffuse = diffuse;
      this.specular = specular;
      this.exponent = exponent;
      this.reflection = reflection;
    }

    ReflectiveMaterial.prototype.colorFor = function(hit, world, tracer) {
      var direct, l, pointOnRay, reflec, returnColor, spec, _i, _len, _ref;
      returnColor = this.diffuse.mulColor(world.ambient);
      pointOnRay = hit.ray.at(hit.t);
      _ref = world.lights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l.illuminates(pointOnRay, world)) {
          direct = l.directionFrom(pointOnRay);
          spec = this.specular.mulColor(l.color.mulNumber(Math.pow(Math.max(hit.ray.d.dot(direct.reflectedOn(hit.normal).mul(-1.0)), 0), this.exponent)));
          returnColor = returnColor.add(this.diffuse.mulColor(l.color.mulNumber(Math.max(direct.dot(hit.normal), 0))).add(spec));
        }
      }
      reflec = this.reflection.mulColor(tracer.colorFor(new Ray(pointOnRay, hit.ray.d.add(hit.normal.mul(hit.ray.d.mul(-1).dot(hit.normal) * 2)))));
      return returnColor.add(reflec);
    };

    return ReflectiveMaterial;

  })();

  this.TransparentMaterial = (function() {
    TransparentMaterial.maxDepth = 3;

    function TransparentMaterial(indexOfRefraction) {
      this.indexOfRefraction = indexOfRefraction;
      this.recursionCounter = TransparentMaterial.maxDepth;
    }

    TransparentMaterial.prototype.colorFor = function(hit, world, tracer) {
      var R, R0, color, cosI, cosT, n1, n2, normal, t, tir;
      if (this.recursionCounter-- <= 0) {
        return world.backgroundColor;
      }
      normal = hit.normal;
      cosI = hit.ray.d.mul(-1).dot(normal);
      n1 = world.indexOfRefraction;
      n2 = this.indexOfRefraction;
      if (Math.acos(cosI) > 1.57079633) {
        normal = hit.normal.mul(-1);
        cosI = hit.ray.d.mul(-1).dot(normal);
        n1 = this.indexOfRefraction;
        n2 = world.indexOfRefraction;
      }
      cosT = Math.sqrt(1 - ((n1 / n2) * (n1 / n2)) * (1 - cosI * cosI));
      tir = n1 > n2 && (n1 / n2) * (n1 / n2) * (1 - cosI * cosI) > 1;
      R0 = Math.pow((n1 - n2) / (n1 + n2), 2);
      R = 1;
      if (n1 <= n2) {
        R = R0 + (1 - R0) * Math.pow(1 - cosI, 5);
      } else if (n1 > n2 && tir === false) {
        R = R0 + (1 - R0) * Math.pow(1 - cosT, 5);
      }
      if (R !== 1) {
        t = hit.ray.d.mul(n1 / n2).add(normal.mul(cosI * (n1 / n2) - cosT));
        color = (tracer.colorFor(new Ray(hit.ray.at(hit.t), hit.ray.d.add(normal.mul(cosI * 2)))).mulNumber(R)).add(tracer.colorFor(new Ray(hit.ray.at(hit.t), t)).mulNumber(1 - R));
        this.recursionCounter = TransparentMaterial.maxDepth;
        return color;
      } else {
        color = tracer.colorFor(new Ray(hit.ray.at(hit.t), hit.ray.d.add(normal.mul(cosI * 2))));
        this.recursionCounter = TransparentMaterial.maxDepth;
        return color;
      }
    };

    return TransparentMaterial;

  })();

  this.Geometry = (function() {
    function Geometry(material) {
      this.material = material;
    }

    return Geometry;

  })();

  this.Plane = (function(_super) {
    __extends(Plane, _super);

    function Plane(material, a, n) {
      this.a = a != null ? a : new Point3(0, 0, 0);
      this.n = n != null ? n : new Normal3(0, 1, 0);
      Plane.__super__.constructor.call(this, material);
    }

    Plane.prototype.hit = function(ray) {
      var t;
      t = this.a.subPoint(ray.o).dot(this.n) / ray.d.dot(this.n);
      if (t > epsilon) {
        return new Hit(t, ray, this, this.n);
      } else {
        return null;
      }
    };

    return Plane;

  })(Geometry);

  this.AxisAlignedBox = (function(_super) {
    __extends(AxisAlignedBox, _super);

    function AxisAlignedBox(material, lbf, run) {
      this.lbf = lbf != null ? lbf : new Point3(-0.5, -0.5, -0.5);
      this.run = run != null ? run : new Point3(0.5, 0.5, 0.5);
      AxisAlignedBox.__super__.constructor.call(this, material);
    }

    AxisAlignedBox.prototype.hit = function(ray) {
      var a, b, c, face_in, face_out, t0, t1, tx_max, tx_min, ty_max, ty_min, tz_max, tz_min;
      a = 1.0 / ray.d.x;
      if (a >= epsilon) {
        tx_min = (this.lbf.x - ray.o.x) * a;
        tx_max = (this.run.x - ray.o.x) * a;
      } else {
        tx_max = (this.lbf.x - ray.o.x) * a;
        tx_min = (this.run.x - ray.o.x) * a;
      }
      b = 1.0 / ray.d.y;
      if (b >= epsilon) {
        ty_min = (this.lbf.y - ray.o.y) * b;
        ty_max = (this.run.y - ray.o.y) * b;
      } else {
        ty_max = (this.lbf.y - ray.o.y) * b;
        ty_min = (this.run.y - ray.o.y) * b;
      }
      c = 1.0 / ray.d.z;
      if (c >= epsilon) {
        tz_min = (this.lbf.z - ray.o.z) * c;
        tz_max = (this.run.z - ray.o.z) * c;
      } else {
        tz_max = (this.lbf.z - ray.o.z) * c;
        tz_min = (this.run.z - ray.o.z) * c;
      }
      if (tx_min > ty_min) {
        t0 = tx_min;
        face_in = a >= 0.0 ? 3 : 0;
      } else {
        t0 = ty_min;
        face_in = b >= 0.0 ? 1 : 4;
      }
      if (tz_min > t0) {
        t0 = tz_min;
        face_in = c >= 0.0 ? 2 : 5;
      }
      if (tx_max < ty_max) {
        t1 = tx_max;
        face_out = a >= 0.0 ? 3 : 0;
      } else {
        t1 = ty_max;
        face_out = b >= 0.0 ? 4 : 1;
      }
      if (tz_max < t1) {
        t1 = tz_max;
        face_out = c >= 0.0 ? 5 : 2;
      }
      if (t0 < t1 && t1 > epsilon) {
        if (t0 > epsilon) {
          return new Hit(t0, ray, this, AxisAlignedBox.getNormal(face_in));
        } else {
          return new Hit(t1, ray, this, AxisAlignedBox.getNormal(face_out));
        }
      }
      return null;
    };

    AxisAlignedBox.getNormal = function(face) {
      switch (face) {
        case 0:
          return new Normal3(-1, 0, 0);
        case 1:
          return new Normal3(0, -1, 0);
        case 2:
          return new Normal3(0, 0, -1);
        case 3:
          return new Normal3(1, 0, 0);
        case 4:
          return new Normal3(0, 1, 0);
        case 5:
          return new Normal3(0, 0, 1);
        default:
          return null;
      }
    };

    return AxisAlignedBox;

  })(Geometry);

  this.Sphere = (function(_super) {
    __extends(Sphere, _super);

    function Sphere(material, c, r) {
      this.c = c != null ? c : new Point3(0, 0, 0);
      this.r = r != null ? r : 1;
      Sphere.__super__.constructor.call(this, material);
    }

    Sphere.prototype.hit = function(ray) {
      var a, b, d, oMinusC, t;
      a = ray.d.dot(ray.d);
      oMinusC = ray.o.subPoint(this.c);
      b = ray.d.dot(oMinusC.mul(2));
      d = (b * b) - 4.0 * a * (oMinusC.dot(oMinusC) - (this.r * this.r));
      t = (-b - Math.sqrt(d)) / (2.0 * a);
      if (d > epsilon) {
        if (t > epsilon) {
          return new Hit(t, ray, this, oMinusC.add(ray.d.mul(t)).mul(1.0 / this.r).asNormal());
        }
        t = (-b + Math.sqrt(d)) / (2.0 * a);
        if (t > epsilon) {
          return new Hit(t, ray, this, oMinusC.add(ray.d.mul(t)).mul(1.0 / this.r).asNormal());
        }
      }
      return null;
    };

    return Sphere;

  })(Geometry);

  this.Triangle = (function(_super) {
    __extends(Triangle, _super);

    function Triangle(material, a, b, c) {
      this.a = a;
      this.b = b;
      this.c = c;
      Triangle.__super__.constructor.call(this, material);
    }

    Triangle.prototype.hit = function(r) {
      var A, beta, gamma, t, v1, v2, x;
      A = new Mat3x3(this.a.x - this.b.x, this.a.x - this.c.x, r.d.x, this.a.y - this.b.y, this.a.y - this.c.y, r.d.y, this.a.z - this.b.z, this.a.z - this.c.z, r.d.z);
      x = new Vector3(this.a.x - r.o.x, this.a.y - r.o.y, this.a.z - r.o.z);
      beta = A.changeCol1(x).determinant / A.determinant;
      gamma = A.changeCol2(x).determinant / A.determinant;
      t = A.changeCol3(x).determinant / A.determinant;
      v1 = new Vector3(this.b.x - this.a.x, this.b.y - this.a.y, this.b.z - this.a.z);
      v2 = new Vector3(this.c.x - this.a.x, this.c.y - this.a.y, this.c.z - this.a.z);
      if (t > epsilon && epsilon <= beta && epsilon <= gamma && beta + gamma <= 1) {
        return new Hit(t, r, this, (v2.cross(v1)).asNormal());
      }
      return null;
    };

    return Triangle;

  })(Geometry);

  this.epsilon = 0.0001;

  this.Color = (function() {
    function Color(r, g, b) {
      this.r = r;
      this.g = g;
      this.b = b;
    }

    Color.prototype.add = function(c) {
      return new Color(this.r + c.r, this.g + c.g, this.b + c.b);
    };

    Color.prototype.sub = function(c) {
      return new Color(this.r - c.r, this.g - c.g, this.b - c.b);
    };

    Color.prototype.mulColor = function(c) {
      return new Color(this.r * c.r, this.g * c.g, this.b * c.b);
    };

    Color.prototype.mulNumber = function(d) {
      return new Color(this.r * d, this.g * d, this.b * d);
    };

    return Color;

  })();

  this.Ray = (function() {
    function Ray(o, d) {
      this.o = o;
      this.d = d;
    }

    Ray.prototype.at = function(t) {
      return this.o.add(this.d.mul(t));
    };

    Ray.prototype.tOf = function(p) {
      return this.o.subPoint(p).magnitude;
    };

    return Ray;

  })();

  this.World = (function() {
    function World(backgroundColor, elements, lights, ambient, indexOfRefraction) {
      this.backgroundColor = backgroundColor;
      this.elements = elements;
      this.lights = lights;
      this.ambient = ambient;
      this.indexOfRefraction = indexOfRefraction;
      this.hit = __bind(this.hit, this);
    }

    World.prototype.hit = function(ray) {
      var element, h, temp, _i, _len, _ref;
      temp = null;
      _ref = this.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        h = element.hit(ray);
        if (temp === null) {
          temp = h;
        }
        if (temp && h && temp.t > h.t) {
          temp = h;
        }
      }
      return temp;
    };

    return World;

  })();

  this.Hit = (function() {
    function Hit(t, ray, geo, normal) {
      this.t = t;
      this.ray = ray;
      this.geo = geo;
      this.normal = normal;
    }

    return Hit;

  })();

  this.Tracer = (function() {
    Tracer.maxDepth = 4;

    function Tracer(world) {
      this.world = world;
      this.recursionCounter = Tracer.maxDepth;
    }

    Tracer.prototype.colorFor = function(ray) {
      var color, hit;
      this.recursionCounter--;
      if (this.recursionCounter > 0) {
        hit = this.world.hit(ray);
        if (hit) {
          color = hit.geo.material.colorFor(hit, this.world, this);
          this.recursionCounter = Tracer.maxDepth;
          return color;
        }
      }
      this.recursionCounter = Tracer.maxDepth;
      return this.world.backgroundColor;
    };

    return Tracer;

  })();

  this.Node = (function() {
    function Node(transformation, geometries) {
      this.transformation = transformation;
      this.geometries = geometries;
      this.hit = __bind(this.hit, this);
    }

    Node.prototype.hit = function(ray) {
      var element, h, r, temp, _i, _len, _ref;
      r = new Ray(this.transformation.i.xPoint(ray.o), this.transformation.i.xVector(ray.d));
      temp = null;
      _ref = this.geometries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        h = element.hit(r);
        if (temp === null) {
          temp = h;
        }
        if (temp !== null && h !== null && temp.t > h.t) {
          temp = h;
        }
      }
      if (temp !== null) {
        return new Hit(temp.t, ray, temp.geo, this.transformation.i.transpond().xVector(new Vector3(temp.normal.x, temp.normal.y, temp.normal.z)).asNormal());
      }
      return null;
    };

    return Node;

  })();

  this.Transform = (function() {
    function Transform(m, i) {
      this.m = m;
      this.i = i;
    }

    Transform.Translation = function(x, y, z) {
      return new Transform(new Mat4x4(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1), new Mat4x4(1, 0, 0, -x, 0, 1, 0, -y, 0, 0, 1, -z, 0, 0, 0, 1));
    };

    Transform.Scaling = function(sx, sy, sz) {
      return new Transform(new Mat4x4(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1), new Mat4x4(1 / sx, 0, 0, 0, 0, 1 / sy, 0, 0, 0, 0, 1 / sz, 0, 0, 0, 0, 1));
    };

    Transform.XRotation = function(angle) {
      return new Transform(new Mat4x4(1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1), new Mat4x4(1, 0, 0, 0, 0, Math.cos(angle), Math.sin(angle), 0, 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1));
    };

    Transform.YRotation = function(angle) {
      return new Transform(new Mat4x4(Math.cos(angle), 0, Math.sin(angle), 0, 0, 1, 0, 0, -Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 1), new Mat4x4(Math.cos(angle), 0, -Math.sin(angle), 0, 0, 1, 0, 0, Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 1));
    };

    Transform.ZRotation = function(angle) {
      return new Transform(new Mat4x4(Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), new Mat4x4(Math.cos(angle), Math.sin(angle), 0, 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
    };

    Transform.prototype.translate = function(x, y, z) {
      return new Transform(this.m.xMat(new Mat4x4(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1)), this.i.xMat(new Mat4x4(1, 0, 0, -x, 0, 1, 0, -y, 0, 0, 1, -z, 0, 0, 0, 1)));
    };

    Transform.prototype.scale = function(sx, sy, sz) {
      return new Transform(this.m.xMat(new Mat4x4(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1)), this.i.xMat(new Mat4x4(1 / sx, 0, 0, 0, 0, 1 / sy, 0, 0, 0, 0, 1 / sz, 0, 0, 0, 0, 1)));
    };

    Transform.prototype.xRotate = function(angle) {
      return new Transform(this.m.xMat(new Mat4x4(1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1)), this.i.xMat(new Mat4x4(1, 0, 0, 0, 0, Math.cos(angle), Math.sin(angle), 0, 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1)));
    };

    Transform.prototype.yRotate = function(angle) {
      return new Transform(this.m.xMat(new Mat4x4(Math.cos(angle), 0, Math.sin(angle), 0, 0, 1, 0, 0, -Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 1)), this.i.xMat(new Mat4x4(Math.cos(angle), 0, -Math.sin(angle), 0, 0, 1, 0, 0, Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 1)));
    };

    Transform.prototype.zRotate = function(angle) {
      return new Transform(this.m.xMat(new Mat4x4(Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)), this.i.xMat(new Mat4x4(Math.cos(angle), Math.sin(angle), 0, 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)));
    };

    return Transform;

  })();

  this.Vector3 = (function() {
    function Vector3(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.magnitude = Math.sqrt((Math.pow(this.x, 2)) + (Math.pow(this.y, 2)) + (Math.pow(this.z, 2)));
    }

    Vector3.prototype.add = function(v) {
      return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    };

    Vector3.prototype.sub = function(n) {
      return new Vector3(this.x - n.x, this.y - n.y, this.z - n.z);
    };

    Vector3.prototype.mul = function(c) {
      return new Vector3(this.x * c, this.y * c, this.z * c);
    };

    Vector3.prototype.dot = function(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    Vector3.prototype.cross = function(v) {
      return new Vector3((this.y * v.z) - (this.z * v.y), (this.z * v.x) - (this.x * v.z), (this.x * v.y) - (this.y * v.x));
    };

    Vector3.prototype.normalized = function() {
      return this.mul(1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
    };

    Vector3.prototype.asNormal = function() {
      var v;
      v = this.normalized();
      return new Normal3(v.x, v.y, v.z);
    };

    Vector3.prototype.reflectedOn = function(n) {
      return this.add(n.mul(this.dot(n) * -2.0)).mul(-1);
    };

    return Vector3;

  })();

  this.Normal3 = (function() {
    function Normal3(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    Normal3.prototype.mul = function(c) {
      return new Normal3(this.x * c, this.y * c, this.z * c);
    };

    Normal3.prototype.add = function(n) {
      return new Normal3(this.x + n.x, this.y + n.y, this.z + n.z);
    };

    Normal3.prototype.dot = function(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    return Normal3;

  })();

  this.Point3 = (function() {
    function Point3(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    Point3.prototype.add = function(v) {
      return new Point3(this.x + v.x, this.y + v.y, this.z + v.z);
    };

    Point3.prototype.subPoint = function(p) {
      return new Vector3(this.x - p.x, this.y - p.y, this.z - p.z);
    };

    Point3.prototype.subVector = function(v) {
      return new Point3(this.x - v.x, this.y - v.y, this.z - v.z);
    };

    return Point3;

  })();

  this.Mat3x3 = (function() {
    function Mat3x3(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
      this.m11 = m11;
      this.m12 = m12;
      this.m13 = m13;
      this.m21 = m21;
      this.m22 = m22;
      this.m23 = m23;
      this.m31 = m31;
      this.m32 = m32;
      this.m33 = m33;
      this.determinant = (this.m11 * this.m22 * this.m33) + (this.m12 * this.m23 * this.m31) + (this.m13 * this.m21 * this.m32) - (this.m13 * this.m22 * this.m31) - (this.m12 * this.m21 * this.m33) - (this.m11 * this.m23 * this.m32);
    }

    Mat3x3.prototype.mulMat = function(m) {
      return new Mat3x3(this.m11 * m.m11 + this.m12 * m.m21 + this.m13 * m.m31, this.m11 * m.m12 + this.m12 * m.m22 + this.m13 * m.m32, this.m11 * m.m13 + this.m12 * m.m23 + this.m13 * m.m33, this.m21 * m.m11 + this.m22 * m.m21 + this.m23 * m.m31, this.m21 * m.m12 + this.m22 * m.m22 + this.m23 * m.m32, this.m21 * m.m13 + this.m22 * m.m23 + this.m23 * m.m33, this.m31 * m.m11 + this.m32 * m.m21 + this.m33 * m.m31, this.m31 * m.m12 + this.m32 * m.m22 + this.m33 * m.m32, this.m31 * m.m13 + this.m32 * m.m23 + this.m33 * m.m33);
    };

    Mat3x3.prototype.mulVec = function(v) {
      return new Vector3(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z);
    };

    Mat3x3.prototype.changeCol1 = function(v) {
      return new Mat3x3(v.x, this.m12, this.m13, v.y, this.m22, this.m23, v.z, this.m32, this.m33);
    };

    Mat3x3.prototype.changeCol2 = function(v) {
      return new Mat3x3(this.m11, v.x, this.m13, this.m21, v.y, this.m23, this.m31, v.z, this.m33);
    };

    Mat3x3.prototype.changeCol3 = function(v) {
      return new Mat3x3(this.m11, this.m12, v.x, this.m21, this.m22, v.y, this.m31, this.m32, v.z);
    };

    return Mat3x3;

  })();

  this.Mat4x4 = (function() {
    function Mat4x4(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
      this.m11 = m11;
      this.m12 = m12;
      this.m13 = m13;
      this.m14 = m14;
      this.m21 = m21;
      this.m22 = m22;
      this.m23 = m23;
      this.m24 = m24;
      this.m31 = m31;
      this.m32 = m32;
      this.m33 = m33;
      this.m34 = m34;
      this.m41 = m41;
      this.m42 = m42;
      this.m43 = m43;
      this.m44 = m44;
    }

    Mat4x4.prototype.transpond = function() {
      return new Mat4x4(this.m11, this.m21, this.m31, this.m41, this.m12, this.m22, this.m32, this.m42, this.m13, this.m23, this.m33, this.m43, this.m14, this.m24, this.m34, this.m44);
    };

    Mat4x4.prototype.xVector = function(v) {
      return new Vector3(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z);
    };

    Mat4x4.prototype.xPoint = function(p) {
      return new Point3(this.m11 * p.x + this.m12 * p.y + this.m13 * p.z + this.m14, this.m21 * p.x + this.m22 * p.y + this.m23 * p.z + this.m24, this.m31 * p.x + this.m32 * p.y + this.m33 * p.z + this.m34);
    };

    Mat4x4.prototype.xMat = function(m) {
      return new Mat4x4(this.m11 * m.m11 + this.m12 * m.m21 + this.m13 * m.m31 + this.m14 * m.m41, this.m11 * m.m12 + this.m12 * m.m22 + this.m13 * m.m32 + this.m14 * m.m42, this.m11 * m.m13 + this.m12 * m.m23 + this.m13 * m.m33 + this.m14 * m.m43, this.m11 * m.m14 + this.m12 * m.m24 + this.m13 * m.m34 + this.m14 * m.m44, this.m21 * m.m11 + this.m22 * m.m21 + this.m23 * m.m31 + this.m24 * m.m41, this.m21 * m.m12 + this.m22 * m.m22 + this.m23 * m.m32 + this.m24 * m.m42, this.m21 * m.m13 + this.m22 * m.m23 + this.m23 * m.m33 + this.m24 * m.m43, this.m21 * m.m14 + this.m22 * m.m24 + this.m23 * m.m34 + this.m24 * m.m44, this.m31 * m.m11 + this.m32 * m.m21 + this.m33 * m.m31 + this.m34 * m.m41, this.m31 * m.m12 + this.m32 * m.m22 + this.m33 * m.m32 + this.m34 * m.m42, this.m31 * m.m13 + this.m32 * m.m23 + this.m33 * m.m33 + this.m34 * m.m43, this.m31 * m.m14 + this.m32 * m.m24 + this.m33 * m.m34 + this.m34 * m.m44, this.m41 * m.m11 + this.m42 * m.m21 + this.m43 * m.m31 + this.m44 * m.m41, this.m41 * m.m12 + this.m42 * m.m22 + this.m43 * m.m32 + this.m44 * m.m42, this.m41 * m.m13 + this.m42 * m.m23 + this.m43 * m.m33 + this.m44 * m.m43, this.m41 * m.m14 + this.m42 * m.m24 + this.m43 * m.m34 + this.m44 * m.m44);
    };

    return Mat4x4;

  })();

  restoreCam = function(cam) {
    var e, g, t;
    e = restorePoint(cam.e);
    g = restoreVector(cam.g);
    t = restoreVector(cam.t);
    if (cam.angle) {
      return new PerspectiveCamera(e, g, t, parseFloat(cam.angle));
    } else {
      return new OrthographicCamera(e, g, t, parseFloat(cam.s));
    }
  };

  restoreWorld = function(world) {
    return new World(restoreColor(world.backgroundColor), restoreObjects(world.elements), restoreLights(world.lights), restoreColor(world.ambient), parseFloat(world.indexOfRefraction));
  };

  restoreObjects = function(objects) {
    var object, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      object = objects[_i];
      _results.push(restoreObject(object));
    }
    return _results;
  };

  restoreObject = function(object) {
    if (object.a && object.n) {
      return new Plane(restoreMaterial(object.material), restorePoint(object.a), restoreNormal(object.n));
    }
    if (object.lbf) {
      return new AxisAlignedBox(restoreMaterial(object.material), restorePoint(object.lbf), restorePoint(object.run));
    }
    if (object.c && object.r) {
      return new Sphere(restoreMaterial(object.material), restorePoint(object.c), parseFloat(object.r));
    }
    if (object.a && object.b && object.c) {
      return new Triangle(restoreMaterial(object.material), restorePoint(object.a), restorePoint(object.b), restorePoint(object.c));
    }
    if (object.geometries) {
      return new Node(restoreTransformation(object.transformation), restoreObjects(object.geometries));
    }
  };

  restoreTransformation = function(transformation) {
    return new Transform(restoreMat4x4(transformation.m), restoreMat4x4(transformation.i));
  };

  restoreMat4x4 = function(matrix) {
    return new Mat4x4(matrix.m11, matrix.m12, matrix.m13, matrix.m14, matrix.m21, matrix.m22, matrix.m23, matrix.m24, matrix.m31, matrix.m32, matrix.m33, matrix.m34, matrix.m41, matrix.m42, matrix.m43, matrix.m44);
  };

  restoreMaterial = function(material) {
    if (material.indexOfRefraction) {
      return new TransparentMaterial(parseFloat(material.indexOfRefraction));
    }
    if (material.reflection) {
      return new ReflectiveMaterial(restoreColor(material.diffuse), restoreColor(material.specular), parseFloat(material.exponent), restoreColor(material.reflection));
    }
    if (material.diffuse) {
      return new PhongMaterial(restoreColor(material.diffuse), restoreColor(material.specular), parseFloat(material.exponent));
    }
    if (material.singleColorIndicator) {
      return new SingleColorMaterial(restoreColor(material.color));
    }
    return new LambertMaterial(restoreColor(material.color));
  };

  restoreColor = function(color) {
    return new Color(parseFloat(color.r), parseFloat(color.g), parseFloat(color.b));
  };

  restorePoint = function(point) {
    return new Point3(parseFloat(point.x), parseFloat(point.y), parseFloat(point.z));
  };

  restoreVector = function(vector) {
    return new Vector3(parseFloat(vector.x), parseFloat(vector.y), parseFloat(vector.z));
  };

  restoreNormal = function(normal) {
    return new Normal3(parseFloat(normal.x), parseFloat(normal.y), parseFloat(normal.z));
  };

  restoreLights = function(lights) {
    var color, direction, light, position, returnLights, shadows, _i, _len;
    returnLights = [];
    for (_i = 0, _len = lights.length; _i < _len; _i++) {
      light = lights[_i];
      color = restoreColor(light.color);
      shadows = light.castsShadows;
      position = null;
      direction = null;
      if (light.position) {
        position = restorePoint(light.position);
      }
      if (light.direction) {
        direction = restoreVector(light.direction);
      }
      if (position && direction && light.halfAngle) {
        returnLights.push(new SpotLight(color, shadows, position, direction, parseFloat(light.halfAngle)));
      } else if (direction) {
        returnLights.push(new DirectionalLight(color, shadows, direction));
      } else if (position) {
        returnLights.push(new PointLight(color, shadows, position));
      }
    }
    return returnLights;
  };

  initialize = function(e) {
    var data;
    data = JSON.parse(e.data);
    return render(data.startW, data.endW, data.width, data.height, restoreCam(data.cam), restoreWorld(data.world));
  };

  self.addEventListener('message', initialize, false);

  render = function(startW, endW, width, height, cam, world) {
    var c, imgData, tracer, x, y, _i, _j;
    imgData = [];
    tracer = new Tracer(world);
    for (x = _i = startW; _i <= endW; x = _i += 1) {
      for (y = _j = 0; _j <= height; y = _j += 1) {
        c = tracer.colorFor(cam.rayFor(width, height, x, y));
        imgData[(x + (height - y - 1) * width) * 4 + 0] = c.r * 255.0;
        imgData[(x + (height - y - 1) * width) * 4 + 1] = c.g * 255.0;
        imgData[(x + (height - y - 1) * width) * 4 + 2] = c.b * 255.0;
      }
    }
    return self.postMessage({
      imgData: imgData
    });
  };

}).call(this);
