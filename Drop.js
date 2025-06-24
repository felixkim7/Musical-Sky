// Teapot Class
class Drop {
    constructor(drop, x, y, z, scale, midiNote, dropShader) {
        this.drop = drop;
        this.x = x;
        this.y = y;
        this.z = z;
        this.initY = y;
        this.dy = 0;
        
        this.scale = scale;
        this.midiNote = midiNote;
        this.active = false;
        this.c = color(100, 100, 100);
        this.shader = dropShader;
    }
  
    render() {
        this.y += this.dy;
        if(this.y > 0) {
            this.y = this.initY;
            this.dy = 0;
        }
        push();
        shader(this.shader);
        this.shader.setUniform('uLightDir', [0.5, 1.0, 1.0]);
        translate(this.x, this.y, this.z);
        scale(this.scale);
        rotateX(PI);
        model(this.drop);
        resetShader();
        pop();
    }
  
    noteOn() {
        this.active = true;
        this.dy = 20;
    }
    
    noteOff() {
        this.active = false;
    }
  }