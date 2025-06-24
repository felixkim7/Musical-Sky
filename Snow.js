class Snow {
    constructor(crystal, crystalShader, albedo, ao, normal, roughness) {
        // Random sky position
        this.crystal = crystal;
        this.shader = crystalShader;
        this.albedo = albedo;
        this.ao = ao;
        this.normal = normal;
        this.roughness = roughness;
        this.pos = createVector(random(-1500, 1500), random(-3000, -2000), random(-1000, 0));
        this.vel = createVector(0, random(10, 20), 0); // Falling speed
        this.alive = true;
        this.radius = 10;
        this.rot = random(TWO_PI);
        this.rotSpeed = random(-0.1, 0.1);
    }

    update() {
        if (!this.alive) return;

        // Move downward
        this.pos.add(this.vel);


        this.rot += this.rotSpeed;
        // Check ground collision
        if (this.pos.y > - this.radius) {
            this.alive = false;
        }
    }

    display() {
        if (!this.alive) return;

        push();
        shader(this.shader);
        this.shader.setUniform('albedoMap', albedo);
        this.shader.setUniform('aoMap', ao);
        this.shader.setUniform('normalMap', normal);
        this.shader.setUniform('roughnessMap', roughness);
        this.shader.setUniform('lightDir', [0.5, 0.8, 1.0]);
        translate(this.pos.x, this.pos.y, this.pos.z);
        scale(15);
        rotateX(PI);
        rotateY(this.rot);
        model(this.crystal);
        resetShader();
        pop();


    }

    isDead() {
        return !this.alive === 0;
    }
}