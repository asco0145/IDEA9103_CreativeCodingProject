let baseImg, skyMask, waterMask, hillsMask, bridgeMask, guyMask, guyImg;
let sky, water, hills, bridge, guy;

let skySpeed = 2; //Controls Sky Speed
let guyScale = 1; //Cpntrols screaming guy's growth

function preload(){

baseImg = loadImage("assets/scream.jpeg")
guyMask = loadImage("assets/bwguy.png")
guyImg = loadImage("assets/guy.png")
skyMask = loadImage("assets/sky.png")
waterMask = loadImage("assets/bwWater.png")
hillsMask = loadImage("assets/hills.png")
bridgeMask = loadImage("assets/bwBridge.png")

sky = new SkyArea(skyMask);
water = new WaterArea(waterMask);
hills = new HillsArea(hillsMask);
bridge = new BridgeArea(bridgeMask);
guy = new GuyArea(guyMask, guyImg);

}

function setup() {

createCanvas(baseImg.width, baseImg.height);

hillsMask.resize(width, height);
waterMask.resize(width, height);
bridgeMask.resize(width, height);
skyMask.resize(width, height);
guyMask.resize(width, height);
guyImg.resize(width, height);
//image(baseImg, 0, 0);
}

function keyPressed(){
  if (keyCode === UP_ARROW) skySpeed += 0.5;
  if (keyCode === DOWN_ARROW) skySpeed = max(0.5, skySpeed - 0.5);
  console.log("Sky speed:", skySpeed);
}

function draw() {

//background(220);

hills.drawPoints();
water.drawPoints();
bridge.drawPoints();
sky.drawStrokes();

//draw the pixelated guy last (so he sits on top)
guy.drawGuy();
}

class SkyArea {
  constructor(maskImg){
    this.mask = maskImg;

  }
drawStrokes() {
  for (let y = 0; y < height; y += 6) { //loops through the y axis of the canvas in steps of 6 pixels

    //Scaled by skySpeed
    let offset = sin(radians(frameCount * skySpeed + y * 3)) * 10; // horizontal left right movement

    for (let x = 0; x < width; x += 12) { //each iteration draws one short stroke, 10 pixels wide, along the row
         // check if pixel belongs to sky (based on mask brightness)
        let m = this.mask.get(x, y);
        let bright = (m[0] + m[1] + m[2]) / 3;

        if (bright > 40) {  // only draw strokes where mask is bright (sky area)
          let c = baseImg.get(x, y); //use colours from base image
          stroke(c[0], c[1], c[2], 200);
          strokeWeight(3); // make each line 3 pixels thick

      // wave movement per pixel
      let yShift = sin((x * 0.5) + (frameCount * 0.005 * skySpeed)) * 3; //vertical wave motion
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

if (bright < 10) continue;

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

class HillsArea {
  constructor(maskImg){this.mask = maskImg;}
  
  drawPoints(){
    for (let i = 0; i < 250; i++){
      let x = random(width);
      let y = random(height);

//Black and White Mask
      let m = this.mask.get(int(x), int(y));
      let bright = (m[0] + m[1] + m[2]) /3;
      if (bright < 10) continue;

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
      if (bright < 10) continue;

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
constructor(maskImg, img) {
    this.mask = maskImg;
    this.img = img;
    this.scale = 1; //initial scale
  }

  drawGuy() {
    //check if mouse is over the guy's mask
    let hover = false;
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
      const m = this.mask.get(mouseX, mouseY);
      const bright = (m[0] + m[1] + m[2]) / 3;
      hover = bright > 100;
    }

    //animation
    this.scale = lerp(this.scale, hover ? 1.3 : 1.0, 0.1);

    //draw the guy
    push();
    imageMode(CENTER);
    translate(width/ 2, height / 2);
    scale(this.scale);
    image(this.img, 0, 0);
    pop();
  }
}
