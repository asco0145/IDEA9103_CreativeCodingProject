let baseImg, skyMask, waterMask, hillsMask, bridgeMask, guyMask;
let sky, water, hills, bridge, guy;

let song;          // the sound file
let amp;           // amplitude analyzer
let button;        // play/pause button

function preload() {
  // images
  baseImg   = loadImage("assets/scream.jpeg");
  guyMask   = loadImage("assets/bwguy.png");
  skyMask   = loadImage("assets/sky.png");
  waterMask = loadImage("assets/bwWater.png");
  hillsMask = loadImage("assets/hills.png");
  bridgeMask= loadImage("assets/bwBridge.png");

  // audio
  song = loadSound("assets/Miserere mei, Deus.mp3");

  // create area objects
  sky    = new SkyArea(skyMask);
  water  = new WaterArea(waterMask);
  hills  = new HillsArea(hillsMask);
  bridge = new BridgeArea(bridgeMask);
  guy    = new GuyArea(guyMask);
}

function setup() {
  createCanvas(baseImg.width, baseImg.height);

  hillsMask.resize(width, height);
  waterMask.resize(width, height);
  bridgeMask.resize(width, height);
  skyMask.resize(width, height);
  guyMask.resize(width, height);

  // set up amplitude analyzer
  amp = new p5.Amplitude();
  amp.setInput(song);

  button = createButton("Play / Pause");
  button.position(10, 10);
  button.mousePressed(toggleSong);
}

function draw() {
  // optional background if you want to clear each frame
  // background(0);

  // current loudness level (0 → ~0.3)
  let level = amp.getLevel();

  let levelNorm = map(level, 0, 0.3, 0, 1);  
  levelNorm = constrain(levelNorm, 0, 1);

  // ----------------- painting layers -----------------
  hills.drawPoints();
  water.drawPoints();
  bridge.drawPoints();
  sky.drawStrokes();

  //csound controls guy
  guy.drawPixels(levelNorm);

  noStroke();
  fill(255, 255, 255, 120);
  let eSize = map(level, 0, 0.3, 10, 120);
  ellipse(width - 80, height - 80, eSize);
}

// button callback
function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();  // loop so the animation keeps going
  }
}

// ----------------- CLASSES -----------------

class SkyArea {
  constructor(maskImg){
    this.mask = maskImg;
  }

  drawStrokes() {
    for (let y = 0; y < height; y += 6) {
      let offset = sin(radians(frameCount * 2 + y * 3)) * 10;

      for (let x = 0; x < width; x += 12) {
        let m = this.mask.get(x, y);
        let bright = (m[0] + m[1] + m[2]) / 3;

        if (bright > 40) {
          let c = baseImg.get(x, y);
          stroke(c[0], c[1], c[2], 200);
          strokeWeight(3);

          let yShift = sin((x * 0.5) + (frameCount * 0.005)) * 3;
          line(x + offset, y + yShift, x + 10 + offset, y + yShift);
        }
      }
    }
  }
}

class WaterArea {
  constructor(maskImg){ this.mask = maskImg; }

  drawPoints(){
    for (let i = 0; i < 250; i++){
      let x = random(width);
      let y = random(height);

      let m = this.mask.get(int(x), int(y));
      let bright = (m[0] + m[1] + m[2]) /3;
      if (bright < 100) continue;

      let c = baseImg.get(int(x), int(y));
      let size = map((c[0] + c[1] + c[2])/3, 0, 255, 2, 6);

      strokeWeight(size);
      stroke(c[0], c[1], c[2], 180);
      point(x, y);
    }
  }
}

class HillsArea {
  constructor(maskImg){ this.mask = maskImg; }

  drawPoints(){
    for (let i = 0; i < 250; i++){
      let x = random(width);
      let y = random(height);

      let m = this.mask.get(int(x), int(y));
      let bright = (m[0] + m[1] + m[2]) /3;
      if (bright < 100) continue;

      let c = baseImg.get(int(x), int(y));
      let size = map((c[0] + c[1] + c[2])/3, 0, 255, 2, 6);

      strokeWeight(size);
      stroke(c[0], c[1], c[2], 180);
      point(x, y);
    }
  }
}

class BridgeArea {
  constructor(maskImg) {
    this.mask = maskImg;
  }

  drawPoints() {
    for (let i = 0; i < 250; i++) {
      let x = random(width);
      let y = random(height);

      let m = this.mask.get(int(x), int(y));
      let bright = (m[0] + m[1] + m[2]) / 3;
      if (bright < 120) continue;

      let c = baseImg.get(int(x), int(y));
      let size = map((c[0] + c[1] + c[2]) / 3, 0, 255, 2, 5);

      strokeWeight(size);
      stroke(c[0], c[1], c[2], 170);
      point(x, y);
    }
  }
}

// 🔹 UPDATED: GuyArea now takes an amplitude value
class GuyArea {
  constructor(maskImg) {
    this.mask = maskImg;
    this.basePixelSize = 6;     // starting size
    this.pixelsPerFrame = 120;  // base speed
  }

  // ampLevel is 0–1 from draw()
  drawPixels(ampLevel) {
    // make pixel size + speed respond to sound
    let pixelSize = this.basePixelSize + ampLevel * 16;     // 6 → ~22
    let count     = this.pixelsPerFrame + ampLevel * 300;   // faster when loud

    for (let i = 0; i < count; i++) {
      let x = floor(random(width / pixelSize)) * pixelSize;
      let y = floor(random(height / pixelSize)) * pixelSize;

      let m = this.mask.get(x, y);
      let bright = (m[0] + m[1] + m[2]) / 3;
      if (bright < 100) continue;

      let c = baseImg.get(x, y);

      noStroke();
      fill(c[0], c[1], c[2], 140);
      rect(x, y, pixelSize, pixelSize);
    }
  }
}
