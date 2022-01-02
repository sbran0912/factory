import * as lb2d from './lib2d.js';

class Box {
    /**
     * @param {number} posx
     * @param {number} posy
     * @param {number} w
     * @param {number} h
     */
    constructor(posx, posy, w, h) {
        this.vertices = new Array(5);
        this.vertices[0] = lb2d.createVector(posx, posy);
        this.vertices[1] = lb2d.createVector(posx + w, posy);
        this.vertices[2] = lb2d.createVector(posx + w, posy + h);
        this.vertices[3] = lb2d.createVector(posx, posy + h);
        this.vertices[4] = this.vertices[0];
        this.location = lb2d.createVector(posx + w / 2, posy + h / 2);
        this.velocity = lb2d.createVector(0, 0);
        this.angVelocity = 0;
        this.mass = w + h;
        this.inertia = w * h * w;
        this.coefficient = 0.001;
    }

    /** Rotates Box by angle
     * @param {number} angle
     */
    rotate(angle) {
        for (let i = 0; i < 4; i++) {
            this.vertices[i].rotateMatrix(this.location, angle);
        }
    }
    
    /** Update the position of the Box */
    update() {
        this.location.add(this.velocity);
        this.vertices[0].add(this.velocity);
        this.vertices[1].add(this.velocity);
        this.vertices[2].add(this.velocity);
        this.vertices[3].add(this.velocity);
        this.rotate(this.angVelocity);
    }
    
    /** Reset the position of then Box
     * @param {Vector} v
     */
    resetPos(v) {
        this.location.add(v);
        this.vertices[0].add(v);
        this.vertices[1].add(v);
        this.vertices[2].add(v);
        this.vertices[3].add(v);
    }

    display() {
        lb2d.strokeColor(1, 109, 143);
        lb2d.strokeWidth(2);
        lb2d.rectangle(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y, this.vertices[3].x, this.vertices[3].y, 0);
        lb2d.circle(this.location.x, this.location.y, 2, 0);
    }

    applyForce(force, AngForce) {
        const acceleration = lb2d.divVector(force, this.mass);
        this.velocity.add(acceleration);

        const angAcceleration = AngForce / this.mass; 
        this.angVelocity += angAcceleration;
    }

    applyFriction() {
        const frictVelocity = this.velocity.copy();
        frictVelocity.normalize();
        frictVelocity.mult(this.coefficient * -1); // in Gegenrichtung
        frictVelocity.limit(this.velocity.mag());
        this.velocity.add(frictVelocity);

        const frictAngDirection = this.angVelocity < 0 ? 1 : -1; // in Gegenrichtung
        const frictAngVelocity = lb2d.limitNum(this.coefficient * 0.05 * frictAngDirection, Math.abs(this.angVelocity));
        this.angVelocity += frictAngVelocity;
    }
}

class Ball {
    /**
     * 
     * @param {number} posx 
     * @param {number} posy 
     * @param {number} radius 
     */
    constructor(posx, posy, radius) {
        this.location = lb2d.createVector(posx, posy);
        this.velocity = lb2d.createVector(0, 0);
        this.angVelocity = 0;
        this.radius = radius;
        this.mass = radius;
        this.inertia = radius * radius * radius/2;
        this.orientation = lb2d.createVector(radius, 0);
        this.orientation.add(this.location);
        this.coefficient = 0.001;
    }
    
    display() {
        lb2d.strokeColor(255, 127, 36);
        lb2d.strokeWidth(2);
        lb2d.circle(this.location.x, this.location.y, this.radius, 0);
        lb2d.line(this.location.x, this.location.y, this.orientation.x, this.orientation.y);
    }

    rotate(angle) {
        this.orientation.rotateMatrix(this.location, angle);
    }

    update() {
        this.location.add(this.velocity);
        this.orientation.add(this.velocity);
        this.rotate(this.angVelocity);
    }

    /**
     * @param {Vector} v
     */
    resetPos(v) {
        this.location.add(v);
        this.orientation.add(v);
    }

    kicking() {
        let mouse = lb2d.createVector(lb2d.mouseX, lb2d.mouseY);
        let direction = lb2d.subVector(mouse, this.location);
        this.applyForce(direction, 0);
    }
    
    applyForce(force, AngForce) {
        const acceleration = lb2d.divVector(force, this.mass);
        this.velocity.add(acceleration);

        const angAcceleration = AngForce / this.mass; 
        this.angVelocity += angAcceleration;
    }

    applyFriction() {
        const frictVelocity = this.velocity.copy();
        frictVelocity.normalize();
        frictVelocity.mult(this.coefficient * -1); // in Gegenrichtung
        frictVelocity.limit(this.velocity.mag());
        this.velocity.add(frictVelocity);

        const frictAngDirection = this.angVelocity < 0 ? 1 : -1; // in Gegenrichtung
        const frictAngVelocity = lb2d.limitNum(this.coefficient * 0.05 * frictAngDirection, Math.abs(this.angVelocity));
        this.angVelocity += frictAngVelocity;
    }
}

