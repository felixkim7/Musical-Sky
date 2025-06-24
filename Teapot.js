// Teapot Class
class Teapot {
    constructor(teapot, x, y, z, scale, midiNote) {
        this.teapot = teapot;
        this.x = x;
        this.y = y;
        this.z = z;
        this.scale = scale;
        this.midiNote = midiNote;
        this.active = false;
        this.c = color(100, 100, 100);
    }
  
    render() {
        push();
        translate(this.x, this.y, this.z);
        scale(this.scale);
        rotateX(PI / 4);
        rotateZ(PI / 2);
        if (this.active) {
          fill(294, 60, 87); // Black when active
        } else {
          fill(294, 20, 87); // White when inactive
        }
        model(this.teapot);
        pop();
    }
  
    noteOn() {
        this.active = true;
    }
    
    noteOff() {
        this.active = false;
    }
  }