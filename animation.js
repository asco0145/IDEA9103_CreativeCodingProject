let svg = document.getElementById("basesvg");

let baseImg, skyMask, waterMask, hillsMask, bridgeMask, guyMask;
let sky, water, hills, bridge, guy;

let numSegments = 50;
let segments = [];

let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};
let canvasAspectRatio = 0;

function preload(){

baseImg = loadImage("assets/scream.jpeg")
guyMask = loadImage("assets/man.png")
skyMask = loadImage("assets/sky.png")
waterMask = loadImage("assets/waterDots.png")

sky = new WaveArea(skyMask);
water = new WaveArea(waterMask);


}

function setup() {

createCanvas(500, 600);
angleMode(DEGREES);
imgDrwPrps.aspect = baseImg.width / baseImg.height;

baseImg.resize(width,height);
skyMask.resize(width, height);
waterMask.resize(width,height);
guyMask.resize(width,height);


let segmentWidth = baseImg.width / numSegments;
let segmentHeight = baseImg.height / numSegments;

for (let segYPos=0; segYPos<baseImg.height; segYPos+=segmentHeight) {
    //this is looping over the height
    for (let segXPos=0; segXPos<baseImg.width; segXPos+=segmentWidth) {
      //this loops over width
      //This will create a segment for each x and y position
      let segmentColour = baseImg.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      let segment = new ImageSegment(segXPos,segYPos,segmentWidth,segmentHeight, segmentColour);
      segments.push(segment);
    }
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateImageDrawProps();
}

function calculateImageDrawProps() {
  //Calculate the aspect ratio of the canvas
  canvasAspectRatio = width / height;
  //If the image is wider than the canvas
  if (imgDrwPrps.aspect > canvasAspectRatio) {
    //then we will draw the image to the width of the canvas
    imgDrwPrps.width = width;
    //and calculate the height based on the aspect ratio
    imgDrwPrps.height = width / imgDrwPrps.aspect;
    imgDrwPrps.yOffset = (height - imgDrwPrps.height) / 2;
    imgDrwPrps.xOffset = 0;
  } else if (imgDrwPrps.aspect < canvasAspectRatio) {
    //Otherwise, we will draw the image to the height of the canvas
    imgDrwPrps.height = height;
    //and calculate the width based on the aspect ratio
    imgDrwPrps.width = height * imgDrwPrps.aspect;
    imgDrwPrps.xOffset = (width - imgDrwPrps.width) / 2;
    imgDrwPrps.yOffset = 0;
  }
  else if (imgDrwPrps.aspect == canvasAspectRatio) {
    //If the aspect ratios are the same then we can draw the image to the canvas size
    imgDrwPrps.width = width;
    imgDrwPrps.height = height;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = 0;
  }
}

function draw() {
   let t = millis() / 1000;
   if (t<3){
   for (const segment of segments) {
    segment.drawSegment();
  }
}
if (t>=3 && t<5){
  image(baseImg, 0, 0);
}

if (t>=5 && t<10){
  water.drawStrokes();
  sky.drawStrokes();
  image(guyMask,0,0);
}

if(t>=10)
{



  translate(width / 2, width / 2);
  rotate(frameCount * 6);
  let translateX = sin(frameCount) * width / 8;
  let translateY = cos(frameCount) * height / 4; 
  
  // Move the origin position again using translateX and translateY
  translate(translateX, translateY); 
  
  image(guyMask,0,-40);
  image(guyMask,0,0);


}
}


class WaveArea {
  constructor(maskImg){
    this.mask = maskImg;

  }
drawStrokes() {
  for (let y = 0; y < height; y += 6) { //loops through the y axis of the canvas in steps of 6 pixels

    let offset = sin((frameCount * 2 + y * 3)) * 10; // horizontal left right movement

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



class ImageSegment {
  constructor(srcImgSegXPosInPrm,srcImgSegYPosInPrm,srcImgSegWidthInPrm,srcImgSegHeightInPrm, srcImgSegColourInPrm) {
    //these parameters are used to set the internal properties of an instance of the segment
    //These parameters are named as imageSource as they are derived from the image we are using
    this.srcImgSegXPos = srcImgSegXPosInPrm;
    this.srcImgSegYPos = srcImgSegYPosInPrm;
    this.srcImgSegWidth = srcImgSegWidthInPrm;
    this.srcImgSegHeight = srcImgSegHeightInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
  }

  drawSegment() {

    stroke(0);
    fill(this.srcImgSegColour);
    rect(this.srcImgSegXPos,this.srcImgSegYPos,this.srcImgSegWidth,this.srcImgSegHeight);
  }

}


