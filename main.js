import * as lb2d from './lib2d.js';
import * as phys from './physics.js';

const balls = [];
const boxes = [];
const arrow = {
    index: null,
    base: lb2d.createVector(0, 0)
}


function start() {
    lb2d.init( 800, 500);
    for (let i = 0; i < 4; i++) {
        balls.push(phys.createBall(lb2d.random(0, 700), lb2d.random(0, 400), lb2d.random(10, 40)));
    }    
    
    for (let i = 0; i < 4; i++) {
        boxes.push(phys.createBox(lb2d.random(0, 700), lb2d.random(0, 400), lb2d.random(40, 100), lb2d.random(40, 100)));
    }

    // 4 Boxen als Umrandung
    boxes.push(phys.createBox(0, 0, 800, 1));
    boxes[4].mass = Infinity; boxes[4].inertia = Infinity;
    boxes.push(phys.createBox(0, 0, 1, 499));
    boxes[5].mass = Infinity; boxes[5].inertia = Infinity;
    boxes.push(phys.createBox(0, 499, 800, 1));
    boxes[6].mass = Infinity; boxes[6].inertia = Infinity;
    boxes.push(phys.createBox(799, 0, 1, 499));
    boxes[7].mass = Infinity; boxes[7].inertia = Infinity;

    lb2d.startAnimation(draw);    
}

function draw() {
    lb2d.background(235);
   
    for (let i = 0; i < balls.length; i++) {
        for (let j = i+1; j < balls.length; j++) {
            phys.detectCollisionBalls(balls[i], balls[j]);
        }
        for (let k = 0; k < boxes.length; k++) {
            phys.detectCollisionBallBoxes(balls[i], boxes[k]);
        }
    }
    
    for (let i = 0; i < boxes.length-1; i++) {
        for (let j = i+1; j < boxes.length; j++) {
            phys.detectCollisionBoxes(boxes[i], boxes[j]);
        }
    }
    
    balls.forEach((element)=> {
        element.applyFriction();
        element.update();
        element.display();
    })
    
    boxes.forEach((element)=> {
        if (element.mass != Infinity && element.inertia != Infinity) {
            element.applyFriction();
            element.update();
        }
        element.display();
    })

    if (lb2d.isMouseDown() && arrow.index == null) {
        balls.forEach((element, index) => {
            if (element.location.dist(lb2d.createVector(lb2d.mouseX, lb2d.mouseY)) < element.mass) {
              arrow.base.set(element.location.x, element.location.y);
              arrow.index = index;
            }
        })    
    }

    if (lb2d.isMouseDown() && arrow.index != null) {
        lb2d.drawArrow(arrow.base, lb2d.createVector(lb2d.mouseX, lb2d.mouseY), 100);
    }  

    if (lb2d.isMouseUp() && arrow.index != null) {
        balls[arrow.index].kicking();
        arrow.index = null;
      }
  
}

start();