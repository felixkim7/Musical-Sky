class Rain {
    constructor(drop, waterShader) {
        // Random sky position
        this.drop = drop;
        this.shader = waterShader;
        this.pos = createVector(random(-1500, 1500), random(-3000, -2000), random(-1000, 0));
        this.vel = createVector(0, random(10, 20), 0); // Falling speed
        this.alive = true;
        this.radius = 10;
    }

    update() {
        if (!this.alive) return;

        // Move downward
        this.pos.add(this.vel);



        // Check ground collision
        if (this.pos.y > - this.radius) {
            this.alive = false;
        }
    }

    display() {
        if (!this.alive) return;

        push();
        shader(this.shader);
        this.shader.setUniform('uLightDir', [0.5, 1.0, 1.0]);
        translate(this.pos.x, this.pos.y, this.pos.z);
        scale(15);
        rotateX(PI);
        model(this.drop);
        resetShader();
        pop();


    }

    isDead() {
        return !this.alive === 0;
    }
}