//@ts-check

// Bibliothek lb2d
// von Stefan Brandner, inspiriert (und abgekupfert) von P5

// Instanzvariablen des Moduls
const canv = document.querySelector("canvas");
const output = document.querySelector("#output");
const ctx = canv.getContext("2d");
export let mouseX = 0;
export let mouseY = 0;
let mouseStatus = 0;
let loop = true;

/** Init canvas
 * @type {(w: number, h: number) => void}
 * @param w width of canvas
 * @param h height of canvas */
export function init(w, h) {
  canv.width = w;
  canv.height = h;
  ctx.strokeStyle = "white";
  ctx.fillStyle = "grey";
  ctx.lineWidth = 1;
  ctx.save();
  canv.addEventListener("mousemove", updMousePos);
  canv.addEventListener("mousedown", setMouseDown);
  canv.addEventListener("mouseup", setMouseUp);
  canv.addEventListener("touchmove", updTouchPos);
  canv.addEventListener("touchstart", setTouchDown);
  canv.addEventListener("touchend", setTouchUp);
}

/** Starts Animation Loop
 * @type {(fnDraw: function) => void}
 * @param fnDraw Callback Function */
export function startAnimation(fnDraw) {
  let draw = fnDraw;
  loop = true;
  let animate = () => {
    draw();
    if (loop) {
      window.requestAnimationFrame(animate);
    }
  };
  window.requestAnimationFrame(animate);
}

/** get width of canvas 
 * @type {() => number} */
export function getWidth() {
  return canv.width;
}

/** get height of canvas 
 * @type {() => number} */
export function getHeight() {
  return canv.height;
}

/** stop looping */
export function noLoop() {
  loop = false;
}

/** update mouse position
 * @type {(e: MouseEvent) => void}  */
function updMousePos(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
}

/** update status down position */
function setMouseDown() {
  mouseStatus = 1;
}

/** update status up position */
function setMouseUp() {
  mouseStatus = 2;
}

/** update touch position
 * @type {(e: TouchEvent) => void} */
function updTouchPos(e) {
  e.preventDefault();
  //@ts-ignore
  mouseX = e.targetTouches[0].pageX - e.target.getBoundingClientRect().left;
  //@ts-ignore
  mouseY = e.targetTouches[0].pageY - e.target.getBoundingClientRect().top;
}

/** update status down position
 * @type {(e: TouchEvent) => void} */
function setTouchDown(e) {
  mouseStatus = 1;
  updTouchPos(e);
}

/** update status up position */
export function setTouchUp() {
  mouseStatus = 2;
}

/** returns true when down position 
 * @type {() => boolean} */
export function isMouseDown() {
  if (mouseStatus == 1) {
    return true;
  } else {
    return false;
  }
}

/** returns true when up position 
 * @type {() => boolean} */
export function isMouseUp() {
  if (mouseStatus == 2) {
    mouseStatus = 0;
    return true;
  } else {
    return false;
  }
}

/** creates Paragraph-Element on html
 * @type {(item: string) => void} */
export function createP(item) {
  const newItem = document.createElement("p");
  newItem.textContent = item;
  output.appendChild(newItem);
}

/** saves the current drawing state. Use together with pop */
export function push() {
  ctx.save();
}

/** restores drawing state. Use together with push */
export function pop() {
  ctx.restore();
}

/** Transformation to current matrix 
 * @type {(x: number, y: number) => void} */
export function translate(x, y) {
  ctx.translate(x, y);
}
/** rotates drawing context in degrees
 * @param {number} n degrees */
export function rotate(n) {
  ctx.rotate(n);
}

/** Fillcolor of shape
 * @param  {...number} color r (0..255), g (0...255), b (0...255)
 */
export function fillColor(...color) {
  let r;
  let g;
  let b;
  if (color.length == 1) {
    r = color[0];
    g = color[0];
    b = color[0];
  } else {
    r = color[0] || 0;
    g = color[1] || 0;
    b = color[2] || 0;
  }

  ctx.fillStyle = `RGB(${r},${g},${b})`;
}

/** Stroke Gradiant 
 * @param {number} color 0...255
 * @param {number} x 
 * @param {number} y 
 * @param {number} max  */
export function strokeGrd(color, x, y, max) {
  const grd = ctx.createRadialGradient(x, y, 5, x, y, max);
  grd.addColorStop(0, `RGB(${color},${color},${color})`);
  grd.addColorStop(1, `RGB(${0},${0},${0})`);
  ctx.strokeStyle = grd;
}

/** Strokecolor of shape
 * @param  {...number} color r (0..255), g (0...255), b (0...255)  */
