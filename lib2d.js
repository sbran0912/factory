/** 
 * @typedef {Object} Vector
 * @property {{x: number, y:number}} pos position of vector 
 * @property {(x: number, y: number) => void} set set position of vector
 * @property {(n: number) => void} mult multiplies Vector by number n
 * @property {() => Vector} copy creates copy fo vector
 * @property {() => number} magsquare returns magsquare of Vector
 * @property {() => number} mag returns magnitude of vector
 * 
*/

/** creates an new Vector
   * @param {number} x
   * @param {number} y
   * @returns {Vector}
   */
export function Vector (x, y) {
  
  const pos = {x, y}

  function copy() {
    return Vector(pos.x, pos.y);
  }

  function magSq() {
    return pos.x * pos.x + pos.y * pos.y;
  }

  /** divides Vector by number
   * @param {number} n
   */
  function div(n) {
    pos.x /= n;
    pos.y /= n;
  }

  function mult(n) {
    pos.x *= n;
    pos.y *= n;
  }

  function mag() {
    return Math.sqrt(magSq());
  }

  function set(x, y) {
  pos.x = x;
  pos.y = y;
  }

  /** adds Vector v to this vector
   * @param v Vector
   */
  function add(v) {
    pos.x += v.pos.x;
    pos.y += v.pos.y;
  }

  /** substract Vector v from this vector
  * @param v Vector
  */
  function sub(v) {
    pos.x -= v.pos.x;
    pos.y -= v.pos.y;
  }

  /** returns distance to vector v
   * @param {Vector} v
   * @returns {number}
   */
  function dist(v) {
    const vdist = copy();
    vdist.sub(v);
    //
    // testcode
    //
    return vdist.mag();
  }

  /** normalize this vector
   */
  function normalize() {
    const len = mag();
    if (len != 0) {
      div(len);
    }
  }

  /** limits magnitude of this vector
   * @param {number} max
   */
  function limit(max) {
    const mSq = magSq();
    if (mSq > max * max) {
      normalize();
      mult(max);
    }
  }
  
  /** set magnitude of this vector
   * @param {number} magnitude
   */
  function setMag(magnitude) {
    normalize();
    mult(magnitude);
  }
  
  /** creates dotproduct (scalar)
     * @param {Vector} v
     * @returns {number}
     */
  function dot(v) {
    return pos.x * v.x + pos.y * v.y;
  }
  
  /** creates crossprodukt-2D (scalar)
   * @param {Vector} v
   * @returns {number}
   */
  function cross(v) {
    return pos.x * v.y - pos.y * v.x;
  }

  /** returns heading (radian)
   * @returns {number}
   */
  function heading() {
    const h = Math.atan2(pos.y, pos.x);
    return h;
  }
  
  /** rotates this vector
   * @param {Vector} base
   * @param {number} n
   */
  function rotate(base, n) {
    const direction = copy();
    direction.sub(base);
    const newHeading = direction.heading() + n;
    const magnitude = direction.mag();
    pos.x = base.pos.x + Math.cos(newHeading) * magnitude;
    pos.y = base.pos.y + Math.sin(newHeading) * magnitude;
  }
  
  /** rotates this vector
   * @param {Vector} base
   * @param {number} n
   */
  function rotateMatrix(base, n) {
    const direction = copy();
    direction.sub(base);
    const x = direction.x * Math.cos(n) - direction.y * Math.sin(n);
    const y = direction.x * Math.sin(n) + direction.y * Math.cos(n);
    pos.x = x + base.x;
    pos.y = y + base.y;
  }

  /**
   * @param {Vector} v
   * @returns {number}
   */
  function angleBetween(v) {
    const dotmagmag = dot(v) / (mag() * v.mag());
    const angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
    return angle;
  }

  /**
   * Creates Perpendicular Vector
   * @returns {Vector} v
   */
  function perp() {
    return Vector(-pos.y, pos.x);
  }

  
  
  // public
  return {
    // internal properties to become public
    pos: pos,
    copy: copy,
    div: div,
    mult: mult,
    mag: mag,
    set: set,
    add: add,
    sub: sub,
    dist: dist,
    normalize: normalize,
    dot: dot,
    cross: cross,
    heading: heading,
    rotate: rotate,
    rotateMatrix: rotateMatrix,
    angleBetween: angleBetween
  }
}