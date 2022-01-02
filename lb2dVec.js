//@ts-check
/** 
 * @typedef {Object} Vector
 * @property {{x: number, y:number}} pos position of vector 
 * @property {(x: number, y: number) => void} set set position of vector
 * @property {() => Vector} copy creates copy of vector
 * @property {(n: number) => void} div divides Vector by number n
 * @property {(n: number) => void} mult multiplies Vector by number n
 * @property {() => number} mag returns magnitude (scalar) of vector
 * @property {(v: Vector) => void} add adds Vector v to this vector
 * @property {(v: Vector) => void} sub substract Vector v from this vector
 * @property {(v: Vector) => number} dist returns distance (scalar) to vector v
 * @property {() => void} normalize normalize this vector
 * @property {(max: number) => void} limit limits magnitude of this vector
 * @property {(magnitude: number) => void} setMag set magnitude of this vector
 * @property {(v: Vector) => number} dot creates dotproduct by v and this (scalar)
 * @property {(v: Vector) => number} cross creates crossprodukt by v and this (scalar)
 * @property {() => number} heading returns heading (radian)
 * @property {(base: Vector, n: number) => void} rotate rotates this vector
 * @property {(base: Vector, n: number) => void} rotateMatrix rotates this vector
 * @property {(v: Vector) => number} angleBetween angle between v and this (scalar)
 * @property {() => Vector} perp creates perpendicular vector on this vector
 * 
 * 
*/

/** creates an Vector 
 * @type {(x: number, y: number) => Vector} 
 * */
export function Vector (x, y) {
  
  const pos = {x, y}

  /** @type {(x: number, y: number) => void} */
  function set(x, y) {
    pos.x = x;
    pos.y = y;
  }
  /** @type {() => Vector} */
  function copy() {
    return Vector(pos.x, pos.y);
  }

  /** @type {(n: number) => void} */
  function div(n) {
    pos.x /= n;
    pos.y /= n;
  }

  /** @type {(n: number) => void} */
  function mult(n) {
    pos.x *= n;
    pos.y *= n;
  }

  /** @type {() => number} */
  function magSq() {
    return pos.x * pos.x + pos.y * pos.y;
  }

  /** @type {() => number} */
  function mag() {
    return Math.sqrt(magSq());
  }

  /** @type {(v: Vector) => void} */
  function add(v) {
    pos.x += v.pos.x;
    pos.y += v.pos.y;
  }

  /** @type {(v: Vector) => void} */
  function sub(v) {
    pos.x -= v.pos.x;
    pos.y -= v.pos.y;
  }

  /** @type {(v: Vector) => number} */
  function dist(v) {
    const vdist = copy();
    vdist.sub(v);
    return vdist.mag();
  }

  /** @type {(v: Vector) => void} */
  function normalize() {
    const len = mag();
    if (len != 0) {
      div(len);
    }
  }

  /** @type {(n: number) => void} */
  function limit(max) {
    const mSq = magSq();
    if (mSq > max * max) {
      setMag(max);
    }
  }
  
  /** @type {(magnitude: number) => void} */
  function setMag(magnitude) {
    normalize();
    mult(magnitude);
  }
  
  /** @type {(v: Vector) => number} */
  function dot(v) {
    return pos.x * v.pos.x + pos.y * v.pos.y;
  }
  
  /** @type {(v: Vector) => number} */
  function cross(v) {
    return pos.x * v.pos.y - pos.y * v.pos.x;
  }

  /** @type {() => number} */
  function heading() {
    const h = Math.atan2(pos.y, pos.x);
    return h;
  }
  
  /** @type {(base: Vector, n: number) => void} */
  function rotate(base, n) {
    const direction = copy();
    direction.sub(base);
    const newHeading = direction.heading() + n;
    const magnitude = direction.mag();
    pos.x = base.pos.x + Math.cos(newHeading) * magnitude;
    pos.y = base.pos.y + Math.sin(newHeading) * magnitude;
  }
  
  /** @type {(base: Vector, n: number) => void} */
  function rotateMatrix(base, n) {
    const direction = copy();
    direction.sub(base);
    const x = direction.pos.x * Math.cos(n) - direction.pos.y * Math.sin(n);
    const y = direction.pos.x * Math.sin(n) + direction.pos.y * Math.cos(n);
    pos.x = x + base.pos.x;
    pos.y = y + base.pos.y;
  }

  /** @type {(v: Vector) => number} */
  function angleBetween(v) {
    const dotmagmag = dot(v) / (mag() * v.mag());
    const angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
    return angle;
  }

  /** @type {() => Vector} */
  function perp() {
    return Vector(-pos.y, pos.x);
  }
  
  // public
  return {
    // internal properties to become public
    pos: pos,
    set: set,
    copy: copy,
    div: div,
    mult: mult,
    mag: mag,
    add: add,
    sub: sub,
    dist: dist,
    normalize: normalize,
    limit: limit,
    setMag: setMag,
    dot: dot,
    cross: cross,
    heading: heading,
    rotate: rotate,
    rotateMatrix: rotateMatrix,
    angleBetween: angleBetween,
    perp: perp
  }
}

/** creates an Random Vector 
 * @type {() => Vector} */
 export function VectorRandom2D() {
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  return Vector(x, y);
}

/** creates Vector with angle
 * @type {(angle: number, len: number) => Vector}
 * @param angle angle measured in radians
 * @param len len of Vector */
 export function fromAngle(angle, len) {
  const x = len * Math.cos(angle);
  const y = len * Math.sin(angle);
  return Vector(x, y);
}

/** adds v2 to v1 an creates new Vector
 * @type {(v1: Vector, v2: Vector)=> Vector} */
 export function addVector(v1, v2) {
  return Vector(v1.pos.x + v2.pos.x, v1.pos.y + v2.pos.y);
}

/** substract v2 from v1 and create new Vector
 * @type {(v1: Vector, v2: Vector)=> Vector} */
 export function subVector(v1, v2) {
  return Vector(v1.pos.x - v2.pos.x, v1.pos.y - v2.pos.y);
}

/** multiply vector with scalar
 * @type {(v: Vector, n: number)=> Vector} */
 export function multVector(v, n) {
  const vmult = v.copy();
  vmult.mult(n);
  return vmult;
}

/** divide vector by scalar n
 * @type {(v: Vector, n: number)=> Vector} */
 export function divVector(v, n) {
  const vdiv = v.copy();
  vdiv.div(n);
  return vdiv;
}

/** dot product of v1 and v2
 * @type {(v1: Vector, v2: Vector) => number} */
 export function dotProduct(v1, v2) {
  return v1.dot(v2);
}

/** cross product of v1 and v2
 * @type {(v1: Vector, v2: Vector) => number} */
export function crossProduct(v1, v2) {
  return v1.cross(v2);
}

/** Returns Point of intersection between 
 * line a(a0-a1) and line b(b0-b1)
 * @type {(a0: Vector, a1: Vector, b0: Vector, b1: Vector) => Vector} */
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

/** Mindistance between point p and line a(a0-a1)
 * @type {(p: Vector, a0: Vector, a1: Vector) => number} */
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