/** creates Box
 * @param {number} posx
 * @param {number} posy
 * @param {number} w
 * @param {number} h
 * @returns {Box}
 */
 export function createBox(posx, posy, w, h) {
    return new Box(posx, posy, w, h);
}

/** creates Ball
 * @param {number} posx 
 * @param {number} posy 
 * @param {number} radius 
 */
 export function createBall(posx, posy, radius) {
    return new Ball(posx, posy, radius);
}

/** Ermittelt Kollisionspunkt zweier Boxen
 * @param {Box} a 
 * @param {Box} b 
 */
export function detectCollisionBoxes(a, b) {
    // Geprüft wird, ob eine Ecke von boxA in die Kante von boxB schneidet
    // Zusätzlich muss die Linie von Mittelpunkt A und Mittelpunkt B durch Kante von B gehen
    // Wenn Treffer, dann wird Ergebnis in objekt intersection gespeichert
    // i ist Index von Ecke und j ist Index von Kante
    // d = Diagonale von A.Mittelpunkt zu A(i)
    // e = Kante von B mit Startpunkt B(j)
    // z = Linie von A.Mittelpunkt zu B.Mittelpunkt
    // f = Linie von A.Mittelpunkt zu B(j)
    // _perp = Perpendicularvektor
    // scalar_d und scalar_e = Faktoren von d und e für den Schnittpunkt
    // beide Faktoren müssen >0 und <= 1 sein
    // P = Schnittpunkt von d und e
    // mtv = minimal translation vector (überlappender Teil von d zur Kante e)

    let boxA = a;
    let boxB = b;
    for (let n = 0; n < 2; n++) {
        if (n == 1) {
            boxA = b;
            boxB = a;
        }
        let z = lb2d.subVector(boxB.location, boxA.location);
        let z_perp = lb2d.createVector(-(z.y), z.x);
        for (let i = 0; i < 4; i++) {
            let d = lb2d.subVector(boxA.vertices[i], boxA.location);
            let d_perp = lb2d.createVector(-(d.y), d.x);
            for (let j = 0; j < 4; j++) {
                let e = lb2d.subVector(boxB.vertices[j + 1], boxB.vertices[j]);
                let e_perp = lb2d.createVector(-(e.y), e.x);
                if (lb2d.dotVector(d_perp, e) != 0) {
                    let f = lb2d.subVector(boxB.vertices[j], boxA.location);
                    let scalar_e = -(lb2d.dotVector(d_perp, f)) / lb2d.dotVector(d_perp, e);
                    let scalar_d = (lb2d.dotVector(e_perp, f)) / lb2d.dotVector(e_perp, d);
                    let scalar_e2 = -(lb2d.dotVector(z_perp, f)) / lb2d.dotVector(z_perp, e);
                    if (scalar_e > 0 && scalar_e <= 1 && scalar_d > 0 && scalar_d <= 1 && scalar_e2 > 0 && scalar_e2 < 1) {
                        let P = lb2d.addVector(boxB.vertices[j], lb2d.multVector(e, scalar_e));
                        let mtv = d.copy();
                        mtv.mult(1 - scalar_d);
                        e_perp.normalize();
                        let distance = lb2d.dotVector(e_perp, mtv);
                        let normal_e = lb2d.multVector(e_perp, -distance);
                        boxA.resetPos(lb2d.multVector(normal_e, 0.5));
                        boxB.resetPos(lb2d.multVector(normal_e, -0.5));
                        normal_e.normalize(); // muss für Kollisionsberechnung auf Unitvector gesetzt werden
                        resoveCollisionBoxes(boxA, boxB, boxA.vertices[i], normal_e);
                        return;
                    }
                }
            }
        }
    }
}

/** Berechnet Kollision zweier Boxen
 * @param {Box} boxA
 * @param {Box} boxB
 * @param {Vector} cp Collisionpoint
 * @param {Vector} normal Normalvektor von Kante j
 */
