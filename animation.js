let img;
let skyRegion, waterRegion, guyRegion;

function preload() {
  img = loadImage('assets/base.png');   // your image
}

function setup() {
  createCanvas(img.width, img.height);

  // Define simple regions (adjust if needed)
  skyRegion = { x: 0, y: 0, w: width, h: height * 0.33 };
  waterRegion = { x: 0, y: height * 0.33, w: width, h: height * 0.33 };
  guyRegion = { x: width * 0.35, y: height * 0.45, w: width * 0.30, h: height * 0.40 };

  imageMode(CORNER);
}

function draw() {
  background(0);
  image(img, 0, 0);

  let t = millis() / 1000;

  // ---------------------------
  // 1. START — CALM VIEW (0–3s)
  // ---------------------------
  if (t < 3) return;

  // ---------------------------
  // 2. WATER RIPPLES (3–7s)
  // ---------------------------
  if (t >= 3 && t < 7) {
    drawWaterRipples(map(t, 3, 7, 0, 1));
  }

  // ---------------------------
  // 3. SKY HUE SHIFT (7–10s)
  // ---------------------------
  if (t >= 7 && t < 10) {
    drawSkyHueShift(map(t, 7, 10, 0, 1));
  }

  // ---------------------------
  // 4. GLITCH GUY (10–12s)
  // ---------------------------
  if (t >= 10 && t < 12) {
    drawGuyGlitch(map(t, 10, 12, 0, 1));
  }

  // ---------------------------
  // 5. SYNC MOTION (12–15s)
  // EVERYTHING MOVES TOGETHER
  // ---------------------------
  if (t >= 12 && t < 15) {
    let phase = map(t, 12, 15, 0, 1);
    drawWaterRipples(1);
    drawSkyHueShift(1);
    drawGuyGlitch(1 - abs(sin(frameCount * 0.1))); // pulsating glitch
  }

  // ---------------------------
  // 6. SETTLE BACK TO STILLNESS (15s+)
  // ---------------------------
  if (t >= 15) {
    let easeOut = exp(-(t - 15)); // exponential decay of motion

    drawWaterRipples(easeOut);
    drawSkyHueShift(easeOut);
    drawGuyGlitch(easeOut * 0.3);
  }
}

// -------------------------------------------------------------
// WATER RIPPLE EFFECT
// -------------------------------------------------------------
function drawWaterRipples(strength) {
  let r = waterRegion;
  let waveAmp = 10 * strength;
  let waveFreq = 0.02;

  for (let y = r.y; y < r.y + r.h; y++) {
    let offset = sin((frameCount + y) * waveFreq) * waveAmp;
    copy(img, r.x, y, r.w, 1, r.x + offset, y, r.w, 1);
  }
}

// -------------------------------------------------------------
// SKY HUE SHIFT EFFECT
// -------------------------------------------------------------
function drawSkyHueShift(strength) {
  let r = skyRegion;
  loadPixels();
  img.loadPixels();

  for (let y = r.y; y < r.y + r.h; y++) {
    for (let x = r.x; x < r.x + r.w; x++) {
      let i = 4 * (y * width + x);

      let hShift = sin(frameCount * 0.02 + y * 0.01) * 30 * strength;

      // Convert RGB → HSB, shift hue, convert back
      let c = color(img.pixels[i], img.pixels[i+1], img.pixels[i+2]);
      colorMode(HSB);
      let h = (hue(c) + hShift) % 360;
      let s = saturation(c);
      let b = brightness(c);
      let newC = color(h, s, b);
      colorMode(RGB);

      pixels[i]   = red(newC);
      pixels[i+1] = green(newC);
      pixels[i+2] = blue(newC);
      pixels[i+3] = 255;
    }
  }

  updatePixels();
}

// -------------------------------------------------------------
// GLITCH GUY EFFECT
// -------------------------------------------------------------
function drawGuyGlitch(strength) {
  let r = guyRegion;

  let glitchChance = 0.05 * strength;

  if (random() < glitchChance) {
    let sliceY = random(r.y, r.y + r.h);
    let sliceH = random(5, 20);

    copy(
      img,
      r.x, sliceY, r.w, sliceH,
      r.x + random(-20, 20) * strength, sliceY,
      r.w, sliceH
    );
  }

  // Pixelation
  let pixelSize = map(strength, 0, 1, 1, 12);

  for (let y = r.y; y < r.y + r.h; y += pixelSize) {
    for (let x = r.x; x < r.x + r.w; x += pixelSize) {
      let c = img.get(x, y);
      noStroke();
      fill(c);
      rect(x, y, pixelSize, pixelSize);
    }
  }
}
