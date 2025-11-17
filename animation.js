let baseImg, skyMask, waterMask, hillsMask, bridgeMask, guyMask;

let sky, water, hills, bridge, guy;

function preload(){

baseImg = loadImage("assets/scream.jpeg")
guy = loadImage("assets/guy.png")
skyMask = loadImage("assets/sky.png")
water = loadImage("assets/waterDots.png")
bridge = loadImage("assets/bridge.png")

sky = new SkyArea(skyMask);
guy = new GuyArea(guyMask);

}

function setup() {

createCanvas(500, 600);

baseImg.resize(width,height);
skyMask.resize(width, height);
bridge.resize(width,height);
water.resize(width,height);
guy.resize(width,height);


}

function draw() {

image(baseImg,0,0);
image(water,0,0);

image(bridge, 0, 0); //draw bridge 

sky.drawStrokes();

image(guy,0,0);

}

class SkyArea {
  constructor(maskImg){
    this.mask = maskImg;

  }
drawStrokes() {
  for (let y = 0; y < height; y += 6) { //loops through the y axis of the canvas in steps of 6 pixels

    let offset = sin(radians(frameCount * 2 + y * 3)) * 10; // horizontal left right movement

    for (let x = 0; x < width; x += 12) { //each iteration draws one short stroke, 10 pixels wide, along the row
         // check if pixel belongs to sky (based on mask brightness)
        let m = this.mask.get(x, y);
        let bright = (m[0] + m[1] + m[2]) / 3;

        if (bright > 40) {  // only draw strokes where mask is bright (sky area)
      let c = baseImg.get(x, y); //use colours from base image
      stroke(c[0], c[1], c[2], 200);
      strokeWeight(3); // make each line 3 pixels thick

      // wave movement per pixel
      let yShift = sin((x * 0.5) + (frameCount * 0.005)) * 3; //vertical wave motion
      line(x + offset, y + yShift, x + 10 + offset, y + yShift); // horizontal line
    }
  }}}
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





