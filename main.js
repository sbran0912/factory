//@ts-check
import * as lb2dVec from './lb2dVec.js';

/** @type {lb2dVec.Vector} */
const v0 = lb2dVec.fromAngle(150, 10);

const v1 = lb2dVec.Vector(0,100);
const v2 = v1.copy();
const v3 = v1.copy();
const n = lb2dVec.crossProduct(v1, v2);
const v4 = lb2dVec.fromAngle(2.5,100);

v2.set(100,100);

console.log(v1.pos); console.log(v2.pos);console.log(v3.pos);
console.log('v1-v2:', v1.dist(v2));
console.log('v2-v3:', v2.dist(v3));
console.log('v1-v3:', v1.dist(v3));
