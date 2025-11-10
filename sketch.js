let baseImg, skyMask, waterMask, hillsMask, bridgeMask, guyMask;
let sky, water, hills, bridge, guy;

function preload() {
  baseImg   = loadImage("assets/scream.jpeg");
  guyMask   = loadImage("assets/guy.png");  
  skyMask   = loadImage("assets/sky.png");
  waterMask = loadImage("assets/water.png");
  hillsMask = loadImage("assets/hills.png");
  bridgeMask = loadImage("assets/bridge.png");
}

function setup() {
  createCanvas(baseImg.width, baseImg.height);

  sky    = new SkyArea(skyMask);
  water  = new WaterArea(waterMask);
  hills  = new HillsArea(hillsMask);
  bridge = new BridgeArea(bridgeMask);
  guy    = new GuyArea(guyMask, baseImg);
}

function draw() {
  background(220);

  image(baseImg, 0, 0);

  guy.draw();
}


  
class SkyArea {}
class WaterArea {}
class HillsArea {}
class BridgeArea {}


class GuyArea {
<<<<<<< Updated upstream
  constructor(maskImg) {
    this.mask = maskImg;          // store the mask
    this.numSegments = 50;        // same as your Mona example
    this.segments = [];           // will hold ImageSegment objects

    this.buildSegments();         // create the mosaic once
  }

  buildSegments() {
    let segmentWidth = width / this.numSegments;
    let segmentHeight = height / this.numSegments;

    for (let segYPos = 0; segYPos < height; segYPos += segmentHeight) {
      for (let segXPos = 0; segXPos < width; segXPos += segmentWidth) {

        // sample from the centre of the segment
        let sx = int(segXPos + segmentWidth / 2);
        let sy = int(segYPos + segmentHeight / 2);

        // safety so we don't go out of bounds
        sx = constrain(sx, 0, width - 1);
        sy = constrain(sy, 0, height - 1);

        // check the mask first – only draw where the guy is
        let m = this.mask.get(sx, sy);
        if (!m) continue;

        let bright = (m[0] + m[1] + m[2]) / 3;

        // if your guy mask is white on black, this avoids the black background
        if (bright < 100) continue;

        // get colour from the base image at the same spot
        let segmentColour = baseImg.get(sx, sy);

        // create a segment and store it
        let segment = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour);
        this.segments.push(segment);
      }
    }
  }

  drawSegments() {
    for (const segment of this.segments) {
      segment.draw();
    }
  }
}
=======
  constructor(guyImg, baseImg) {
    this.guyImg = guyImg;
    this.baseImg = baseImg;

    this.numSegments = 40; // grid density (smaller = chunkier pixels)
    this.segW = this.guyImg.width / this.numSegments;
    this.segH = this.guyImg.height / this.numSegments;

    this.segments = [];

    // Divide guy.png into segments where alpha > 0
    for (let y = 0; y < this.guyImg.height; y += this.segH) {
      for (let x = 0; x < this.guyImg.width; x += this.segW) {
        const cx = Math.floor(x + this.segW / 2);
        const cy = Math.floor(y + this.segH / 2);

        const col = this.guyImg.get(cx, cy);
        const alpha = col[3];

        // skip fully transparent pixels
        if (alpha === 0) continue;

        this.segments.push({
          x, y, w: this.segW, h: this.segH, colour: col
        });
      }
    }

    console.log("Guy segments created:", this.segments.length);
  }

  draw() {
    image(this.guyImg, 0, 0);

    noStroke();

    for (const seg of this.segments) {
      const { x, y, w, h, colour } = seg;

      const over =
        mouseX > x && mouseX < x + w &&
        mouseY > y && mouseY < y + h;

      if (over) continue; 

      rect(x, y, w, h);
    }
  }
}
>>>>>>> Stashed changes
