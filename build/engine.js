(function(){var t,i,n,s,o,r,h,e,a,m,u,l,c,f,p={}.hasOwnProperty,d=function(t,i){function n(){this.constructor=t}for(var s in i)p.call(i,s)&&(t[s]=i[s]);return n.prototype=i.prototype,t.prototype=new n,t.__super__=i.prototype,t};this.Camera=function(){function t(t,i,n){this.e=t,this.g=i,this.t=n,this.w=this.g.mul(1/this.g.magnitude).mul(-1),this.u=this.t.cross(this.w).mul(1/this.t.cross(this.w).magnitude),this.v=this.w.cross(this.u)}return t}(),this.OrthographicCamera=function(t){function i(t,n,s,o){this.e=t,this.g=n,this.t=s,this.s=o,i.__super__.constructor.call(this,this.e,this.g,this.t)}return d(i,t),i.prototype.rayFor=function(t,i,n,s){var o,r;return o=t/i,r=this.e.add(this.u.mul(o*this.s*((n-(t-1)/2)/(t-1)))).add(this.v.mul(this.s*((s-(i-1)/2)/(i-1)))),new Ray(r,this.w.mul(-1))},i}(this.Camera),this.PerspectiveCamera=function(t){function i(t,n,s,o){this.e=t,this.g=n,this.t=s,this.angle=o,i.__super__.constructor.call(this,this.e,this.g,this.t)}return d(i,t),i.prototype.rayFor=function(t,i,n,s){var o,r;return r=this.w.mul(-1).mul(i/2/Math.tan(this.angle/2)).add(this.u.mul(n-(t-1)/2)).add(this.v.mul(s-(i-1)/2)),o=r.mul(1/r.magnitude),new Ray(this.e,o)},i}(this.Camera),this.DirectionalLight=function(){function t(t,i,n){this.color=t,this.castsShadows=i,this.direction=n}return t.prototype.illuminates=function(t,i){var n,s;return null==this.castsShadows?!0:(s=new Ray(new Point3(this.direction.x,this.direction.y,this.direction.z),this.direction.normalized()),n=i.hit(s),!n||Math.round(1e5*n.t)/1e5>=Math.round(1e5*s.tOf(t))/1e5?!0:!1)},t.prototype.directionFrom=function(){return this.direction.normalized()},t}(),this.PointLight=function(){function t(t,i,n){this.color=t,this.castsShadows=i,this.position=n}return t.prototype.illuminates=function(t,i){var n,s;return this.castsShadows?(s=new Ray(this.position,t.subPoint(this.position).normalized()),n=i.hit(s),!n||Math.round(1e3*n.t)/1e3>=Math.round(1e3*s.tOf(t))/1e3?!0:!1):!0},t.prototype.directionFrom=function(t){return this.position.subPoint(t).normalized()},t}(),this.SpotLight=function(){function t(t,i,n,s,o){this.color=t,this.castsShadows=i,this.position=n,this.direction=s,this.halfAngle=o}return t.prototype.illuminates=function(t,i){var n,s,o;return o=new Ray(this.position,t.subPoint(this.position).normalized()),s=i.hit(o),n=Math.acos(this.direction.dot(t.subPoint(this.position))/(this.direction.magnitude*t.subPoint(this.position).magnitude)),n<=this.halfAngle&&(!this.castsShadows||!s||Math.round(1e5*s.t)/1e5>=Math.round(1e5*o.tOf(t))/1e5)?!0:!1},t.prototype.directionFrom=function(t){return this.position.subPoint(t).normalized()},t}(),this.SingleColorMaterial=function(){function t(t){this.color=t,this.singleColorIndicator=!0}return t.prototype.colorFor=function(t,i){var n,s,o,r;for(r=i.lights,s=0,o=r.length;o>s;s++)if(n=r[s],n.illuminates(t.ray.at(t.t),i))return this.color;return i.backgroundColor},t}(),this.LambertMaterial=function(){function t(t){this.color=t}return t.prototype.colorFor=function(t,i){var n,s,o,r,h;for(s=this.color.mulColor(i.ambient),h=i.lights,o=0,r=h.length;r>o;o++)n=h[o],n.illuminates(t.ray.at(t.t),i)&&(s=s.add(this.color.mulColor(n.color.mulNumber(Math.max(n.directionFrom(t.ray.at(t.t)).dot(t.normal),0)))));return s},t}(),this.PhongMaterial=function(){function t(t,i,n){this.diffuse=t,this.specular=i,this.exponent=n}return t.prototype.colorFor=function(t,i){var n,s,o,r,h,e,a,m;for(r=this.diffuse.mulColor(i.ambient),o=t.ray.at(t.t),m=i.lights,e=0,a=m.length;a>e;e++)s=m[e],s.illuminates(o,i)&&(n=s.directionFrom(o),h=this.specular.mulColor(s.color.mulNumber(Math.pow(Math.max(t.ray.d.dot(n.reflectedOn(t.normal).mul(-1)),0),this.exponent))),r=r.add(this.diffuse.mulColor(s.color.mulNumber(Math.max(n.dot(t.normal),0))).add(h)));return r},t}(),this.ReflectiveMaterial=function(){function t(t,i,n,s){this.diffuse=t,this.specular=i,this.exponent=n,this.reflection=s}return t.prototype.colorFor=function(t,i,n){var s,o,r,h,e,a,m,u,l;for(e=this.diffuse.mulColor(i.ambient),r=t.ray.at(t.t),l=i.lights,m=0,u=l.length;u>m;m++)o=l[m],o.illuminates(r,i)&&(s=o.directionFrom(r),a=this.specular.mulColor(o.color.mulNumber(Math.pow(Math.max(t.ray.d.dot(s.reflectedOn(t.normal).mul(-1)),0),this.exponent))),e=e.add(this.diffuse.mulColor(o.color.mulNumber(Math.max(s.dot(t.normal),0))).add(a)));return h=this.reflection.mulColor(n.colorFor(new Ray(r,t.ray.d.add(t.normal.mul(2*t.ray.d.mul(-1).dot(t.normal)))))),e.add(h)},t}(),this.TransparentMaterial=function(){function t(i){this.indexOfRefraction=i,this.recursionCounter=t.maxDepth}return t.maxDepth=3,t.prototype.colorFor=function(i,n,s){var o,r,h,e,a,m,u,l,c,f;return this.recursionCounter--<=0?n.backgroundColor:(l=i.normal,e=i.ray.d.mul(-1).dot(l),m=n.indexOfRefraction,u=this.indexOfRefraction,Math.acos(e)>1.57079633&&(l=i.normal.mul(-1),e=i.ray.d.mul(-1).dot(l),m=this.indexOfRefraction,u=n.indexOfRefraction),a=Math.sqrt(1-m/u*(m/u)*(1-e*e)),f=m>u&&m/u*(m/u)*(1-e*e)>1,r=Math.pow((m-u)/(m+u),2),o=1,u>=m?o=r+(1-r)*Math.pow(1-e,5):m>u&&f===!1&&(o=r+(1-r)*Math.pow(1-a,5)),1!==o?(c=i.ray.d.mul(m/u).add(l.mul(e*(m/u)-a)),h=s.colorFor(new Ray(i.ray.at(i.t),i.ray.d.add(l.mul(2*e)))).mulNumber(o).add(s.colorFor(new Ray(i.ray.at(i.t),c)).mulNumber(1-o)),this.recursionCounter=t.maxDepth,h):(h=s.colorFor(new Ray(i.ray.at(i.t),i.ray.d.add(l.mul(2*e)))),this.recursionCounter=t.maxDepth,h))},t}(),this.Geometry=function(){function t(t){this.material=t}return t}(),this.Plane=function(t){function i(t,n,s){this.a=null!=n?n:new Point3(0,0,0),this.n=null!=s?s:new Normal3(0,1,0),i.__super__.constructor.call(this,t)}return d(i,t),i.prototype.hit=function(t){var i;return i=this.a.subPoint(t.o).dot(this.n)/t.d.dot(this.n),i>epsilon?new Hit(i,t,this,this.n):null},i}(Geometry),this.AxisAlignedBox=function(t){function i(t,n,s){this.lbf=null!=n?n:new Point3(-.5,-.5,-.5),this.run=null!=s?s:new Point3(.5,.5,.5),i.__super__.constructor.call(this,t)}return d(i,t),i.prototype.hit=function(t){var n,s,o,r,h,e,a,m,u,l,c,f,p;return n=1/t.d.x,n>=epsilon?(u=(this.lbf.x-t.o.x)*n,m=(this.run.x-t.o.x)*n):(m=(this.lbf.x-t.o.x)*n,u=(this.run.x-t.o.x)*n),s=1/t.d.y,s>=epsilon?(c=(this.lbf.y-t.o.y)*s,l=(this.run.y-t.o.y)*s):(l=(this.lbf.y-t.o.y)*s,c=(this.run.y-t.o.y)*s),o=1/t.d.z,o>=epsilon?(p=(this.lbf.z-t.o.z)*o,f=(this.run.z-t.o.z)*o):(f=(this.lbf.z-t.o.z)*o,p=(this.run.z-t.o.z)*o),u>c?(e=u,r=n>=0?3:0):(e=c,r=s>=0?1:4),p>e&&(e=p,r=o>=0?2:5),l>m?(a=m,h=n>=0?3:0):(a=l,h=s>=0?4:1),a>f&&(a=f,h=o>=0?5:2),a>e&&a>epsilon?e>epsilon?new Hit(e,t,this,i.getNormal(r)):new Hit(a,t,this,i.getNormal(h)):null},i.getNormal=function(t){switch(t){case 0:return new Normal3(-1,0,0);case 1:return new Normal3(0,-1,0);case 2:return new Normal3(0,0,-1);case 3:return new Normal3(1,0,0);case 4:return new Normal3(0,1,0);case 5:return new Normal3(0,0,1);default:return null}},i}(Geometry),this.Sphere=function(t){function i(t,n,s){this.c=null!=n?n:new Point3(0,0,0),this.r=null!=s?s:1,i.__super__.constructor.call(this,t)}return d(i,t),i.prototype.hit=function(t){var i,n,s,o,r;if(i=t.d.dot(t.d),o=t.o.subPoint(this.c),n=t.d.dot(o.mul(2)),s=n*n-4*i*(o.dot(o)-this.r*this.r),r=(-n-Math.sqrt(s))/(2*i),s>epsilon){if(r>epsilon)return new Hit(r,t,this,o.add(t.d.mul(r)).mul(1/this.r).asNormal());if(r=(-n+Math.sqrt(s))/(2*i),r>epsilon)return new Hit(r,t,this,o.add(t.d.mul(r)).mul(1/this.r).asNormal())}return null},i}(Geometry),this.Triangle=function(t){function i(t,n,s,o){this.a=n,this.b=s,this.c=o,i.__super__.constructor.call(this,t)}return d(i,t),i.prototype.hit=function(t){var i,n,s,o,r,h,e;return i=new Mat3x3(this.a.x-this.b.x,this.a.x-this.c.x,t.d.x,this.a.y-this.b.y,this.a.y-this.c.y,t.d.y,this.a.z-this.b.z,this.a.z-this.c.z,t.d.z),e=new Vector3(this.a.x-t.o.x,this.a.y-t.o.y,this.a.z-t.o.z),n=i.changeCol1(e).determinant/i.determinant,s=i.changeCol2(e).determinant/i.determinant,o=i.changeCol3(e).determinant/i.determinant,r=new Vector3(this.b.x-this.a.x,this.b.y-this.a.y,this.b.z-this.a.z),h=new Vector3(this.c.x-this.a.x,this.c.y-this.a.y,this.c.z-this.a.z),o>epsilon&&n>=epsilon&&s>=epsilon&&1>=n+s?new Hit(o,t,this,h.cross(r).asNormal()):null},i}(Geometry),this.epsilon=1e-4,this.Color=function(){function t(t,i,n){this.r=t,this.g=i,this.b=n}return t.prototype.add=function(i){return new t(this.r+i.r,this.g+i.g,this.b+i.b)},t.prototype.sub=function(i){return new t(this.r-i.r,this.g-i.g,this.b-i.b)},t.prototype.mulColor=function(i){return new t(this.r*i.r,this.g*i.g,this.b*i.b)},t.prototype.mulNumber=function(i){return new t(this.r*i,this.g*i,this.b*i)},t}(),this.Ray=function(){function t(t,i){this.o=t,this.d=i}return t.prototype.at=function(t){return this.o.add(this.d.mul(t))},t.prototype.tOf=function(t){return this.o.subPoint(t).magnitude},t}(),this.World=function(){function t(t,i,n,s,o){this.backgroundColor=t,this.elements=i,this.lights=n,this.ambient=s,this.indexOfRefraction=o}return t.prototype.hit=function(t){var i,n,s,o,r,h;for(s=null,h=this.elements,o=0,r=h.length;r>o;o++)i=h[o],n=i.hit(t),null===s&&(s=n),s&&n&&s.t>n.t&&(s=n);return s},t}(),this.Hit=function(){function t(t,i,n,s){this.t=t,this.ray=i,this.geo=n,this.normal=s}return t}(),this.Tracer=function(){function t(i){this.world=i,this.recursionCounter=t.maxDepth}return t.maxDepth=4,t.prototype.colorFor=function(i){var n,s;return this.recursionCounter--,this.recursionCounter>0&&(s=this.world.hit(i))?(n=s.geo.material.colorFor(s,this.world,this),this.recursionCounter=t.maxDepth,n):(this.recursionCounter=t.maxDepth,this.world.backgroundColor)},t}(),this.Node=function(){function t(t,i){this.transformation=t,this.geometries=i}return t.prototype.hit=function(t){var i,n,s,o,r,h,e;for(s=new Ray(this.transformation.i.xPoint(t.o),this.transformation.i.xVector(t.d)),o=null,e=this.geometries,r=0,h=e.length;h>r;r++)i=e[r],n=i.hit(s),null===o&&(o=n),null!==o&&null!==n&&o.t>n.t&&(o=n);return null!==o?new Hit(o.t,t,o.geo,this.transformation.i.transpond().xVector(new Vector3(o.normal.x,o.normal.y,o.normal.z)).asNormal()):null},t}(),this.Transform=function(){function t(t,i){this.m=t,this.i=i}return t.Translation=function(i,n,s){return new t(new Mat4x4(1,0,0,i,0,1,0,n,0,0,1,s,0,0,0,1),new Mat4x4(1,0,0,-i,0,1,0,-n,0,0,1,-s,0,0,0,1))},t.Scaling=function(i,n,s){return new t(new Mat4x4(i,0,0,0,0,n,0,0,0,0,s,0,0,0,0,1),new Mat4x4(1/i,0,0,0,0,1/n,0,0,0,0,1/s,0,0,0,0,1))},t.XRotation=function(i){return new t(new Mat4x4(1,0,0,0,0,Math.cos(i),-Math.sin(i),0,0,Math.sin(i),Math.cos(i),0,0,0,0,1),new Mat4x4(1,0,0,0,0,Math.cos(i),Math.sin(i),0,0,-Math.sin(i),Math.cos(i),0,0,0,0,1))},t.YRotation=function(i){return new t(new Mat4x4(Math.cos(i),0,Math.sin(i),0,0,1,0,0,-Math.sin(i),0,Math.cos(i),0,0,0,0,1),new Mat4x4(Math.cos(i),0,-Math.sin(i),0,0,1,0,0,Math.sin(i),0,Math.cos(i),0,0,0,0,1))},t.ZRotation=function(i){return new t(new Mat4x4(Math.cos(i),-Math.sin(i),0,0,Math.sin(i),Math.cos(i),0,0,0,0,1,0,0,0,0,1),new Mat4x4(Math.cos(i),Math.sin(i),0,0,-Math.sin(i),Math.cos(i),0,0,0,0,1,0,0,0,0,1))},t.prototype.translate=function(i,n,s){return new t(this.m.xMat(new Mat4x4(1,0,0,i,0,1,0,n,0,0,1,s,0,0,0,1)),this.i.xMat(new Mat4x4(1,0,0,-i,0,1,0,-n,0,0,1,-s,0,0,0,1)))},t.prototype.scale=function(i,n,s){return new t(this.m.xMat(new Mat4x4(i,0,0,0,0,n,0,0,0,0,s,0,0,0,0,1)),this.i.xMat(new Mat4x4(1/i,0,0,0,0,1/n,0,0,0,0,1/s,0,0,0,0,1)))},t.prototype.xRotate=function(i){return new t(this.m.xMat(new Mat4x4(1,0,0,0,0,Math.cos(i),-Math.sin(i),0,0,Math.sin(i),Math.cos(i),0,0,0,0,1)),this.i.xMat(new Mat4x4(1,0,0,0,0,Math.cos(i),Math.sin(i),0,0,-Math.sin(i),Math.cos(i),0,0,0,0,1)))},t.prototype.yRotate=function(i){return new t(this.m.xMat(new Mat4x4(Math.cos(i),0,Math.sin(i),0,0,1,0,0,-Math.sin(i),0,Math.cos(i),0,0,0,0,1)),this.i.xMat(new Mat4x4(Math.cos(i),0,-Math.sin(i),0,0,1,0,0,Math.sin(i),0,Math.cos(i),0,0,0,0,1)))},t.prototype.zRotate=function(i){return new t(this.m.xMat(new Mat4x4(Math.cos(i),-Math.sin(i),0,0,Math.sin(i),Math.cos(i),0,0,0,0,1,0,0,0,0,1)),this.i.xMat(new Mat4x4(Math.cos(i),Math.sin(i),0,0,-Math.sin(i),Math.cos(i),0,0,0,0,1,0,0,0,0,1)))},t}(),this.Vector3=function(){function t(t,i,n){this.x=t,this.y=i,this.z=n,this.magnitude=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)+Math.pow(this.z,2))}return t.prototype.add=function(i){return new t(this.x+i.x,this.y+i.y,this.z+i.z)},t.prototype.sub=function(i){return new t(this.x-i.x,this.y-i.y,this.z-i.z)},t.prototype.mul=function(i){return new t(this.x*i,this.y*i,this.z*i)},t.prototype.dot=function(t){return this.x*t.x+this.y*t.y+this.z*t.z},t.prototype.cross=function(i){return new t(this.y*i.z-this.z*i.y,this.z*i.x-this.x*i.z,this.x*i.y-this.y*i.x)},t.prototype.normalized=function(){return this.mul(1/Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z))},t.prototype.asNormal=function(){var t;return t=this.normalized(),new Normal3(t.x,t.y,t.z)},t.prototype.reflectedOn=function(t){return this.add(t.mul(-2*this.dot(t))).mul(-1)},t}(),this.Normal3=function(){function t(t,i,n){this.x=t,this.y=i,this.z=n}return t.prototype.mul=function(i){return new t(this.x*i,this.y*i,this.z*i)},t.prototype.add=function(i){return new t(this.x+i.x,this.y+i.y,this.z+i.z)},t.prototype.dot=function(t){return this.x*t.x+this.y*t.y+this.z*t.z},t}(),this.Point3=function(){function t(t,i,n){this.x=t,this.y=i,this.z=n}return t.prototype.add=function(i){return new t(this.x+i.x,this.y+i.y,this.z+i.z)},t.prototype.subPoint=function(t){return new Vector3(this.x-t.x,this.y-t.y,this.z-t.z)},t.prototype.subVector=function(i){return new t(this.x-i.x,this.y-i.y,this.z-i.z)},t}(),this.Mat3x3=function(){function t(t,i,n,s,o,r,h,e,a){this.m11=t,this.m12=i,this.m13=n,this.m21=s,this.m22=o,this.m23=r,this.m31=h,this.m32=e,this.m33=a,this.determinant=this.m11*this.m22*this.m33+this.m12*this.m23*this.m31+this.m13*this.m21*this.m32-this.m13*this.m22*this.m31-this.m12*this.m21*this.m33-this.m11*this.m23*this.m32}return t.prototype.mulMat=function(i){return new t(this.m11*i.m11+this.m12*i.m21+this.m13*i.m31,this.m11*i.m12+this.m12*i.m22+this.m13*i.m32,this.m11*i.m13+this.m12*i.m23+this.m13*i.m33,this.m21*i.m11+this.m22*i.m21+this.m23*i.m31,this.m21*i.m12+this.m22*i.m22+this.m23*i.m32,this.m21*i.m13+this.m22*i.m23+this.m23*i.m33,this.m31*i.m11+this.m32*i.m21+this.m33*i.m31,this.m31*i.m12+this.m32*i.m22+this.m33*i.m32,this.m31*i.m13+this.m32*i.m23+this.m33*i.m33)},t.prototype.mulVec=function(t){return new Vector3(this.m11*t.x+this.m12*t.y+this.m13*t.z,this.m21*t.x+this.m22*t.y+this.m23*t.z,this.m31*t.x+this.m32*t.y+this.m33*t.z)},t.prototype.changeCol1=function(i){return new t(i.x,this.m12,this.m13,i.y,this.m22,this.m23,i.z,this.m32,this.m33)},t.prototype.changeCol2=function(i){return new t(this.m11,i.x,this.m13,this.m21,i.y,this.m23,this.m31,i.z,this.m33)},t.prototype.changeCol3=function(i){return new t(this.m11,this.m12,i.x,this.m21,this.m22,i.y,this.m31,this.m32,i.z)},t}(),this.Mat4x4=function(){function t(t,i,n,s,o,r,h,e,a,m,u,l,c,f,p,d){this.m11=t,this.m12=i,this.m13=n,this.m14=s,this.m21=o,this.m22=r,this.m23=h,this.m24=e,this.m31=a,this.m32=m,this.m33=u,this.m34=l,this.m41=c,this.m42=f,this.m43=p,this.m44=d}return t.prototype.transpond=function(){return new t(this.m11,this.m21,this.m31,this.m41,this.m12,this.m22,this.m32,this.m42,this.m13,this.m23,this.m33,this.m43,this.m14,this.m24,this.m34,this.m44)},t.prototype.xVector=function(t){return new Vector3(this.m11*t.x+this.m12*t.y+this.m13*t.z,this.m21*t.x+this.m22*t.y+this.m23*t.z,this.m31*t.x+this.m32*t.y+this.m33*t.z)},t.prototype.xPoint=function(t){return new Point3(this.m11*t.x+this.m12*t.y+this.m13*t.z+this.m14,this.m21*t.x+this.m22*t.y+this.m23*t.z+this.m24,this.m31*t.x+this.m32*t.y+this.m33*t.z+this.m34)},t.prototype.xMat=function(i){return new t(this.m11*i.m11+this.m12*i.m21+this.m13*i.m31+this.m14*i.m41,this.m11*i.m12+this.m12*i.m22+this.m13*i.m32+this.m14*i.m42,this.m11*i.m13+this.m12*i.m23+this.m13*i.m33+this.m14*i.m43,this.m11*i.m14+this.m12*i.m24+this.m13*i.m34+this.m14*i.m44,this.m21*i.m11+this.m22*i.m21+this.m23*i.m31+this.m24*i.m41,this.m21*i.m12+this.m22*i.m22+this.m23*i.m32+this.m24*i.m42,this.m21*i.m13+this.m22*i.m23+this.m23*i.m33+this.m24*i.m43,this.m21*i.m14+this.m22*i.m24+this.m23*i.m34+this.m24*i.m44,this.m31*i.m11+this.m32*i.m21+this.m33*i.m31+this.m34*i.m41,this.m31*i.m12+this.m32*i.m22+this.m33*i.m32+this.m34*i.m42,this.m31*i.m13+this.m32*i.m23+this.m33*i.m33+this.m34*i.m43,this.m31*i.m14+this.m32*i.m24+this.m33*i.m34+this.m34*i.m44,this.m41*i.m11+this.m42*i.m21+this.m43*i.m31+this.m44*i.m41,this.m41*i.m12+this.m42*i.m22+this.m43*i.m32+this.m44*i.m42,this.m41*i.m13+this.m42*i.m23+this.m43*i.m33+this.m44*i.m43,this.m41*i.m14+this.m42*i.m24+this.m43*i.m34+this.m44*i.m44)},t}(),n=function(t){var i,n,s;return i=u(t.e),n=c(t.g),s=c(t.t),t.angle?new PerspectiveCamera(i,n,s,parseFloat(t.angle)):new OrthographicCamera(i,n,s,parseFloat(t.s))},f=function(t){return new World(s(t.backgroundColor),m(t.elements),o(t.lights),s(t.ambient),parseFloat(t.indexOfRefraction))},m=function(t){var i,n,s,o;for(o=[],n=0,s=t.length;s>n;n++)i=t[n],o.push(a(i));return o},a=function(t){return t.a&&t.n?new Plane(h(t.material),u(t.a),e(t.n)):t.lbf?new AxisAlignedBox(h(t.material),u(t.lbf),u(t.run)):t.c&&t.r?new Sphere(h(t.material),u(t.c),parseFloat(t.r)):t.a&&t.b&&t.c?new Triangle(h(t.material),u(t.a),u(t.b),u(t.c)):t.geometries?new Node(l(t.transformation),m(t.geometries)):void 0},l=function(t){return new Transform(r(t.m),r(t.i))},r=function(t){return new Mat4x4(t.m11,t.m12,t.m13,t.m14,t.m21,t.m22,t.m23,t.m24,t.m31,t.m32,t.m33,t.m34,t.m41,t.m42,t.m43,t.m44)},h=function(t){return t.indexOfRefraction?new TransparentMaterial(parseFloat(t.indexOfRefraction)):t.reflection?new ReflectiveMaterial(s(t.diffuse),s(t.specular),parseFloat(t.exponent),s(t.reflection)):t.diffuse?new PhongMaterial(s(t.diffuse),s(t.specular),parseFloat(t.exponent)):t.singleColorIndicator?new SingleColorMaterial(s(t.color)):new LambertMaterial(s(t.color))},s=function(t){return new Color(parseFloat(t.r),parseFloat(t.g),parseFloat(t.b))},u=function(t){return new Point3(parseFloat(t.x),parseFloat(t.y),parseFloat(t.z))},c=function(t){return new Vector3(parseFloat(t.x),parseFloat(t.y),parseFloat(t.z))},e=function(t){return new Normal3(parseFloat(t.x),parseFloat(t.y),parseFloat(t.z))},o=function(t){var i,n,o,r,h,e,a,m;for(h=[],a=0,m=t.length;m>a;a++)o=t[a],i=s(o.color),e=o.castsShadows,r=null,n=null,o.position&&(r=u(o.position)),o.direction&&(n=c(o.direction)),r&&n&&o.halfAngle?h.push(new SpotLight(i,e,r,n,parseFloat(o.halfAngle))):n?h.push(new DirectionalLight(i,e,n)):r&&h.push(new PointLight(i,e,r));return h},t=function(t){var s;return s=JSON.parse(t.data),i(s.startW,s.endW,s.width,s.height,n(s.cam),f(s.world))},self.addEventListener("message",t,!1),i=function(t,i,n,s,o,r){var h,e,a,m,u,l,c;for(e=[],a=new Tracer(r),m=l=t;i>=l;m=l+=1)for(u=c=0;s>=c;u=c+=1)h=a.colorFor(o.rayFor(n,s,m,u)),e[4*(m+(s-u-1)*n)+0]=255*h.r,e[4*(m+(s-u-1)*n)+1]=255*h.g,e[4*(m+(s-u-1)*n)+2]=255*h.b;return self.postMessage({imgData:e})}}).call(this);