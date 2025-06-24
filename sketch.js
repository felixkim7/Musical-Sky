let maxTeapots = 88;
let Teapots = [];
let Drops = [];
let Comets = [];
let Rains = [];
let Snows = [];
let groundY = 0;


let teapot, drop;
let piano;
let crystal;

//music playing mode
let midi;
let mp3;

const NOTE_START = 21; // A0
const NOTE_END = 108;  // C8
const RECT_WIDTH = 50;
const RECT_HEIGHT = 200;

let isScheduled = false;
let isTransportStarted = false;


let state = 'menu';  // 'menu', 'mode1', 'pause1'
let gameFont;

let cube1Imgs = [];
let cube2Imgs = [];
let gl; // WebGL pointer
let tex, texLoc;
let skyboxShader;
let envShader;
let waterShader;
let crystalShader;

let texDay, texNight;

let dayDuration = 15 * 1000;
let nightDuration = 15 * 1000;
let transitionDuration = 4 * 1000;
let isDay = true;

function preload() {
    teapot = loadModel('teapot.obj');
    drop = loadModel('drop.obj');
    waterShader = loadShader('water.vert', 'water.frag');

    piano = loadModel('Piano.obj');
    crystal = loadModel('crystal.obj');
    crystalShader = loadShader('crystal.vert', 'crystal.frag');
    albedo = loadImage('crystal_albedo.png');
    ao = loadImage('crystal_AO.png');
    normal = loadImage('crystal_normal.png');
    roughness = loadImage('crystal_roughness.png');

    gameFont = loadFont('DTM-Mono.otf');

    mp3 = loadSound('Polonaise.mp3');
    // midiFile = loadBytes('The_Field_of_Hopes_and_Dreams_Deltarune.mid');


    cube1Imgs[0] = loadImage("right1.png");
    cube1Imgs[1] = loadImage("left1.png");
    cube1Imgs[2] = loadImage("top1.png");
    cube1Imgs[3] = loadImage("bottom1.png");
    cube1Imgs[4] = loadImage("front1.png");
    cube1Imgs[5] = loadImage("back1.png");
    skyboxShader = loadShader('skybox.vert', 'skybox.frag');
    envShader = loadShader('envmap.vert', 'envmap.frag');

    cube2Imgs[0] = loadImage("right.png");
    cube2Imgs[1] = loadImage("left.png");
    cube2Imgs[2] = loadImage("top.png");
    cube2Imgs[3] = loadImage("bottom.png");
    cube2Imgs[4] = loadImage("front.png");
    cube2Imgs[5] = loadImage("back.png");
    img = loadImage('grass2.png');
}

function setup() {
    frameRate(120);
    createCanvas(windowWidth, windowHeight, WEBGL);  
    colorMode(HSB, 360, 100, 100);    
    textFont(gameFont);
    setupCubeMap();

    for (let i = NOTE_START; i <= NOTE_END; i++) {
      
        let x = (i - NOTE_START) * RECT_WIDTH;
        // rectangles.push(new NoteRect(x, i));
        Teapots[i - NOTE_START] = new Teapot(teapot, x - 2000, -500, -400, 2.5, i);
        Drops[i - NOTE_START] = new Drop(drop, x - 2000, -487, -350, 10, i, waterShader);
    }


    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        console.warn("Web MIDI API not supported in this browser.");
    }

    loadMidiFile();
}

function draw() {

    switch (state) {
        case 'menu':
            drawMenu();
            break;
        case 'mode1':
            drawGameMode1();
            break;
        case 'mode2':
            drawGameMode1(); // Same visuals, live MIDI input
            break;
        case 'pause1':
            drawPauseOverlay(1);
            break;
        case 'pause2':
            drawPauseOverlay(2);
            break;
    }



}

function drawMenu() {
    background(0);

    camera();

    // Enable 2D text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("MUSICAL SKY", 0, -100);
    text("Press 1 or 2 to Start the GAME", 0, 0);
}

