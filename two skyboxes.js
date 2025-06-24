let piano;


let state = 'menu';  // 'menu', 'mode1', 'pause1'
let gameFont;

let cube1Imgs = [];
let cube2Imgs = [];
let gl; // WebGL pointer
let tex, texLoc;
let skyboxShader;
let envShader;

let texDay, texNight;

let dayDuration = 15 * 1000;
let nightDuration = 15 * 1000;
let transitionDuration = 4 * 1000;



function preload() {



    piano = loadModel('Piano.obj');

    gameFont = loadFont('DTM-Mono.otf');


    // midiFile = loadBytes('The_Field_of_Hopes_and_Dreams_Deltarune.mid');


    cube1Imgs[0] = loadImage("test/right1.png");
    cube1Imgs[1] = loadImage("test/left1.png");
    cube1Imgs[2] = loadImage("test/top1.png");
    cube1Imgs[3] = loadImage("test/bottom1.png");
    cube1Imgs[4] = loadImage("test/front1.png");
    cube1Imgs[5] = loadImage("test/back1.png");
    skyboxShader = loadShader('skybox.vert', 'skybox.frag');
    envShader = loadShader('envmap.vert', 'envmap.frag');

    cube2Imgs[0] = loadImage("night/right.png");
    cube2Imgs[1] = loadImage("night/left.png");
    cube2Imgs[2] = loadImage("night/top.png");
    cube2Imgs[3] = loadImage("night/bottom.png");
    cube2Imgs[4] = loadImage("night/front.png");
    cube2Imgs[5] = loadImage("night/back.png");
}

function setup() {
    frameRate(120);
    createCanvas(windowWidth, windowHeight, WEBGL);  
    colorMode(HSB, 360, 100, 100);    
    textFont(gameFont);
    setupCubeMap();





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
    fill(118, 57, 62);
    push();
    rotateX(HALF_PI);
    rectMode(CENTER);
    rect(0, 0, 50000, 30000);
    pop();

    noStroke();
    fill(51, 42, 90);
    push();
    translate(0, -5, 0);
    rotateX(HALF_PI);
    rectMode(CENTER);
    rect(200, 0, 5000, 700, 30);
    pop();


    noStroke();
    fill(210, 85, 80);
    push();
    translate(0, -10, 0);
    rotateX(HALF_PI);
    rectMode(CENTER);
    rect(200, 0, 4800, 500, 30);
    pop();

    noStroke();
    fill(0, 0, 24);
    push();
    translate(175, -500, 0);
    rotateZ(PI / 2);
    cylinder(5, 4400);
    pop();

    noStroke();
    fill(0, 0, 24);
    push();
    translate(-2025, -250, 0);
    // rotateZ(PI / 2);
    cylinder(5, 500);
    pop();


    // Draw teapots



    // piano
    push();
    shader(envShader);
    texLoc = gl.getUniformLocation(envShader._glProgram, "cubeMap");
    gl.uniform1i(texLoc, 0);

    
    translate(0, 0, 0);
    
    
    scale(10, -10, 10);
    noStroke();
    model(piano);
    resetShader();
    pop();
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

        }


    }
    
    else if (state === 'pause1') {
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












//skybox
function setupCubeMap() {
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

  if (t < dayDuration) return 0.0;
  if (t < dayDuration + transitionDuration)
    return (t - dayDuration) / transitionDuration;
  if (t < dayDuration + transitionDuration + nightDuration)
    return 1.0;
  return 1.0 - (t - dayDuration - transitionDuration - nightDuration) / transitionDuration;
}