export function strokeColor(...color) {
  let r;
  let g;
  let b;
  if (color.length == 1) {
    r = color[0];
    g = color[0];
    b = color[0];
  } else {
    r = color[0] || 0;
    g = color[1] || 0;
    b = color[2] || 0;
  }

  ctx.strokeStyle = `RGB(${r},${g},${b})`;
}

/** strokewidth of line
 * @param {number} w width  */
export function strokeWidth(w) {
  ctx.lineWidth = w;
}

/** background color of drawing context
 * @param  {...number} color r (0..255), g (0...255), b (0...255)  */
export function background(...color) {
  let r;
  let g;
  let b;
  if (color.length == 1) {
    r = color[0];
    g = color[0];
    b = color[0];
  } else {
    r = color[0] || 0;
    g = color[1] || 0;
    b = color[2] || 0;
  }

  push();
  ctx.fillStyle = `RGB(${r},${g},${b})`;
  ctx.fillRect(0, 0, canv.width, canv.height);
  pop();
}

/** drawing rectangle with start position
 * @param {number} x position-x 
 * @param {number} y position-y
 * @param {number} w width
 * @param {number} h height
 * @param {number} style 0, 1 or 2 */
export function rect(x, y, w, h, style = 0) {
  if (style == 0) {
    ctx.strokeRect(x, y, w, h);
  }
  if (style == 1) {
    ctx.fillRect(x, y, w, h);
  }
  if (style == 2) {
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x, y, w, h);
  }
}

/** drawing line
 * @param {number} x1 point 1
 * @param {number} y1 point 1
 * @param {number} x2 point 2
 * @param {number} y2 point 2 */
export function line(x1, y1, x2, y2) {
  const path = new Path2D();
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  path.closePath();
  ctx.stroke(path);
}
/** drawing triangle
 * @param {number} x1 point 1
 * @param {number} y1 point 1
 * @param {number} x2 point 2
 * @param {number} y2 point 2
 * @param {number} x3 point 3
 * @param {number} y3 point 3
 * @param {number} style 0, 1 or 2 */
export function triangle(x1, y1, x2, y2, x3, y3, style = 0) {
  const path = new Path2D();
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  path.lineTo(x3, y3);
  path.closePath();
  if (style == 0) {
    ctx.stroke(path);
  }
  if (style == 1) {
    ctx.fill(path);
  }
  if (style == 2) {
    ctx.stroke(path);
    ctx.fill(path);
  }
}

/** drawing shape with 4 points
 * @param {number} x1 point 1
 * @param {number} y1 point 1
 * @param {number} x2 point 2
 * @param {number} y2 point 2
 * @param {number} x3 point 3
 * @param {number} y3 point 3
 * @param {number} x4 point 4
 * @param {number} y4 point 4
 * @param {number} style 0, 1 or 2 */
export function shape(x1, y1, x2, y2, x3, y3, x4, y4, style = 0) {
  const path = new Path2D();
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  path.lineTo(x3, y3);
  path.lineTo(x4, y4);
  path.closePath();
  if (style == 0) {
    ctx.stroke(path);
  }
  if (style == 1) {
    ctx.fill(path);
  }
  if (style == 2) {
    ctx.stroke(path);
    ctx.fill(path);
  }
}

/**
 * 
 * @param {number} x position-x
 * @param {number} y position-y
 * @param {number} radius 
 * @param {number} style 0, 1 or 2 */
export function circle(x, y, radius, style = 0) {
  const path = new Path2D();
  path.arc(x, y, radius, 0, 2 * Math.PI);
  path.closePath();
  if (style == 0) {
    ctx.stroke(path);
  }
  if (style == 1) {
    ctx.fill(path);
  }
  if (style == 2) {
    ctx.stroke(path);
    ctx.fill(path);
  }
}