function drawGameMode1() {
    // background(180, 87, 100);
    clear();
    orbitControl();
    

    // ambientLight(60);
    // lights();
    renderSkyBox();
    directionalLight(0,0,100,0,1,0);
    ambientLight(60);

    translate(0, 0, 0);

    // Ground

    noStroke();

    push();
    rotateX(HALF_PI);
    texture(img);
    plane(10000); 
    pop();


    noStroke();
    fill(210, 85, 80);
    push();
    translate(0, -10, 0);
    rotateX(HALF_PI);
    rectMode(CENTER);
    rect(200, 0, 4800, 1500, 30);
    pop();

    noStroke();
    fill(0, 0, 24);
    push();
    translate(175, -500, -400);
    rotateZ(PI / 2);
    cylinder(5, 4400);
    pop();

    noStroke();
    fill(0, 0, 24);
    push();
    translate(-2025, -250, -400);
    // rotateZ(PI / 2);
    cylinder(5, 500);
    pop();


    // Draw teapots
    Teapots.forEach(r => r.render());
    Drops.forEach(r => r.render());


    // piano
    push();
    shader(envShader);
    texLoc = gl.getUniformLocation(envShader._glProgram, "cubeMap");
    gl.uniform1i(texLoc, 0);

    
    translate(-200, 0, 400);
    
    
    scale(10, -10, 10);
    noStroke();
    model(piano);
    resetShader();
    pop();

    for (let i = Comets.length - 1; i >= 0; i--) {
        Comets[i].update();
        Comets[i].display();
        if (Comets[i].isDead()) {
            Comets.splice(i, 1);
        }
    }

    for (let i = Rains.length - 1; i >= 0; i--) {
        Rains[i].update();
        Rains[i].display();
        if (Rains[i].isDead()) {
            Rains.splice(i, 1);
        }
    }

    for (let i = Snows.length - 1; i >= 0; i--) {
        Snows[i].update();
        Snows[i].display();
        if (Snows[i].isDead()) {
            Snows.splice(i, 1);
        }
    }
}




function drawPauseOverlay(modeNumber) {

    // background(0);
    let gl = this._renderer.GL;

    gl.disable(gl.DEPTH_TEST);  // ✅ Let the overlay ignore 3D depth

    camera();

    fill(0, 150);
    rectMode(CENTER);
    noStroke();
    rect(0, 0, width, height);

    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("PAUSED", 0, -100);
    if(modeNumber == 1){
        text("Press 1 to continue or ESC to Go to Home", 0, 0);
    }
    if(modeNumber == 2){
        text("Press 2 to continue or ESC to Go to Home", 0, 0);
    }
    
    gl.enable(gl.DEPTH_TEST);
}


function mousePressed() {


}

function keyPressed() {

    if (state === 'menu') {
        if(key === '1') {
            state = 'mode1';
        }
        if(key === '2') {
            state = 'mode2';
        }
    }

    else if (state === 'mode1') {
        if(keyCode === ESCAPE) {
            state = 'pause1';
            Tone.Transport.pause();
            isTransportStarted = false;
            mp3.pause();
        }

        if(keyCode === 32){
            Tone.start().then(() => {
                if (!isScheduled && midi) {
                    scheduleMidiPlayback();
                    isScheduled = true;
                }
                if (!isTransportStarted && midi) {
                    Tone.Transport.start();
                    isTransportStarted = true;
                }
            });
            if (!mp3.isPlaying()) {
                mp3.play();
            }
        }
    }
    
    else if (state === 'pause1') {
        if(keyCode === ESCAPE) {
            state = 'menu';
            Tone.Transport.stop();
            isTransportStarted = false;
            mp3.stop();
        }

        if(key === '1') {
            state = 'mode1';
        }

        if(key === '2') {
            state = 'mode2';
            Tone.Transport.stop();
            isTransportStarted = false;
            mp3.stop();
        }
    }

    else if (state === 'mode2') {
        if(keyCode === ESCAPE) {
            state = 'pause2';
        }
    }
    
    else if (state === 'pause2') {
        if(keyCode === ESCAPE) {
            state = 'menu';
        }
        if(key === '1') {
            state = 'mode1';
        }
        if(key === '2') {
            state = 'mode2';
        }
    }
}


function loadMidiFile() {
    fetch('Polonaise.mid') // Replace with your file path
        .then(response => response.arrayBuffer())
        .then(buffer => {
            midi = new Midi(buffer);
        // scheduleMidiPlayback();
        });
}

function scheduleMidiPlayback() {
    midi.tracks.forEach(track => {
        track.notes.forEach(note => {
            let startTime = note.time;
            let duration = note.duration;
            let midiNumber = note.midi;
            
            // Schedule note on
            Tone.Transport.schedule(() => {
              activateNote(midiNumber);
            }, startTime);
            
            // Schedule note off
            Tone.Transport.schedule(() => {
              deactivateNote(midiNumber);
            }, startTime + duration);
        });
    });
  
    Tone.Transport.start();
}

