//@ts-check
/** 
 * @typedef {Object} Vector
 * @property {{x: number, y:number}} pos position of vector 
 * @property {(x: number, y: number) => void} set set position of vector
 * @property {() => Vector} copy creates copy off vector
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
 * @property {(v: Vector) => number} cross creates dotproduct by v and this (scalar)
 * @property {() => number} heading returns heading (radian)
 * @property {(base: Vector, n: number) => void} rotate rotates this vector
 * @property {(base: Vector, n: number) => void} rotateMatrix rotates this vector
 * @property {(v: Vector) => number} angleBetween angle between v and this (scalar)
 * @property {() => Vector} perp creates perpendicular vector on this vector
 * 
 * 
*/

/**  @type {(x: number, y: number) => Vector} */
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