/** Draw an arrow 
 * @type {(v_base: Vector, v_target: Vector, myColor: number) => void} */
 export function drawArrow(v_base, v_target, myColor) {
  const v_heading = subVector(v_target, v_base);
  push();
  strokeColor(myColor);
  strokeWidth(3);
  fillColor(myColor);
  translate(v_base.pos.x, v_base.pos.y);
  line(0, 0, v_heading.pos.x, v_heading.pos.y);
  rotate(v_heading.heading());
  let arrowSize = 7;
  translate(v_heading.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

/** Interface Perlin
 * @typedef {Object} Perlin
 * @property {(x: number, y?: number, z?: number) => number} noise returns perlin noise value (between 0 and 1)
 * @property {(lod: number, falloff: number) => void} noiseDetail 
 * @property {(seed: number) => void} noiseSeed
*/

/** returns perlin object
 * @type {() => Perlin} */
export function perlinNoise() {
  const PERLIN_YWRAPB = 4;
  const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
  const PERLIN_ZWRAPB = 8;
  const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
  const PERLIN_SIZE = 4095;

  let perlin_octaves = 4; // default to medium smooth
  let perlin_amp_falloff = 0.5; // 50% reduction/octave

  const scaled_cosine = (i) => 0.5 * (1.0 - Math.cos(i * Math.PI));

  let perlin; // will be initialized lazily by noise() or noiseSeed()

  /** @method noise
   * @param  {Number} x   x-coordinate in noise space
   * @param  {Number} [y] y-coordinate in noise space
   * @param  {Number} [z] z-coordinate in noise space
   * @return {Number}     Perlin noise value (between 0 and 1) at specified coordinates */
  const noise = function (x, y = 0, z = 0) {
    if (perlin == null) {
      perlin = new Array(PERLIN_SIZE + 1);
      for (let i = 0; i < PERLIN_SIZE + 1; i++) {
        perlin[i] = Math.random();
      }
    }

    if (x < 0) {
      x = -x;
    }
    if (y < 0) {
      y = -y;
    }
    if (z < 0) {
      z = -z;
    }

    let xi = Math.floor(x),
      yi = Math.floor(y),
      zi = Math.floor(z);
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;
    let rxf, ryf;

    let r = 0;
    let ampl = 0.5;

    let n1, n2, n3;

    for (let o = 0; o < perlin_octaves; o++) {
      let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

      rxf = scaled_cosine(xf);
      ryf = scaled_cosine(yf);

      n1 = perlin[of & PERLIN_SIZE];
      n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
      n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
      n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
      n1 += ryf * (n2 - n1);

      of += PERLIN_ZWRAP;
      n2 = perlin[of & PERLIN_SIZE];
      n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
      n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
      n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);

      n1 += scaled_cosine(zf) * (n2 - n1);

      r += n1 * ampl;
      ampl *= perlin_amp_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;

      if (xf >= 1.0) {
        xi++;
        xf--;
      }
      if (yf >= 1.0) {
        yi++;
        yf--;
      }
      if (zf >= 1.0) {
        zi++;
        zf--;
      }
    }
    return r;
  };

  /** @method noiseDetail
   * @param {Number} lod number of octaves to be used by the noise
   * @param {Number} falloff falloff factor for each octave */
  const noiseDetail = function (lod, falloff) {
    if (lod > 0) {
      perlin_octaves = lod;
    }
    if (falloff > 0) {
      perlin_amp_falloff = falloff;
    }
  };

  /** @method noiseSeed
   * @param {Number} seed   the seed value */
  const noiseSeed = function (seed) {
    // Linear Congruential Generator
    // Variant of a Lehman Generator
    const lcg = (() => {
      // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
      // m is basically chosen to be large (as it is the max period)
      // and for its relationships to a and c
      const m = 4294967296;
      // a - 1 should be divisible by m's prime factors
      const a = 1664525;
      // c and m should be co-prime
      const c = 1013904223;
      let seed, z;
      return {
        setSeed(val) {
          // pick a random seed if val is undefined or null
          // the >>> 0 casts the seed to an unsigned 32-bit integer
          z = seed = (val == null ? Math.random() * m : val) >>> 0;
        },
        getSeed() {
          return seed;
        },
        rand() {
          // define the recurrence relationship
          z = (a * z + c) % m;
          // return a float in [0, 1)
          // if z = m then z / m = 0 therefore (z % m) / m < 1 always
          return z / m;
        }
      };
    })();

    lcg.setSeed(seed);
    perlin = new Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = lcg.rand();
    }
  };

  return {
    noise: noise,
    noiseDetail: noiseDetail,
    noiseSeed: noiseSeed
  };
}

/** randomgenerator between n1 and n2
 * @param {number} n1 
 * @param {number} n2 
 * @returns {number} */
export function random(n1, n2) {
  return Math.floor(Math.random() * (n2 - n1) + n1);
}

/** limits value between min and max
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} */
export function constrain(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** scales value n to a new range
 * @param {number} n number to scale
 * @param {number} start1 old range
 * @param {number} stop1 old range
 * @param {number} start2 new range
 * @param {number} stop2 new range
 * @returns {number}
 */
export function map(n, start1, stop1, start2, stop2) {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
}

/** Limits number 
 * @param {number} number 
 * @param {number} limit 
 * @returns {number} */
export function limitNum(number, limit) {
  const vorzeichen = number < 0 ? -1 : 1;
  let numberMag = Math.abs(number);
  if (numberMag > limit) {
    numberMag = limit;
  }
  return numberMag * vorzeichen;
}

///////////////////////////////////////////////
//     Ab hier Implementierung für Vector !!!
///////////////////////////////////////////////

/** Interface Vector
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