//defined variables to hold asset images
let baseImg, skyMask, waterMask, hillsMask, bridgeMask, guyMask;

//variables to store the object returned from classes
let sky, water;

//variable to divide canvas into segments.
let numSegments = 50;

//array to store the segments in an array
let segments = []; 

// array to hold snowflake objects
let snowflakes = [];

//to hold the draw properties of the image. For responsive design
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};
let canvasAspectRatio = 0;

//to load images
function preload(){

baseImg = loadImage("assets/scream.jpeg")
guyMask = loadImage("assets/man.png")
skyMask = loadImage("assets/sky.png")
waterMask = loadImage("assets/waterDots.png")
sky = new WaveArea(skyMask);
water = new WaveArea(waterMask);
}

//to setup tasks like creating the canvas and initialising variables
function setup() {
createCanvas(500, 600);
angleMode(DEGREES); 

//to calculate the aspect ratio of the image
imgDrwPrps.aspect = baseImg.width / baseImg.height;


//resize images to fit frame
baseImg.resize(width,height);
skyMask.resize(width, height);
waterMask.resize(width,height);
guyMask.resize(width,height);

//to calculate segment dimensions
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

   // Create snowflake objects
  for (let i = 0; i < 300; i++) {
    // Add a new snowflake object to the array
    snowflakes.push(new Snowflake());
  }

}

//makes frame responsive
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

//to draw timed animation
function draw() {
   let t = millis() / 1000; //millis() tells how much time has passed since the sketch started running
   
   //start with pixelated canvas
   if (t<3){
   for (const segment of segments) {
    segment.drawSegment();
  }
}

//reveal image
if (t>=3 && t<5){
  image(baseImg, 0, 0);
}

//start wave animation
if (t>=5 && t<10){
  water.drawStrokes();
  sky.drawStrokes();
  image(guyMask,0,0);
}

//start spiral animation
if(t>=10 && t<17)
{
  translate(width / 2, width / 2);
  rotate(frameCount * 6);
  let translateX = sin(frameCount) * width / 8;
  let translateY = cos(frameCount) * height / 4; 
  
  // Move the origin position again using translateX and translateY
  translate(translateX, translateY); 
  
  //to set guy position
  image(guyMask,0,-40);
  image(guyMask,0,0);

}
//clear animation
if(t>=17 && t<20){

   background(0);
}

//snmowflake animation
if(t>=20){
  // Update and display each snowflake in the array
  let currentTime = frameCount / 60;

  for (let flake of snowflakes) {
    // Update each snowflake position and display
    flake.update(currentTime);
    flake.display();
  }
}

}
//class for the wave animation
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


//class to segment images
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
    fill(this.srcImgSegColour); //to pick color for each segment
    rect(this.srcImgSegXPos,this.srcImgSegYPos,this.srcImgSegWidth,this.srcImgSegHeight); //draw segment
  }
}


//class for snowflake effect
class Snowflake {
  constructor() {
    this.posX = 0;
    this.posY = random(-height, 0);
    this.initialAngle = random(0, 360);
    this.size = random(2, 5);
    this.radius = sqrt(random(pow(width / 2, 2)));
    this.color = color(random(200, 256), random(200, 256), random(200, 256));
  }

  update(time) {
    // Define angular speed (degrees / second)
    let angularSpeed = 35;

    // Calculate the current angle
    let angle = this.initialAngle + angularSpeed * time;

    // x position follows a sine wave
    this.posX = width / 2 + this.radius * sin(angle);

    // Different size snowflakes fall at different y speeds
    let ySpeed = 8 / this.size;
    this.posY += ySpeed;

    // When snowflake reaches the bottom, move it to the top
    if (this.posY > height) {
      this.posY = -50;
    }
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.posX, this.posY, this.size);
  }
}