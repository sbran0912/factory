class Vector {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  set(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @returns {Vector}
   */
  copy() {
    return new Vector(this.x, this.y);
  }

  /**
   * @param {Vector} v
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  /** substract Vector v from this
   * @param {Vector} v
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  /** returns magsquare of Vector
   * @returns {number}
   */
  magSq() {
    return this.x * this.x + this.y * this.y;
  }

  /** terurns magnitude of vector
   * @returns {number}
   */
  mag() {
    return Math.sqrt(this.magSq());
  }

  /**
   * @param {Vector} v
   * @returns {number}
   */
  dist(v) {
    const vdist = this.copy();
    vdist.sub(v);
    return vdist.mag();
  }

  /**
   * @param {number} n
   */
  mult(n) {
    this.x *= n;
    this.y *= n;
  }

  /**
   * @param {number} n
   */
  div(n) {
    this.x /= n;
    this.y /= n;
  }

  normalize() {
    const len = this.mag();
    if (len != 0) {
      this.div(len);
    }
  }

  /**
   * @param {number} max
   */
  limit(max) {
    const mSq = this.magSq();
    if (mSq > max * max) {
      this.normalize();
      this.mult(max);
    }
  }

  /**
   * @param {number} magnitude
   */
  setMag(magnitude) {
    this.normalize();
    this.mult(magnitude);
  }

  /**
   * @param {Vector} v
   * @returns {number}
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * @param {Vector} v
   * @returns {number}
   */
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * @returns {number}
   */
  heading() {
    const h = Math.atan2(this.y, this.x);
    return h;
  }

  /**
   * @param {Vector} base
   * @param {number} n
   */
  rotate(base, n) {
    const direction = this.copy();
    direction.sub(base);
    const newHeading = direction.heading() + n;
    const magnitude = direction.mag();
    this.x = base.x + Math.cos(newHeading) * magnitude;
    this.y = base.y + Math.sin(newHeading) * magnitude;
  }

  /**
   * @param {Vector} base
   * @param {number} n
   */
  rotateMatrix(base, n) {
    const direction = this.copy();
    direction.sub(base);
    const x = direction.x * Math.cos(n) - direction.y * Math.sin(n);
    const y = direction.x * Math.sin(n) + direction.y * Math.cos(n);
    this.x = x + base.x;
    this.y = y + base.y;
  }

  /**
   * @param {Vector} v
   * @returns {number}
   */
  angleBetween(v) {
    const dotmagmag = this.dot(v) / (this.mag() * v.mag());
    const angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
    return angle;
  }

  /**
   * Creates Perpendicular Vector
   * @returns {Vector} v
   */
  perp() {
    return new Vector(-this.y, this.x);
  }
}

/** creates an vector
 * @param {number} x
 * @param {number} y
 * @returns {Vector}
 */
export function createVectorClass(x, y) {
  return new Vector(x, y);
}

/** creates Random Vector
 * @returns {Vector}
 */
export function VectorRandom2D() {
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  return new Vector(x, y);
}

/** creates Vector with angle
 * @param {number} angle
 * @param {number} len
 * @returns {Vector}
 */
export function fromAngle(angle, len) {
  const x = len * Math.cos(angle);
  const y = len * Math.sin(angle);
  return new Vector(x, y);
}

/** adds vector v2 to vector v1
 * @param {Vector} v1
 * @param {Vector} v2
 * @returns {Vector}
 */
export function addVector(v1, v2) {
  return new Vector(v1.x + v2.x, v1.y + v2.y);
}

/** substract vector v2 from vector v1
 * @param {Vector} v1
 * @param {Vector} v2
 * @returns {Vector}
 */
export function subVector(v1, v2) {
  return new Vector(v1.x - v2.x, v1.y - v2.y);
}

/** multiply vector with scalar
 * @param {Vector} v
 * @param {number} n
 * @returns {Vector}
 */
export function multVector(v, n) {
  const vmult = v.copy();
  vmult.mult(n);
  return vmult;
}

/** divide vector by scalar n
 * @param {Vector} v
 * @param {number} n
 * @returns {Vector}
 */
export function divVector(v, n) {
  const vdiv = v.copy();
  vdiv.div(n);
  return vdiv;
}

/** dot product of v1 and v2
 * @param {Vector} v1
 * @param {Vector} v2
 * @returns {number}
 */
export function dotVector(v1, v2) {
  return v1.dot(v2);
}

/** cross product of v1 and v2
 * @param {Vector} v1
 * @param {Vector} v2
 * @returns {number}
 */
export function crossVector(v1, v2) {
  return v1.cross(v2);
}

/** Point of intersection between 2 Lines
 * @param {Vector} a0 begin line1
 * @param {Vector} a1 end line1
 * @param {Vector} b0 begin line2
 * @param {Vector} b1 end line2
 * @returns {Vector} p Point of intersection
 */
export function intersect(a0, a1, b0, b1) {
  let p;
  const a = subVector(a1, a0);
  const b = subVector(b1, b0);
  const den1 = a.cross(b);
  const den2 = b.cross(a);

  if (den1 != 0) {
    const s = subVector(b0, a0).cross(b) / den1;
    const u = subVector(a0, b0).cross(a) / den2;
    if (s > 0 && s < 1 && u > 0 && u < 1) {
      p = addVector(a0, multVector(a, s));
    }
  }

  return p;
}

/** Mindistance between point p and line a
 * @param {Vector} p point
 * @param {Vector} a0 begin line
 * @param {Vector} a1 end line
 * @returns {Number} dist
 */
export function minDist(p, a0, a1) {
  let dist;

  //Vektor line a0 to a1
  const a0a1 = subVector(a1, a0);
  //Vektor imaginary line a0 to p
  const a0p = subVector(p, a0);
  //Magnitude of line a0 to a1
  const magnitude = a0a1.mag();

  //Scalarprojecton from line a0p to line a0a1
  a0a1.normalize();
  const sp = a0a1.dot(a0p);

  //Scalarprojection in magnitude of line a0a1?
  if (sp > 0 && sp <= magnitude) {
    a0a1.mult(sp);
    dist = subVector(a0p, a0a1).mag();
  }
  return dist;
}
