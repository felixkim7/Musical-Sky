class Comet {
    constructor() {
        // Random sky position
        this.pos = createVector(random(-1000, 1000), random(-3000, -2000), random(-1000, 0));
        this.vel = createVector(random(-100,100), random(100, 200), random(-100,100)); // Falling speed
        this.radius = 10;
        this.tail = [];
        this.alive = true;
    }

    update() {
        if (!this.alive) return;

        // Move downward
        this.pos.add(this.vel);

        // Add tail particles
        for (let i = 0; i < 5; i++) {
            this.tail.push(new Particle(this.pos.copy(), this.vel));
        }

        // Update tail
        for (let i = this.tail.length - 1; i >= 0; i--) {
            this.tail[i].update();
            if (this.tail[i].isDead()) {
                this.tail.splice(i, 1);
            }
        }

        // Check ground collision
        if (this.pos.y > - this.radius) {
            this.alive = false;
        }
    }

    display() {
        if (!this.alive) return;

        blendMode(ADD);
        // Comet head
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        emissiveMaterial(310, 70, 100);
        sphere(this.radius);
        pop();

        // Tail
        for (let p of this.tail) {
            p.display();
        }
        blendMode(BLEND);
    }

    isDead() {
        return !this.alive && this.tail.length === 0;
    }
}