let baseImg, skyMask;
let sky;


function preload(){
baseImg = loadImage("TheScream.png");
  skyMask = loadImage("theScreamSky.png")
  
  sky = new SkyArea(skyMask);
}


function setup() {
  createCanvas(baseImg.width, baseImg.height);


  skyMask.resize(width, height);


  //image(baseImg, 0, 0);
}


function draw() {
  //background(220);

  sky.drawStrokes();

  
  
}


class SkyArea {
constructor(maskImg){
    this.mask = maskImg;

}


drawStrokes() {
  for (let y = 0; y < height; y += 6) { //loops through the y axis of the canvas in steps of 6 pixels

    let offset = sin(radians(frameCount * 2 + y * 3)) * 10; // horizontal left right movement

    for (let x = 0; x < width; x += 12) { //each iteration draws one short stroke, 10 pixels wide, along the row
      let c = baseImg.get(x, y); //use colours from base image
      stroke(c[0], c[1], c[2], 200);
      strokeWeight(3); // make each line 3 pixels thick

      // wave movement per pixel
      let yShift = sin((x * 0.5) + (frameCount * 0.5)) * 3; //vertical wave motion
      line(x + offset, y + yShift, x + 10 + offset, y + yShift); // horizontal line
    }
  }
}
}