function activateNote(midiNumber) {
    let pots = Teapots.find(r => r.midiNote === midiNumber);
    if (pots) pots.noteOn();
    let drs = Drops.find(r => r.midiNote === midiNumber);
    if (drs) drs.noteOn();
    if(isDay == false) {
        Comets.push(new Comet());

    }

    if(isDay == true) {
        Rains.push(new Rain(drop, waterShader));
        Rains.push(new Rain(drop, waterShader));
        Snows.push(new Snow(crystal, crystalShader, albedo, ao, normal, roughness));
        Snows.push(new Snow(crystal, crystalShader, albedo, ao, normal, roughness));
    }
    
    
}

function deactivateNote(midiNumber) {
    let pots = Teapots.find(r => r.midiNote === midiNumber);
    if (pots) pots.noteOff();
    let drs = Drops.find(r => r.midiNote === midiNumber);
    if (drs) drs.noteOff();
}


//mode 2
function onMIDISuccess(midiAccess) {
    for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = handleMIDIMessage;
    }
    console.log("MIDI device ready.");
}

function onMIDIFailure() {
    console.error("Could not access your MIDI devices.");
}

function handleMIDIMessage(message) {
    if (state !== 'mode2') return;

    const [status, noteNumber, velocity] = message.data;
    const command = status & 0xf0;

    if (command === 0x90 && velocity > 0) {
        activateNote(noteNumber);
    } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
        deactivateNote(noteNumber);
    }
}


//skybox
function setupCubeMap() {
    // Using WebGL functions directly because p5.js doesn't support cubemap yet
    gl = this._renderer.GL;

    // === DAY ===
    texDay = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texDay);
    cube1Imgs.forEach((img, i) => {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img.canvas);
    });
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // === NIGHT ===
    texNight = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texNight);
    cube2Imgs.forEach((img, i) => {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img.canvas);
    });
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function renderSkyBox() { 
    // rotateX(-PI/2);
    shader(skyboxShader);
    gl.depthFunc(gl.LEQUAL);

    let mixAmount = getMixAmount();
    skyboxShader.setUniform('mixAmount', mixAmount);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texDay);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texNight);

    let locDay = gl.getUniformLocation(skyboxShader._glProgram, "cubeMapDay");
    gl.uniform1i(locDay, 0);

    let locNight = gl.getUniformLocation(skyboxShader._glProgram, "cubeMapNight");
    gl.uniform1i(locNight, 1);
    
    push();

    // right 
    beginShape();
    vertex(1, -1, -1, 0, 0);
    vertex(1, 1, -1, 0, 1);
    vertex(1, 1, 1, 1, 1);
    vertex(1, -1, 1, 1, 0);
    endShape();

    //left
    beginShape();
    vertex(-1, -1, 1, 0, 0);
    vertex(-1, 1, 1, 0, 1);
    vertex(-1, 1, -1, 1, 1);
    vertex(-1, -1, -1, 1, 0);
    endShape();

    // top
    beginShape();
    vertex(-1, -1, 1, 0, 0);
    vertex(-1, -1, -1, 0, 1);
    vertex(1, -1, -1, 1, 1);
    vertex(1, -1, 1, 1, 0);
    endShape();

    //bottom
    beginShape();
    vertex(-1, 1, -1, 0, 0);
    vertex(-1, 1, 1, 0, 1);
    vertex(1, 1, 1, 1, 1);
    vertex(1, 1, -1, 1, 0);
    endShape();

    //front
    beginShape();
    vertex(-1, -1, -1, 0, 0);
    vertex(-1, 1, -1, 0, 1);
    vertex(1, 1, -1, 1, 1);
    vertex(1, -1, -1, 1, 0);
    endShape();

    // back
    beginShape();
    vertex(1, -1, 1, 0, 0);
    vertex(1, 1, 1, 0, 1);
    vertex(-1, 1, 1, 1, 1);
    vertex(-1, -1, 1, 1, 0);
    endShape();

    pop();
    
    // return z-depth test back to default mode
    gl.depthFunc(gl.LESS);
    resetShader();
}

function getMixAmount() {
    let cycle = dayDuration + transitionDuration + nightDuration + transitionDuration;
    let t = millis() % cycle;

    if (t < dayDuration){
        isDay = true;
        return 0.0;
    } 
    if (t < dayDuration + transitionDuration){
        return (t - dayDuration) / transitionDuration;  
    }
        
    if (t < dayDuration + transitionDuration + nightDuration){
        isDay = false;
        return 1.0;
    }
        
    return 1.0 - (t - dayDuration - transitionDuration - nightDuration) / transitionDuration;
}