function resoveCollisionBoxes(boxA, boxB, cp, normal) {
    // rAP = Linie von A.location zu Kollisionspunkt (Ecke i von BoxA)
    // rBP = Linie von B.location zu Kollisionspunkt (ebenfalls Ecke i von BoxA)
    const rAP = lb2d.subVector(cp, boxA.location);
    const rBP = lb2d.subVector(cp, boxB.location);
    const rAP_perp = lb2d.createVector(-rAP.y, rAP.x);
    const rBP_perp = lb2d.createVector(-rBP.y, rBP.x);
    const VtanA = lb2d.multVector(rAP_perp, boxA.angVelocity);
    const VtanB = lb2d.multVector(rBP_perp, boxB.angVelocity);
    const VgesamtA = lb2d.addVector(boxA.velocity, VtanA);
    const VgesamtB = lb2d.addVector(boxB.velocity, VtanB);
    const velocity_AB = lb2d.subVector(VgesamtA, VgesamtB);
    
    if (lb2d.dotVector(velocity_AB, normal) < 0) { // wenn negativ, dann auf Kollisionskurs
        const e = 1; //inelastischer Stoß
        const j_denominator = lb2d.dotVector(lb2d.multVector(velocity_AB, -(1+e)), normal);
        const j_divLinear = lb2d.dotVector(normal, lb2d.multVector(normal, (1/boxA.mass + 1/boxB.mass)));
        const j_divAngular = Math.pow(lb2d.dotVector(rAP_perp, normal), 2) / boxA.inertia + Math.pow(lb2d.dotVector(rBP_perp, normal), 2) / boxB.inertia;
        const j = j_denominator / (j_divLinear + j_divAngular);
        // Grundlage für Friction berechnen
        const t = lb2d.createVector(-(normal.y), normal.x);
        const t_scalarprodukt = lb2d.dotVector(velocity_AB, t);
        t.mult(t_scalarprodukt);
        t.normalize();

        boxA.velocity.add(lb2d.addVector(lb2d.multVector(normal, (j/boxA.mass)), lb2d.multVector(t, (0.2*-j/boxA.mass))));
        boxB.velocity.add(lb2d.addVector(lb2d.multVector(normal, (-j/boxB.mass)), lb2d.multVector(t, (0.2*j/boxB.mass))));
        boxA.angVelocity += lb2d.dotVector(rAP_perp, lb2d.addVector(lb2d.multVector(normal, j/boxA.inertia), lb2d.multVector(t, 0.2*-j/boxA.inertia)));
        boxB.angVelocity += lb2d.dotVector(rBP_perp, lb2d.addVector(lb2d.multVector(normal, -j/boxB.inertia), lb2d.multVector(t, 0.2*j/boxB.inertia)));
    }
}    

/** Ermittelt Kollisionspunkt zweier Bälle
 * @param {Ball} ballA 
 * @param {Ball} ballB 
 */
export function detectCollisionBalls(ballA, ballB) {
    //Distanz ermitteln
    let radiusTotal = ballA.radius + ballB.radius;
    let distance = ballA.location.dist(ballB.location);

    if (distance < radiusTotal) {
        //Treffer
        let space = (radiusTotal - distance);
        let collisionLine = lb2d.subVector(ballA.location, ballB.location);
        collisionLine.setMag(space);
        ballA.resetPos(lb2d.multVector(collisionLine, 0.5));
        ballB.resetPos(lb2d.multVector(collisionLine, -0.5));
        collisionLine.normalize();
        resolveCollisionBalls(ballA, ballB, collisionLine);
    }
}

/** Berechnet Kollision zweier Bälle
 * @param {Ball} ballA 
 * @param {Ball} ballB 
 * @param {Vector} normal
 */
function resolveCollisionBalls(ballA, ballB, normal) {
    const rA = lb2d.multVector(normal, -ballA.radius);
    const rA_perp = lb2d.createVector(-rA.y, rA.x);
    const rB = lb2d.multVector(normal, ballB.radius);
    const rB_perp = lb2d.createVector(-rB.y, rB.x);
    const VtanA = lb2d.multVector(rA_perp, ballA.angVelocity);
    const VtanB = lb2d.multVector(rB_perp, ballB.angVelocity);
    const VgesamtA = lb2d.addVector(ballA.velocity, VtanA);
    const VgesamtB = lb2d.addVector(ballB.velocity, VtanB);
    const velocity_AB = lb2d.subVector(VgesamtA, VgesamtB);

    if (lb2d.dotVector(velocity_AB, normal) < 0) { // wenn negativ, dann auf Kollisionskurs
        const e = 1; //inelastischer Stoß
        const j_denominator = lb2d.dotVector(lb2d.multVector(velocity_AB, -(1+e)), normal);
        const j_divLinear = lb2d.dotVector(normal, lb2d.multVector(normal, (1/ballA.mass + 1/ballB.mass)));
        const j = j_denominator / j_divLinear;
        // Grundlage für Friction berechnen
        const t = lb2d.createVector(-(normal.y), normal.x);
        const t_scalarprodukt = lb2d.dotVector(velocity_AB, t);
        t.mult(t_scalarprodukt);
        t.normalize();
        ballA.velocity.add(lb2d.addVector(lb2d.multVector(normal, (j/ballA.mass)), lb2d.multVector(t, (0.2*-j/ballA.mass))));
        ballB.velocity.add(lb2d.addVector(lb2d.multVector(normal, (-j/ballB.mass)), lb2d.multVector(t, (0.2*j/ballB.mass))))
        ballA.angVelocity += lb2d.dotVector(rA_perp, lb2d.multVector(t, 0.1*-j/ballA.inertia));
        ballB.angVelocity += lb2d.dotVector(rB_perp, lb2d.multVector(t, 0.1*j/ballB.inertia));
    }
}

