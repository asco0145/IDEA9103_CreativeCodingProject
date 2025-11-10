let baseImg, skyMask, waterMask, hillsMask, bridgeMask, guyMask;

let sky, water, hills, bridge, guy;

function preload(){

baseImg = loadImage("assets/scream.jpeg")

guyMask = loadImage("assets/guy.png")

skyMask = loadImage("assets/sky.png")

waterMask = loadImage("assets/bwWater.png")

hillsMask = loadImage("assets/hills.png")

bridgeMask = loadImage("assets/bwBridge.png")

sky = new SkyArea(skyMask);

water = new WaterArea(waterMask);

hills = new HillsArea(hillsMask);

bridge = new BridgeArea(bridgeMask);

guy = new GuyArea(guyMask);

}

function setup() {

createCanvas(baseImg.width, baseImg.height);

hillsMask.resize(width, height); //Trying to resize mask

waterMask.resize(width, height);
bridgeMask.resize(width, height);

//image(baseImg, 0, 0);

}

function draw() {

//background(220);

hills.drawPoints();

water.drawPoints();
bridge.drawPoints();

}

class SkyArea {

}

class WaterArea {

constructor(maskImg){this.mask = maskImg;}

drawPoints(){

for (let i = 0; i < 250; i++){

let x = random(width);

let y = random(height);

//Black and White Mask

let m = this.mask.get(int(x), int(y));

let bright = (m[0] + m[1] + m[2]) /3;

if (bright < 100) continue;

//Chooses color for the painting

let c = baseImg.get(int(x), int(y));

let size = map((c[0] + c[1] + c[2])/3, 0, 255, 2, 6) //size depends on color

//Dot details

strokeWeight(size);

stroke(c[0], c[1], c[2], 180);

point(x, y);

}

}

}

//Alex

class HillsArea {

constructor(maskImg){this.mask = maskImg;}

/*drawLines() {

//Draws 5 lines

for (let i = 0; i < 5; i++){

let x1 = random(width);

let y1 = random(height);

let x2 = random(width);

let y2 = random(height);

//Check Point 1

let p1 = this.mask.get(int(x1), int(y1));

let b1 = (p1[0] + p1[1] + p1[2]) /3; //greyscale

//Check Point 2

let p2 = this.mask.get(int(x2), int(y2));

let b2 = (p2[0] + p2[1] + p2[2]) /3; //greyscale

if(b1 < 200 || b2 < 200) continue; //avoid drawing in the black

//Choses color for the painting

let c = baseImg.get(int(x1), int(y1));

strokeWeight(4);

stroke(c[0], c[1], c[2], 180);

line(x1, y1, x2, y2);

}

}*/

drawPoints(){

for (let i = 0; i < 250; i++){

let x = random(width);

let y = random(height);

//Black and White Mask

let m = this.mask.get(int(x), int(y));

let bright = (m[0] + m[1] + m[2]) /3;

if (bright < 100) continue;

//Choses color for the painting

let c = baseImg.get(int(x), int(y));

let size = map((c[0] + c[1] + c[2])/3, 0, 255, 2, 6) //size depends on color

//Dot details

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

      // Safety check: make sure we don't go out of bounds
      x = constrain(int(x), 0, width - 1);
      y = constrain(int(y), 0, height - 1);

      // Get mask pixel
      let m = this.mask.get(x, y);

      // Safety check: skip if mask.get() returns undefined
      if (!m) continue;

      // Average brightness of the mask pixel
      let bright = (m[0] + m[1] + m[2]) / 3;

      // Include most of the bridge (low threshold)
      if (bright < 20) continue;

      // Get color from base image
      let c = baseImg.get(x, y);

      // Map brightness to dot size
      let size = map((c[0] + c[1] + c[2]) / 3, 0, 255, 2, 6);

      // Draw the dot
      strokeWeight(size);
      stroke(c[0], c[1], c[2], 180);
      point(x, y);
    }
  }
}

class GuyArea {

}