let baseImg, skyMask, waterMask, hillsMask, bridgeMask, guyMask;
let sky, water, hills, bridge, guy;

let song;          // the sound file
let amp;           // amplitude analyzer (for guy)
let fft;           // FFT object (for corner visualiser)
let button;        // play/pause button

// FFT settings (for the corner visualiser)
let numBins = 128;
let smoothing = 0.8;

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

  // set up amplitude analyzer (for guy)
  amp = new p5.Amplitude();
  amp.setInput(song);

  // set up FFT (for corner visualiser)
  fft = new p5.FFT(smoothing, numBins);
  fft.setInput(song); // listen to the same song

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

  // sound controls guy
  guy.drawPixels(levelNorm);

  // ----------------- CORNER FFT VISUALISER -----------------
  // (Part 5 style, but shrunk + moved into the corner)
  let spectrum     = fft.analyze();
  let amplitude    = fft.getEnergy(20, 20000);
  let centroidFreq = fft.getCentroid();

  // draw mini wheel in bottom-right corner
  drawMiniVisualizer(width - 120, height - 120, 80, spectrum, amplitude, centroidFreq);
}

// button callback
function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();  // loop so the animation keeps going
  }
}

// ------------- MINI FFT WHEEL (corner visualiser) -------------
function drawMiniVisualizer(cx, cy, radius, spectrum, amplitude, centroidFreq) {
  push();

  // move to desired corner position
  translate(cx, cy);

  // use HSB just for the visualiser
  colorMode(HSB, 255);
  noStroke();

  // we’ll treat radius as the inner circle radius of the bars
  let circleRadius  = radius;
  let maxRectLength = radius * 0.9;

  // rectangles around the circle
  for (let i = 0; i < spectrum.length; i++) {
    // angle around circle
    let angle = map(i, 0, spectrum.length, 0, TWO_PI);

    // bar length based on spectrum value
    let rectHeight = map(spectrum[i], 0, 255, 0, maxRectLength);

    push();
    rotate(angle);

    // colour based on frequency band index
    fill(map(i, 0, spectrum.length, 0, 255), 255, 255, 220);

    // bar width so they fit nicely around circle
    let rectWidth = (TWO_PI * circleRadius) / spectrum.length;
    rect(0, circleRadius, rectWidth, rectHeight);
    pop();
  }

  // inner circle: size from amplitude, colour from spectral centroid
  let innerCircleSize = map(amplitude, 0, 255, circleRadius / 5, circleRadius);
  let colorVal        = map(centroidFreq, 0, 22050, 0, 255);
  fill(colorVal, 255, 255);
  ellipse(0, 0, innerCircleSize * 2);

  // restore RGB for rest of sketch
  colorMode(RGB, 255);
  pop();
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

// Guy controlled by amplitude
class GuyArea {
  constructor(maskImg) {
    this.mask = maskImg;
    this.basePixelSize   = 6;    // starting size
    this.pixelsPerFrame  = 120;  // base speed
  }

  // ampLevel is 0–1 from draw()
  drawPixels(ampLevel) {
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