/** Ermittelt Kollisionspunkt Ball zu Box
 * @param {Ball} ball 
 * @param {Box} box 
 */
export function detectCollisionBallBoxes(ball, box) {
    for (let j = 0; j < 4; j++) {
        let e = lb2d.subVector(box.vertices[j+1], box.vertices[j]);
        //Vektor von Ecke der Box zum Ball
        let VerticeToBall = lb2d.subVector(ball.location, box.vertices[j]);
        // --------- Einfügung 09.04.2021, um Kollision mit Ecken abzufangen
        if (VerticeToBall.mag() < ball.radius) {
            resolveCollisionBallBoxes(ball, box, box.vertices[j], VerticeToBall);
            return;
        }
        // --------- Ende Einfügung 09.04.2021
        let mag_e = e.mag();
        e.normalize();
        //Scalarprojektion von Vektor VerticeToBall auf Kante e
        let scalar_e = lb2d.dotVector(VerticeToBall, e);
        if (scalar_e > 0 && scalar_e <= mag_e) {
            //Senkrechte von Ball trifft auf Kante e der Box
            //e2 = Kante e mit der Länge von scalar_e
            let e2 = lb2d.multVector(e, scalar_e);
            //Senkrechte von e zum Ball = VerticeToBall - e2
            let e_perp = lb2d.subVector(VerticeToBall, e2);

            if (e_perp.mag() < ball.radius) {
                //Ball berührt Box
                //Abstand wieder herstellen mit mtv (minimal translation vector)
                let mtv = e_perp.copy();
                let p = lb2d.addVector(box.vertices[j], e2);
                mtv.setMag(ball.radius - e_perp.mag());
                //e_perp und damit mtv zeigt von Kante zu Ball
                ball.resetPos(mtv);
                //vor Berechnung muss e_perp normalisiert werden
                e_perp.normalize();
                resolveCollisionBallBoxes(ball, box, p, e_perp)
                return;
            }
        }
    }
}

/** Berechnet Kollision Ball zu Box
 * @param {Ball} ball 
 * @param {Box} box 
 * @param {Vector} cp    Collisionpoint
 * @param {Vector} normal Senkrechte von Kante e
 */
function resolveCollisionBallBoxes(ball, box, cp, normal) {
    const rA = lb2d.multVector(normal, -ball.radius);
    const rA_perp = lb2d.createVector(-rA.y, rA.x);
    const rBP = lb2d.subVector(cp, box.location);
    const rBP_perp = lb2d.createVector(-rBP.y, rBP.x);
    const VtanA = lb2d.multVector(rA_perp, ball.angVelocity);
    const VgesamtA = lb2d.addVector(ball.velocity, VtanA);
    const VtanB = lb2d.multVector(rBP_perp, box.angVelocity);
    const VgesamtB = lb2d.addVector(box.velocity, VtanB);
    const velocity_AB = lb2d.subVector(VgesamtA, VgesamtB);

    if (lb2d.dotVector(velocity_AB, normal) < 0) { // wenn negativ, dann auf Kollisionskurs

        const e = 1; //inelastischer Stoß
        const j_denominator = lb2d.dotVector(lb2d.multVector(velocity_AB, -(1+e)), normal);
        const j_divLinear = lb2d.dotVector(normal, lb2d.multVector(normal, (1/ball.mass + 1/box.mass)));
        const j_divAngular = Math.pow(lb2d.dotVector(rBP_perp, normal), 2) / box.inertia; //nur für Box zu rechnen
        const j = j_denominator / (j_divLinear + j_divAngular);
        // Grundlage für Friction berechnen
        const t = lb2d.createVector(-(normal.y), normal.x);
        const t_scalarprodukt = lb2d.dotVector(velocity_AB, t);
        t.mult(t_scalarprodukt);
        t.normalize();

        ball.velocity.add(lb2d.addVector(lb2d.multVector(normal, (j/ball.mass)), lb2d.multVector(t, (0.05*-j/ball.mass))));
        box.velocity.add(lb2d.addVector(lb2d.multVector(normal, (-j/box.mass)), lb2d.multVector(t, (0.05*j/box.mass))));
        ball.angVelocity += lb2d.dotVector(rA_perp, lb2d.multVector(t, 0.05*-j/ball.inertia));
        box.angVelocity += lb2d.dotVector(rBP_perp, lb2d.addVector(lb2d.multVector(normal, -j/box.inertia), lb2d.multVector(t, 0.05*j/box.inertia)));
    }




}
