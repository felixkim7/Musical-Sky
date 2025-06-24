class Particle {
    constructor(basePos, cometVel) {
        // Store comet velocity for orientation during display
        this.vel = cometVel.copy().normalize();

        // Keep original random triangular spread
        let spreadX = random(-0.3, 0.3);
        let spreadY = random(-3, 0);
        let spreadZ = random(-0.3, 0.3);

        this.offset = createVector(spreadX * 60, spreadY * 30, spreadZ * 30);
        this.pos = p5.Vector.add(basePos, this.offset);

        this.lifespan = 100;

        // Color grouping
        let r = random();
        if (r < 0.4) this.col = color(0, 0, 100);
        else if (r < 0.7) this.col = color(220, 80, 100);
        else this.col = color(280, 60, 100);

        this.size = random(2, 5);
    }

    update() {
        // Optional drift (mild movement in tail direction)
        this.pos.add(this.vel.copy().mult(0.3));
        this.lifespan -= 2;
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);

        // Align the spread to face away from the comet's direction
        let v = this.vel.copy().normalize();
        let thetaY = atan2(v.x, v.z); // Horizontal turn
        let thetaX = asin(-v.y);      // Vertical pitch
        rotateY(thetaY);
        rotateX(thetaX);

        let alpha = map(this.lifespan, 0, 100, 0, 255);
        let sz = map(this.lifespan, 0, 100, 0, this.size);
        fill(red(this.col), green(this.col), blue(this.col), alpha);
        sphere(sz);
        pop();
    }

    isDead() {
        return this.lifespan <= 0;
    }
}
