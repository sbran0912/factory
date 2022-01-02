//@ts-check
import * as lb2d from './lb2d.js';

/** @type {lb2d.Vector} */
const v0 = lb2d.Vector(20, 20);

const v1 = lb2d.Vector(0,100);
const v2 = v1.copy();
const v3 = v1.copy();

v2.set(100,100);

console.log(v1.pos); console.log(v2.pos);console.log(v3.pos);
console.log('v1-v2:', v1.dist(v2));
console.log('v2-v3:', v2.dist(v3));
console.log('v1-v3:', v1.dist(v3));
