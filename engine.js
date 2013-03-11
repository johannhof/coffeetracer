// Generated by CoffeeScript 1.6.1
(function() {
  var render, restoreCam,
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
      var _this = this;
      this.e = e;
      this.g = g;
      this.t = t;
      this.s = s;
      this.rayFor = function(w, h, x, y) {
        return OrthographicCamera.prototype.rayFor.apply(_this, arguments);
      };
      OrthographicCamera.__super__.constructor.call(this, this.e, this.g, this.t);
    }

    OrthographicCamera.prototype.rayFor = function(w, h, x, y) {
      var a, o;
      a = w / h;
      o = this.e.add(this.u.mul(a * this.s * ((x - ((w - 1) / 2.0)) / (w - 1)))).add(this.v.mul(this.s * ((y - ((h - 1) / 2.0)) / (h - 1))));
      return new Ray(o, this.w.mul(-1));
    };

    return OrthographicCamera;

  })(Camera);

  this.PerspectiveCamera = (function(_super) {

    __extends(PerspectiveCamera, _super);

    function PerspectiveCamera(e, g, t, angle) {
      var _this = this;
      this.e = e;
      this.g = g;
      this.t = t;
      this.angle = angle;
      this.rayFor = function(w, h, x, y) {
        return PerspectiveCamera.prototype.rayFor.apply(_this, arguments);
      };
      PerspectiveCamera.__super__.constructor.call(this, this.e, this.g, this.t);
    }

    PerspectiveCamera.prototype.rayFor = function(w, h, x, y) {
      var d, r;
      r = this.w.mul(-1).mul((h / 2.0) / Math.tan(this.angle / 2.0)).add(this.u.mul(x - ((w - 1) / 2.0))).add(this.v.mul(y - ((h - 1) / 2.0)));
      d = r.mul(1.0 / r.magnitude);
      return new Ray(this.e, d);
    };

    return PerspectiveCamera;

  })(Camera);

  this.DirectionalLight = (function() {

    function DirectionalLight(color, castsShadows, direction) {
      this.color = color;
      this.castsShadows = castsShadows;
      this.direction = direction;
    }

    DirectionalLight.prototype.illuminates = function(point, world) {
      var hit, ray;
      if (!this.castsShadows) {
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
      ray = new Ray(this.position, point.subPoint(this.position).normalized());
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
      ray = new Ray(this.position, point.subPoint(this.position).normalized());
      hit = world.hit(ray);
      alpha = Math.acos(this.direction.dot(point.subPoint(this.position)) / (this.direction.magnitude * point.subPoint(this.position).magnitude));
      if (alpha <= this.halfAngle && (this.castsShadows === false || !hit || Math.round(hit.t * 100000) / 100000 >= Math.round(ray.tOf(point) * 100000) / 100000)) {
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
      var l, pointOnRay, returnColor, spec, _i, _len, _ref;
      returnColor = this.diffuse.mulColor(world.ambient);
      pointOnRay = hit.ray.at(hit.t);
      _ref = world.lights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l.illuminates(pointOnRay, world)) {
          spec = this.specular.mulColor(l.color.mulNumber(Math.pow(Math.max(hit.ray.d.dot(l.directionFrom(pointOnRay).reflectedOn(hit.normal).mul(-1.0)), 0), this.exponent)));
          returnColor = returnColor.add(this.diffuse.mulColor(l.color.mulNumber(Math.max(l.directionFrom(pointOnRay).dot(hit.normal), 0))).add(spec));
        }
      }
      return returnColor;
    };

    return PhongMaterial;

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
      var _this = this;
      this.a = a != null ? a : new Point3(0, 0, 0);
      this.n = n != null ? n : new Normal3(0, 1, 0);
      this.hit = function(ray) {
        return Plane.prototype.hit.apply(_this, arguments);
      };
      Plane.__super__.constructor.call(this, material);
    }

    Plane.prototype.hit = function(ray) {
      var t;
      t = this.a.subPoint(ray.o).dot(this.n) / ray.d.dot(this.n);
      if (t > epsilon(new Hit(t, ray, this, this.n))) {

      } else {
        return null;
      }
    };

    return Plane;

  })(Geometry);

  this.AxisAlignedBox = (function(_super) {

    __extends(AxisAlignedBox, _super);

    function AxisAlignedBox(material, lbf, run) {
      var _this = this;
      this.lbf = lbf != null ? lbf : new Point3(-0.5, -0.5, -0.5);
      this.run = run != null ? run : new Point3(0.5, 0.5, 0.5);
      this.hit = function(ray) {
        return AxisAlignedBox.prototype.hit.apply(_this, arguments);
      };
      AxisAlignedBox.__super__.constructor.call(this, material);
    }

    AxisAlignedBox.prototype.hit = function(ray) {
      var a, b, c, face_in, face_out, t0, t1, tx_max, tx_min, ty_max, ty_min, tz_max, tz_min, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
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
        face_in = (_ref = a >= 0.0) != null ? _ref : {
          0: 3
        };
      } else {
        t0 = ty_min;
        face_in = (_ref1 = b >= 0.0) != null ? _ref1 : {
          1: 4
        };
      }
      if (tz_min > t0) {
        t0 = tz_min;
        face_in = (_ref2 = c >= 0.0) != null ? _ref2 : {
          2: 5
        };
      }
      if (tx_max < ty_max) {
        t1 = tx_max;
        face_out = (_ref3 = a >= 0.0) != null ? _ref3 : {
          3: 0
        };
      } else {
        t1 = ty_max;
        face_out = (_ref4 = b >= 0.0) != null ? _ref4 : {
          4: 1
        };
      }
      if (tz_max < t1) {
        t1 = tz_max;
        face_out = (_ref5 = c >= 0.0) != null ? _ref5 : {
          5: 2
        };
      }
      if (t0 < t1 && t1 > epsilon) {
        if (t0 > epsilon) {
          return new Hit(t0, ray, this, getNormal(face_in));
        } else {
          return new Hit(t1, ray, this, getNormal(face_out));
        }
      }
      return null;
    };

    AxisAlignedBox.prototype.getNormal = function(face) {
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
      }
      return null;
    };

    return AxisAlignedBox;

  })(Geometry);

  this.Sphere = (function(_super) {

    __extends(Sphere, _super);

    function Sphere(material, c, r) {
      var _this = this;
      this.c = c != null ? c : new Point3(0, 0, 0);
      this.r = r != null ? r : 1;
      this.hit = function(ray) {
        return Sphere.prototype.hit.apply(_this, arguments);
      };
      Sphere.__super__.constructor.call(this, material);
    }

    Sphere.prototype.hit = function(ray) {
      var a, b, cn, d, t;
      a = ray.d.dot(ray.d);
      b = ray.d.dot((ray.o.subPoint(this.c)).mul(2));
      cn = ray.o.subPoint(this.c).dot(ray.o.subPoint(this.c)) - (this.r * this.r);
      d = (b * b) - 4.0 * a * cn;
      t = (-b - Math.sqrt(d)) / (2.0 * a);
      if (d > epsilon) {
        if (t > epsilon) {
          return new Hit(t, ray, this, ray.o.subPoint(this.c).add(ray.d.mul(t)).mul(1.0 / this.r).asNormal());
        }
        t = (-b + Math.sqrt(d)) / (2.0 * a);
        if (t > epsilon) {
          return new Hit(t, ray, this, ray.o.subPoint(this.c).add(ray.d.mul(t)).mul(1.0 / this.r).asNormal());
        }
      }
      return null;
    };

    return Sphere;

  })(Geometry);

  this.epsilon = 0.0001;

  this.Color = (function() {

    function Color(r, g, b) {
      var _this = this;
      this.r = r;
      this.g = g;
      this.b = b;
      this.mulNumber = function(d) {
        return Color.prototype.mulNumber.apply(_this, arguments);
      };
      this.mulColor = function(c) {
        return Color.prototype.mulColor.apply(_this, arguments);
      };
      this.sub = function(c) {
        return Color.prototype.sub.apply(_this, arguments);
      };
      this.add = function(c) {
        return Color.prototype.add.apply(_this, arguments);
      };
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
      var _this = this;
      this.o = o;
      this.d = d;
      this.tOf = function(p) {
        return Ray.prototype.tOf.apply(_this, arguments);
      };
      this.at = function(t) {
        return Ray.prototype.at.apply(_this, arguments);
      };
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
      var _this = this;
      this.backgroundColor = backgroundColor;
      this.elements = elements;
      this.lights = lights;
      this.ambient = ambient;
      this.indexOfRefraction = indexOfRefraction;
      this.hit = function(ray) {
        return World.prototype.hit.apply(_this, arguments);
      };
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

    Tracer.maxDepth = 6;

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

  this.Node = (function(_super) {

    __extends(Node, _super);

    function Node(transformation, geometries, material) {
      var _this = this;
      this.transformation = transformation;
      this.geometries = geometries;
      this.hit = function(ray) {
        return Node.prototype.hit.apply(_this, arguments);
      };
      Node.__super__.constructor.call(this, material);
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
    };

    return Node;

  })(Geometry);

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
      var _this = this;
      this.x = x;
      this.y = y;
      this.z = z;
      this.reflectedOn = function(n) {
        return Vector3.prototype.reflectedOn.apply(_this, arguments);
      };
      this.asNormal = function() {
        return Vector3.prototype.asNormal.apply(_this, arguments);
      };
      this.normalized = function() {
        return Vector3.prototype.normalized.apply(_this, arguments);
      };
      this.cross = function(v) {
        return Vector3.prototype.cross.apply(_this, arguments);
      };
      this.dot = function(v) {
        return Vector3.prototype.dot.apply(_this, arguments);
      };
      this.mul = function(c) {
        return Vector3.prototype.mul.apply(_this, arguments);
      };
      this.sub = function(n) {
        return Vector3.prototype.sub.apply(_this, arguments);
      };
      this.add = function(v) {
        return Vector3.prototype.add.apply(_this, arguments);
      };
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
      var _this = this;
      this.x = x;
      this.y = y;
      this.z = z;
      this.dot = function(v) {
        return Normal3.prototype.dot.apply(_this, arguments);
      };
      this.add = function(n) {
        return Normal3.prototype.add.apply(_this, arguments);
      };
      this.mul = function(c) {
        return Normal3.prototype.mul.apply(_this, arguments);
      };
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
      var _this = this;
      this.x = x;
      this.y = y;
      this.z = z;
      this.subVector = function(v) {
        return Point3.prototype.subVector.apply(_this, arguments);
      };
      this.subPoint = function(p) {
        return Point3.prototype.subPoint.apply(_this, arguments);
      };
      this.add = function(v) {
        return Point3.prototype.add.apply(_this, arguments);
      };
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
      var _this = this;
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
      this.xMat = function(m) {
        return Mat4x4.prototype.xMat.apply(_this, arguments);
      };
      this.xPoint = function(p) {
        return Mat4x4.prototype.xPoint.apply(_this, arguments);
      };
      this.xVector = function(v) {
        return Mat4x4.prototype.xVector.apply(_this, arguments);
      };
      this.transpond = function() {
        return Mat4x4.prototype.transpond.apply(_this, arguments);
      };
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
    e = new Point3(parseFloat(cam.e.x), parseFloat(cam.e.y), parseFloat(cam.e.z));
    g = new Vector3(parseFloat(cam.g.x), parseFloat(cam.g.y), parseFloat(cam.g.z));
    t = new Vector3(parseFloat(cam.t.x), parseFloat(cam.t.y), parseFloat(cam.t.z));
    if (cam.angle) {
      return new PerspectiveCamera(e, g, t, parseFloat(cam.angle));
    } else {
      return new OrthographicCamera(e, g, t, parseFloat(cam.s));
    }
  };

  self.addEventListener('message', function(e) {
    var data;
    data = JSON.parse(e.data);
    return render(data.startW, data.endW, data.startH, data.endH, data.width, data.height, restoreCam(data.cam));
  }, false);

  render = function(startW, endW, startH, endH, width, height, cam) {
    var c, imgData, objects, tracer, world, x, y, _i, _j;
    imgData = [];
    objects = [new Node(Transform.Scaling(1, 1, 1), [new Sphere(new PhongMaterial(new Color(1, 0, 0), new Color(1, 1, 1), 20))], null)];
    world = new World(new Color(0, 0, 0), objects, [new PointLight(new Color(1, 1, 1), true, new Point3(1, 1, 1))], new Color(0.3, 0.3, 0.3), 1);
    tracer = new Tracer(world);
    for (x = _i = startW; _i <= endW; x = _i += 1) {
      for (y = _j = startH; _j <= endH; y = _j += 1) {
        c = tracer.colorFor(cam.rayFor(width, height, x, y));
        imgData[(x * width + y) * 4 + 0] = c.r * 255.0;
        imgData[(x * width + y) * 4 + 1] = c.g * 255.0;
        imgData[(x * width + y) * 4 + 2] = c.b * 255.0;
      }
    }
    return self.postMessage({
      imgData: imgData
    });
  };

}).call(this);
